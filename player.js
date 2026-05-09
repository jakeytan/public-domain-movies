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
                maxLoadingDelay: 4,
                minAutoBitrate: 0,
                maxAutoBitrate: 5000000,
                startLevel: 0,
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
                this.emit('error', data);
            }
        });

        // 自动选择最佳码率
        this.hls.abrController.setAutoLevelCapping(-1);
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
        // 播放进度
        this.video.addEventListener('timeupdate', () => {
            const duration = this.video.duration;
            const currentTime = this.video.currentTime;
            const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
            this.emit('progress', { 
                current: currentTime, 
                duration: duration, 
                percent: progress 
            });
        });

        // 缓冲进度
        this.video.addEventListener('progress', () => {
            const buffered = this.getBufferedPercent();
            this.stats.buffered = buffered;
            this.emit('bufferprogress', { percent: buffered });
        });

        // 播放状态
        this.video.addEventListener('play', () => this.emit('play'));
        this.video.addEventListener('pause', () => this.emit('pause'));
        this.video.addEventListener('ended', () => this.emit('ended'));
        this.video.addEventListener('loadstart', () => this.emit('loading'));
        this.video.addEventListener('canplay', () => this.emit('canplay'));
        
        // 错误处理
        this.video.addEventListener('error', (e) => {
            const error = this.video.error;
            this.emit('error', {
                code: error?.code,
                message: error?.message
            });
        });

        // 网络状态监听
        window.addEventListener('online', () => this.emit('online'));
        window.addEventListener('offline', () => this.emit('offline'));
    }

    isHlsUrl(url) {
        return typeof url === 'string' && /\.m3u8(\?|$)/i.test(url);
    }

    load(url, type = 'hls') {
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
        if (this.hls) {
            this.hls.destroy();
        }
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
