/**
 * 高性能流媒体播放器
 * 支持 HLS/DASH + 自适应码率 + CDN 加速
 */

class StreamPlayer {
    constructor(videoElement, options = {}) {
        this.video = videoElement;
        this.options = {
            autoplay: options.autoplay || false,
            preload: options.preload || 'metadata',
            hlsConfig: {
                enableWorker: true,
                lowLatencyMode: false,
                capLevelToPlayerSize: true,
                maxLoadingDelay: 4,
                maxBufferLength: 30,
                maxMaxBufferLength: 60,
                backBufferLength: 30,
                minAutoBitrate: 0,
                maxAutoBitrate: 5000000,
                startLevel: -1,
                emeEnabled: false,
                ...options.hlsConfig
            },
            ...options
        };
        
        this.hls = null;
        this.stats = {
            buffered: 0,
            bandwidth: 0,
            droppedFrames: 0,
            level: 0
        };
        this.isBuffering = false;
        this.listeners = {};
        this.currentUrl = '';
        this.fallbackUrl = '';
        this.hasTriedFallback = false;
        
        this.init();
    }

    init() {
        // 检查 HLS.js 支持
        if (window.Hls && Hls.isSupported()) {
            this.setupHLS();
        } else if (this.video.canPlayType('application/vnd.apple.mpegurl')) {
            // Safari 原生支持 HLS
            this.setupNativeHLS();
        } else {
            console.warn('HLS not supported, using fallback');
            this.setupFallback();
        }
        
        this.setupEventListeners();
    }

