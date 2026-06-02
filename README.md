# 🎬 鑫艺影像馆 - 经典电影自由分享平台

![鑫艺影像馆 logo](logo.png)

> 一个专业级的经典电影播放平台，采用最新的流媒体技术和 CDN 加速

## ✨ 核心特性

### 🎥 电影展示
- **主页首页** (`index.html`) - 精选电影展示，分类浏览
- **电影详情页** (`detail.html`) - 完整信息展示（封面、导演、演员、评分、剧情）
- **收藏页** (`favorites.html`) - 基于本地收藏列表展示已收藏影片
- **直播入口** (`live.html`) - 实时电影直播频道与推流体验
- **推荐系统** - 基于类型的相关电影推荐
- **继续观看** - 使用 `localStorage` 保存 `progress_影片ID`，再次播放自动续播

### ⚡ 流媒体播放 (StreamPlayer)
高性能播放器引擎 (`player.js`)：

#### 🌐 HLS 流媒体支持
- 使用 `hls.js` 库（CDN 加载：jsDelivr）
- 以 HLS (.m3u8) 为主播放格式
- Safari 原生 HLS 自动识别

#### 🎬 自适应码率 (ABR)
- 根据网络速度动态调整 (0.5Mbps ~ 8Mbps)
- 平滑缓冲无卡顿
- 支持手动画质切换

#### 📊 高级播放器控制
```
▶ 播放/暂停 | 进度条 | 时间显示 | 
1x 播放速度 (0.5x~2x) | 🎬 画质选择 | ⛶ 全屏
```

#### 🔄 缓冲优化
- **实时缓冲进度条** - 可视化显示已缓冲内容
- **缓冲状态提示** - "缓冲中..." 动画反馈
- **智能预加载** - maxLoadingDelay: 4秒
- **HLS 优先** - 生产片源使用多码率 HLS，避免超大 MP4 直连

### 🚀 CDN 加速方案

#### 资源加载
```html
<!-- HLS.js 通过 jsDelivr CDN 加载 -->
<script src="https://cdn.jsdelivr.net/npm/hls.js@latest"></script>
```

#### 性能优化
- 懒加载（Lazy Loading）
- 图片 CDN 优化（Unsplash）
- 预加载策略
- 网络状态检测

#### 网络监控
- 实时带宽检测
- 自适应预加载
- 在线/离线状态指示

### 📱 完全响应式
- 移动端优化
- 触屏友好
- 从手机到 4K 自适应

## 🏗️ 项目结构

```
.
├── index.html           # 主页 - 电影列表、分类、播放
├── detail.html          # 电影详情页 - 完整信息 + 推荐
├── favorites.html       # 收藏页 - localStorage 收藏列表
├── live.html            # 直播入口 - 实时电影直播频道
├── player.js            # 高性能播放器引擎
├── style.css            # 样式（集成至 HTML）
├── script.js            # 脚本（集成至 HTML）
├── logo.png             # 品牌 logo，统一页面头部显示
├── logo02.svg           # 备用矢量 logo
└── README.md            # 本文件
```

> 所有页面头部 logo 均使用 `logo.png` 作为统一品牌标识。
## 🎯 使用流程

```
主页 (index.html)
    ↓ 点击电影卡片
详情页 (detail.html?id=X)
    ↓ 点击播放
StreamPlayer 高性能播放
    ├─ HLS 流媒体加载
    ├─ 自适应码率调整
    ├─ 缓冲进度显示
    └─ 画质动态切换
```

详情页 URL 保持 `detail.html?id=1` 这种查询参数形式。Cloudflare Pages 和 GitHub Pages 直接刷新该地址通常可以命中静态文件；不要改成 `/movie/1` 伪静态路径，除非同时配置好对应的 rewrite 规则，否则刷新或外部分享容易 404。

## 💡 播放器 API 文档

### 初始化
```javascript
const player = new StreamPlayer(videoElement, {
    autoplay: true,
    hlsConfig: {
        maxLoadingDelay: 4,      // 最大加载延迟
        maxAutoBitrate: 8000000, // 最大码率 8Mbps
        startLevel: -1           // -1 = 自动选择
    }
});
```

### 控制方法
```javascript
player.play();
player.pause();
player.seek(time);                    // 跳转到指定时间
player.setVolume(0.8);                // 音量 0-1
player.setPlaybackRate(1.5);          // 播放速度
player.setQuality(levelIndex);        // 切换画质
player.requestFullscreen();           // 全屏

const levels = player.getQualityLevels();  // 获取画质列表
const stats = player.getStats();           // 获取统计信息
```

