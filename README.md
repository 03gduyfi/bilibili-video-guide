# B站视频导引网站

仿 B 站风格的视频导引单页网站，包含登录、首页、导航、播放、搜索、个人中心、上传等页面。

## 在线访问（GitHub Pages）

**https://03gduyfi.github.io/bilibili-video-guide/**

（7 个页面：登录、首页、视频导航、播放、个人中心、搜索、上传）

### 一键部署

1. 在 [GitHub Token 设置](https://github.com/settings/tokens) 创建 Token（勾选 `repo`）
2. PowerShell 执行：

```powershell
cd "c:\Users\29352\Desktop\软件"
$env:GITHUB_TOKEN = "你的token"
node deploy-github.js
```

详细步骤见 [部署说明.md](./部署说明.md)

## 本地预览

直接用浏览器打开 `index.html` 即可。

## 技术栈

- HTML + CSS + JavaScript（单页应用，无构建依赖）
