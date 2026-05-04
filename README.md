# 🎬 鑫艺影像馆 - 公版经典电影自由分享平台

![鑫艺影像馆 logo](logo.png)

> 一个专业级的公有领域电影播放平台，采用最新的流媒体技术和 CDN 加速

## ✨ 核心特性

### 🎥 电影展示
- **主页首页** (`index.html`) - 精选电影展示，分类浏览
- **电影详情页** (`detail.html`) - 完整信息展示（封面、导演、演员、评分、剧情）
- **直播入口** (`live.html`) - 实时电影直播频道与推流体验
- **推荐系统** - 基于类型的相关电影推荐

### ⚡ 流媒体播放 (StreamPlayer)
高性能播放器引擎 (`player.js`)：

#### 🌐 HLS 流媒体支持
- 使用 `hls.js` 库（CDN 加载：jsDelivr）
- 支持 HLS (.m3u8) 和标准视频格式降级
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
- **自动降级** - 网络错误时自动切换到 MP4

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
├── live.html            # 直播入口 - 实时电影直播频道
├── player.js            # 高性能播放器引擎
├── style.css            # 样式（集成至 HTML）
├── script.js            # 脚本（集成至 HTML）
├── logo.png             # 品牌 logo，统一页面头部显示
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
| **错误降级** | 自动切换到 MP4 格式 |
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
├─ stream_720p.m3u8 (2.5Mbps, 1280x720)
├─ stream_480p.m3u8 (1.5Mbps, 854x480)
└─ stream_360p.m3u8 (0.8Mbps, 640x360)
```

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
- ✅ 公有领域内容（无版权问题）
- ✅ HTTPS 传输支持
- ✅ CORS 正确配置
- ✅ 内容安全策略 (CSP)

## 📄 许可证

本项目展示的所有电影均为公有领域作品，可自由使用、修改和分享。

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