### 事件监听
```javascript
player.on('play', () => console.log('开始播放'));
player.on('pause', () => console.log('暂停'));
player.on('buffering', () => console.log('缓冲中'));
player.on('buffered', () => console.log('缓冲完成'));
player.on('qualitychange', (data) => {
    console.log(`切换到 ${data.height}p (${data.bitrate}bps)`);
});
player.on('progress', (data) => {
    console.log(`进度: ${data.current}s / ${data.duration}s`);
});
player.on('error', (error) => console.error('错误:', error));
```

## 📊 播放器特性

| 特性 | 说明 |
|------|------|
| **HLS 流媒体** | 自动识别 Safari / hls.js 支持 |
| **自适应码率** | 根据网络自动调整 0.5~8Mbps |
| **缓冲优化** | 进度条 + 缓冲状态 + 预加载 |
| **画质选择** | 手动切换 360p/480p/720p 等 |
| **播放速度** | 0.5x / 0.75x / 1x / 1.25x / 1.5x / 2x |
| **全屏支持** | 全屏和小窗口模式 |
| **播放源策略** | 生产环境统一使用 HLS `index.m3u8` |
| **网络监控** | 实时带宽检测和离线提示 |

## 🌍 依赖库

- **HLS.js** - CDN 加载 (jsDelivr)
  ```
  https://cdn.jsdelivr.net/npm/hls.js@latest
  ```

## 🚀 生产环境推荐

### 视频源格式
```
推荐 HLS 多码率方案：
├─ index.m3u8
├─ 720p/index.m3u8 (约 2.8Mbps, 1280x720)
├─ 480p/index.m3u8 (约 1.4Mbps, 854x480)
└─ 360p/index.m3u8 (约 0.8Mbps, 640x360)
```

生产环境不要把超大 MP4 作为网页主播放地址。MP4 即使支持 Range，也很难解决移动端耗流量、无法自适应码率、大片 seek 卡顿和 CDN/回源压力问题。主片源统一转成多码率 HLS 后上传到 R2/CDN，再在电影数据里填写 `hlsUrl`，`videoUrl` 保持空字符串。

上传前确认 HLS 是 master playlist，而不是只有 `#EXTINF` 分片列表的单路 media playlist。单路清单没有 `#EXT-X-STREAM-INF`、`BANDWIDTH`、`RESOLUTION` 信息时，播放器无法提供真实画质选择，浏览器也更容易直接暴露编码兼容问题。

网页兼容转码目标：

- 视频：H.264 `yuv420p`，720p/480p/360p 多码率，25fps，GOP 约 2 秒
- 音频：AAC-LC，双声道，48kHz
- 避免直接上传 1080p/50fps/High profile 单码率 HLS；这类源可能触发 `DECODER_ERROR_NOT_SUPPORTED`

推荐链路：

```text
OBS / FFmpeg
    ↓
MediaMTX
    ↓
HLS
    ↓
Cloudflare CDN / R2
    ↓
网页播放器
```

本地转码示例：

```bash
tools/transcode-hls.sh the_circus.mp4 dist/hls/the-circus
```

上传 `dist/hls/the-circus/` 到对象存储后，将电影数据配置为：

```javascript
{
    hlsUrl: "https://your-cdn.example.com/hls/the-circus/index.m3u8",
    videoUrl: ""
}
```

播放器会直接使用 `hlsUrl`。Safari 走原生 HLS，其他现代浏览器走 hls.js。

### CDN 提供商
- **Cloudflare** - 全球加速 + R2 存储
- **jsDelivr** - 开源 CDN（库）
- **阿里云 CDN** - 国内加速
- **AWS CloudFront** - 国际加速

### 监控指标
```javascript
// 集成分析（Google Analytics）
player.on('qualitychange', (data) => {
    ga('send', 'event', 'video_quality', {
        height: data.height,
        bitrate: data.bitrate
    });
});
```

## 📈 性能基准

| 指标 | 目标 | 实现 |
|------|------|------|
| 首屏加载 | < 2s | ✅ 预加载 + CDN |
| 播放启动 | < 1s | ✅ HLS + ABR |
| 缓冲率 | < 3% | ✅ 自适应码率 |
| 平均码率 | 2~4Mbps | ✅ 网络自适应 |
| 内存占用 | < 100MB | ✅ 高效管理 |

## 🔐 安全性
- ✅ 经典电影内容展示
- ✅ HTTPS 传输支持
- ✅ CORS 正确配置
- ✅ 内容安全策略 (CSP)

## 📄 许可证

本项目展示经典电影内容，可按实际授权情况自由替换片源和资料。

---

**最后更新**: 2026年5月4日

**版本**: 2.0.0 (HLS + StreamPlayer)

**技术栈**: HTML5 + CSS3 + Vanilla JavaScript

**CDN**: jsDelivr + Unsplash

**主要特性**: 
- ⚡ HLS 流媒体
- 🎬 自适应码率
- 🚀 CDN 加速
- 📱 完全响应式
