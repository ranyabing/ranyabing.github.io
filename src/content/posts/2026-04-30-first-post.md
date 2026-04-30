---
title: "博客初始化记录"
description: "记录这个技术博客的本地目录、写作方式和部署流程。"
pubDate: 2026-04-30
tags: ["博客", "Astro", "GitHub Pages"]
draft: false
---

## 目标

这个博客用于沉淀技术文章。文章保存在本地仓库的 `src/content/posts/` 目录中，使用 Markdown 编写，推送到 GitHub 后自动发布到 GitHub Pages。

## 写作方式

新增文章时，在 `src/content/posts/` 下创建一个 Markdown 文件，并在文件开头填写文章元信息：

```md
---
title: "文章标题"
description: "一句话说明文章内容"
pubDate: 2026-04-30
tags: ["主题"]
draft: false
---
```

`draft: true` 可以用于保存草稿，草稿不会出现在正式站点中。

## 部署方式

仓库推送到 `main` 分支后，GitHub Actions 会运行构建流程，并把 `dist/` 目录发布到 GitHub Pages。
