# ranyabing.github.io

个人技术博客，使用 Astro 生成静态站点并部署到 GitHub Pages。

## 本地开发

```bash
npm install
npm run dev
```

默认本地地址是 `http://localhost:4321/`。

## 写文章

文章放在 `src/content/posts/`，使用 Markdown 编写。文件名建议使用日期前缀，后半部分用英文小写和短横线，生成后的文章地址会来自文件名：

```text
src/content/posts/2026-04-30-example.md
```

新建文章时，先复制下面这段文章头部：

```md
---
title: "文章标题"
description: "一句话说明文章内容"
pubDate: 2026-04-30
updatedDate: 2026-04-30
tags: ["工程实践", "Python"]
draft: false
---

从这里开始写正文。
```

字段说明：

- `title`：文章标题。
- `description`：文章摘要，会显示在文章列表和页面描述里。
- `pubDate`：发布日期，格式建议用 `YYYY-MM-DD`。
- `updatedDate`：可选，文章更新日期；没有更新时可以删掉这一行。
- `tags`：文章标签，可以为空数组 `[]`。
- `draft`：是否为草稿。`draft: true` 的文章不会出现在构建后的站点里。

正文支持普通 Markdown，例如：

````md
## 小标题

这里是一段正文。

- 列表项
- 另一项

```ts
console.log("hello");
```
````

如果正文里要展示代码块，并且 README 里这段嵌套代码不好复制，可以直接参考已有文章：`src/content/posts/2026-04-30-first-post.md`。

## 本地预览

写完文章后，在本地启动预览：

```bash
npm run dev
```

打开 `http://localhost:4321/`，检查首页、文章列表和文章详情页。修改 Markdown 后，开发服务器会自动刷新。

发布前建议跑一次构建：

```bash
npm run build
```

构建通过后，说明文章格式和页面生成没有明显问题。

## 部署

推送到 `main` 分支后，`.github/workflows/deploy.yml` 会自动构建并发布到 GitHub Pages。仓库的 Pages source 需要设置为 `GitHub Actions`。

常用发布命令：

```bash
git status
git add src/content/posts/2026-04-30-example.md
git commit -m "Add example post"
git push origin main
```

推送后到 GitHub 仓库的 Actions 页面查看 `Deploy to GitHub Pages` 是否成功。成功后，文章会发布到：

```text
https://ranyabing.github.io/posts/2026-04-30-example/
```

如果文章没有出现，优先检查：

- 文件是否放在 `src/content/posts/`。
- 文件头部的 `draft` 是否为 `false`。
- `pubDate` 日期格式是否正确。
- GitHub Actions 是否构建成功。
