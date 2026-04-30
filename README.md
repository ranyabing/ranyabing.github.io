# ranyabing.github.io

个人技术博客，使用 Astro 生成静态站点并部署到 GitHub Pages。

## 本地开发

```bash
npm install
npm run dev
```

默认本地地址是 `http://localhost:4321/`。

## 写文章

文章放在 `src/content/posts/`，文件名建议使用日期前缀：

```text
src/content/posts/2026-04-30-example.md
```

文章头部格式：

```md
---
title: "文章标题"
description: "一句话说明文章内容"
pubDate: 2026-04-30
tags: ["工程实践", "Python"]
draft: false
---
```

`draft: true` 的文章不会出现在构建后的站点里。

## 部署

推送到 `main` 分支后，`.github/workflows/deploy.yml` 会构建并发布到 GitHub Pages。仓库的 Pages source 需要设置为 `GitHub Actions`。
