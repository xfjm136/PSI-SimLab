# 在 GitHub 上创建 PSI-SimLab

## 先退出 Import 页面

截图中的 **Import your project to GitHub** 用来克隆已有的远程 Git 仓库，不接收 ZIP 文件。当前源码无需填写源仓库 URL、用户名或 access token。

在 GitHub 右上角点 **+ → New repository**，或访问 https://github.com/new 。

## 新建仓库填写

| 字段 | 填写内容 |
| --- | --- |
| Owner | `xfjm136`（截图中的个人账号） |
| Repository name | `PSI-SimLab` |
| Description | `PS-InSAR study notes with interactive examples of phase wrapping, scatterer selection, parameter estimation and atmospheric correction. 中文 / English.` |
| Visibility | `Public`，用于公开展示和 GitHub Pages |
| Add a README file | 不勾选，源码包已经包含 README |
| Add .gitignore | `None` |
| Choose a license | `None`，源码包已经包含 MIT LICENSE |

然后点 **Create repository**。以上是填写建议，并未替你创建 GitHub 仓库。

## 上传源码

1. 解压下载的 ZIP，进入里面的 `PSI-SimLab` 文件夹。
2. 新仓库页面点 **uploading an existing file**；已有内容的仓库可用 **Add file → Upload files**。
3. 上传该文件夹里的内容，不要上传 ZIP，也不要把最外层 `PSI-SimLab` 文件夹再套一层。
4. 确认根目录能直接看到 `README.md`、`dist`、`tests` 和 `.github`。`.github` 文件夹必须保留，否则不会出现附带的发布工作流。
5. 提交说明可填 `Add PS-InSAR notes and interactive examples`，提交到默认分支。

上传后的主要路径：

- `README.md`
- `README_EN.md`
- `GITHUB_SETUP.md`
- `LICENSE`
- `dist/index.html`
- `dist/content.js`
- `dist/core.js`
- `dist/app.js`
- `dist/styles.css`
- `dist/assets/fonts/`（离线数学字体及许可）
- `tests/numerics.cjs`
- `tests/content.cjs`
- `.github/workflows/pages.yml`

如果仓库首页只显示一个 `PSI-SimLab` 文件夹，说明多套了一层目录，应把它里面的内容移到仓库根目录。

## 发布网页

1. 进入仓库 **Settings → Pages**。
2. 在 **Build and deployment → Source** 选择 **GitHub Actions**。
3. 进入 **Actions → Validate and deploy Pages → Run workflow**，选择默认分支并运行。
4. 工作流先执行数值与内容检查，然后发布 `dist/`。成功后，在工作流的 `github-pages` 环境或 Settings → Pages 中复制实际网址。
5. 打开网址，检查语言切换、重新随机、动画与数据导出。

仓库名为 PSI-SimLab、Owner 为 xfjm136 且未配置自定义域名时，默认项目地址通常为 `https://xfjm136.github.io/PSI-SimLab/`。以 GitHub 实际显示的地址为准；本说明不表示该地址已经发布。

如果 Actions 提示 Pages 尚未配置，完成第 2 步后重新运行失败的工作流。不要把 `dist/` 选成分支发布目录；当前包使用 Actions 发布。

## 仓库首页右侧 About

仓库创建后，在首页右侧 **About** 的齿轮中填写：

- **Description**：可继续使用建库时的英文简介。
- **Website**：填 GitHub Pages 成功后给出的实际网址。
- **Topics**：`insar`、`ps-insar`、`remote-sensing`、`geodesy`、`study-notes`、`data-visualization`、`javascript`、`github-pages`。

这是 GitHub 的仓库元信息，与网页中已删除的“关于”区块无关。网页内仍保留必要的模型条件与数据说明。

## 官方说明

- 创建仓库：https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-new-repository
- 上传文件：https://docs.github.com/en/repositories/working-with-files/managing-files/adding-a-file-to-a-repository
- Pages 发布源：https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site