    setupHLS() {
        this.hls = new Hls(this.options.hlsConfig);
        
        // HLS 事件监听
        this.hls.on(Hls.Events.MANIFEST_PARSED, () => {
            this.emit('ready');
            if (this.options.autoplay) this.video.play();
        });

        this.hls.on(Hls.Events.LEVEL_SWITCHING, (e, data) => {
            this.stats.level = data.level;
            const levelInfo = this.hls.levels[data.level];
            this.emit('qualitychange', {
                level: data.level,
                bitrate: levelInfo.bitrate,
                height: levelInfo.height
            });
        });

        this.hls.on(Hls.Events.BUFFER_APPENDING, () => {
            this.isBuffering = true;
            this.emit('buffering');
        });

        this.hls.on(Hls.Events.BUFFER_APPENDED, () => {
            this.isBuffering = false;
            this.emit('buffered');
        });

        this.hls.on(Hls.Events.ERROR, (event, data) => {
            console.error('HLS Error:', data);
            if (data.fatal) {
                if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
                    this.hls.startLoad();
                    return;
                }

                if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
                    this.hls.recoverMediaError();
                    return;
                }

                if (this.fallbackUrl && !this.hasTriedFallback) {
                    this.hasTriedFallback = true;
                    this.load(this.fallbackUrl, 'auto');
                    return;
                }

                this.emit('error', data);
            }
        });

        // 自动选择最佳码率
        // this.hls.abrController.setAutoLevelCapping(-1);
    }

    setupNativeHLS() {
        // Safari 原生 HLS 支持
        this.video.addEventListener('loadedmetadata', () => {
            this.emit('ready');
            if (this.options.autoplay) this.video.play();
        });
    }

    setupFallback() {
        // 降级处理 - 直接使用 HTML5 Video
        this.video.addEventListener('canplay', () => {
            this.emit('ready');
            if (this.options.autoplay) this.video.play();
        });
    }

    setupEventListeners() {
        // Bind handler methods so they can be removed later
        this._onTimeUpdate = () => {
            const duration = this.video.duration;
            const currentTime = this.video.currentTime;
            const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
            this.emit('progress', { 
                current: currentTime, 
                duration: duration, 
                percent: progress 
            });
        };

        this._onProgress = () => {
            const buffered = this.getBufferedPercent();
            this.stats.buffered = buffered;
            this.emit('bufferprogress', { percent: buffered });
        };

        this._onPlay = () => this.emit('play');
        this._onPause = () => this.emit('pause');
        this._onEnded = () => this.emit('ended');
        this._onLoadStart = () => this.emit('loading');
        this._onCanPlay = () => this.emit('canplay');
        this._onWaiting = () => {
            this.isBuffering = true;
            this.emit('buffering');
        };
        this._onPlaying = () => {
            this.isBuffering = false;
            this.emit('buffered');
        };

        this._onError = (e) => {
            const error = this.video.error;
            if (this.fallbackUrl && !this.hasTriedFallback && this.video.currentSrc !== this.fallbackUrl) {
                this.hasTriedFallback = true;
                console.warn('StreamPlayer: primary source failed, trying fallback.', this.fallbackUrl);
                this.video.src = this.fallbackUrl;
                this.video.load();
                if (this.options.autoplay) {
                    this.video.play().catch((playError) => {
                        console.warn('StreamPlayer: fallback autoplay was blocked or delayed.', playError);
                    });
                }
                return;
            }
            this.emit('error', {
                code: error?.code,
                message: error?.message
            });
        };

        this._onOnline = () => this.emit('online');
        this._onOffline = () => this.emit('offline');

        // Attach all event listeners
        this.video.addEventListener('timeupdate', this._onTimeUpdate);
        this.video.addEventListener('progress', this._onProgress);
        this.video.addEventListener('play', this._onPlay);
        this.video.addEventListener('pause', this._onPause);
        this.video.addEventListener('ended', this._onEnded);
        this.video.addEventListener('loadstart', this._onLoadStart);
        this.video.addEventListener('canplay', this._onCanPlay);
        this.video.addEventListener('waiting', this._onWaiting);
        this.video.addEventListener('stalled', this._onWaiting);
        this.video.addEventListener('playing', this._onPlaying);
        this.video.addEventListener('error', this._onError);
        window.addEventListener('online', this._onOnline);
        window.addEventListener('offline', this._onOffline);
    }

    isHlsUrl(url) {
        return typeof url === 'string' && /\.m3u8(\?|$)/i.test(url);
    }

    load(url, type = 'hls', fallbackUrl = '') {
        this.currentUrl = url;
        this.fallbackUrl = fallbackUrl;
        this.hasTriedFallback = false;
        
        // Reset video element state before loading new source
        this.video.pause();
        this.video.preload = this.options.preload;
        if (this.hls) {
            this.hls.stopLoad();
            this.hls.detachMedia();
        }
        this.video.removeAttribute('src');
        this.video.load();
        
        const useHls = (type === 'hls' || type === 'auto') && this.isHlsUrl(url);

        if (useHls && this.hls) {
            this.hls.loadSource(url);
            this.hls.attachMedia(this.video);
            return;
        }

        if (type === 'hls' && !this.isHlsUrl(url)) {
            console.warn('StreamPlayer: received non-HLS url with hls mode, falling back to native playback.', url);
        }

        // 直接加载标准视频格式或原生 HLS
        this.video.src = url;
        this.video.load();
        if (this.options.autoplay) {
            this.video.play().catch((error) => {
                console.warn('StreamPlayer: autoplay was blocked or delayed.', error);
            });
        }
    }

    play() {
        return this.video.play();
    }

    pause() {
        this.video.pause();
    }

    seek(time) {
        this.video.currentTime = time;
    }

    getBufferedPercent() {
        const duration = this.video.duration;
        if (!duration) return 0;
        
        let bufferedEnd = 0;
        for (let i = 0; i < this.video.buffered.length; i++) {
            if (this.video.buffered.start(i) <= this.video.currentTime) {
                bufferedEnd = this.video.buffered.end(i);
            }
        }
        return (bufferedEnd / duration) * 100;
    }

    getQualityLevels() {
        if (!this.hls || !this.hls.levels) return [];
        return this.hls.levels.map((level, idx) => ({
            level: idx,
            bitrate: level.bitrate,
            height: level.height,
            width: level.width
        }));
    }

    setQuality(level) {
        if (this.hls) {
            this.hls.currentLevel = level;
        }
    }

    on(event, callback) {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        this.listeners[event].push(callback);
    }

    off(event, callback) {
        if (!this.listeners[event]) return;
        const idx = this.listeners[event].indexOf(callback);
        if (idx > -1) {
            this.listeners[event].splice(idx, 1);
        }
    }

    emit(event, data) {
        if (!this.listeners[event]) return;
        this.listeners[event].forEach(cb => cb(data));
    }

    dispose() {
        // Remove all event listeners from video element
        this.video.removeEventListener('timeupdate', this._onTimeUpdate);
        this.video.removeEventListener('progress', this._onProgress);
        this.video.removeEventListener('play', this._onPlay);
        this.video.removeEventListener('pause', this._onPause);
        this.video.removeEventListener('ended', this._onEnded);
        this.video.removeEventListener('loadstart', this._onLoadStart);
        this.video.removeEventListener('canplay', this._onCanPlay);
        this.video.removeEventListener('waiting', this._onWaiting);
        this.video.removeEventListener('stalled', this._onWaiting);
        this.video.removeEventListener('playing', this._onPlaying);
        this.video.removeEventListener('error', this._onError);
        
        // Remove window event listeners
        window.removeEventListener('online', this._onOnline);
        window.removeEventListener('offline', this._onOffline);
        
        if (this.hls) {
            this.hls.destroy();
            this.hls = null;
        }
        
        // Clear video source
        this.video.src = '';
        this.video.load();
        
        this.listeners = {};
    }

    // 获取当前播放统计
    getStats() {
        return {
            ...this.stats,
            isBuffering: this.isBuffering,
            currentTime: this.video.currentTime,
            duration: this.video.duration,
            paused: this.video.paused
        };
    }

    // 设置播放速度
    setPlaybackRate(rate) {
        this.video.playbackRate = rate;
    }

    // 音量控制
    setVolume(volume) {
        this.video.volume = Math.max(0, Math.min(1, volume));
    }

    // 全屏
    requestFullscreen() {
        if (this.video.requestFullscreen) {
            this.video.requestFullscreen();
        } else if (this.video.webkitRequestFullscreen) {
            this.video.webkitRequestFullscreen();
        }
    }
}

// 导出到全局作用域
window.StreamPlayer = StreamPlayer;
