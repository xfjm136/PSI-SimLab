# PSI-SimLab

PS-InSAR 学习笔记，配有浏览器端数值算例。

[在线演示](https://xfjm136.github.io/PSI-SimLab/) · [English](README_EN.md)

整理相位与位移、振幅离散度、模糊度函数、网络平差、大气预测和时序拟合。每节将记号、公式、推导与算例放在一起，支持中英文切换。

公式使用原生 MathML，配套 Latin Modern Math 字体保存在项目内，分式、求和及上下标不依赖外部 CDN 或运行时公式库。

## 笔记内容

| 章节 | 内容 | 可调参数 |
| --- | --- | --- |
| 01 相位观测 | 连续相位与 [−π, π) 主值映射 | LOS 速度 |
| 02 候选点筛选 | 180 个像元的振幅离散度 | 门限 |
| 03 模糊度函数 | 联合搜索速度与高程残差 | 相位噪声 |
| 04 网络平差 | 由弧差值恢复相对点速度 | 弧偏差、已知异常弧剔除 |
| 05 大气预测 | 对大气残差做简单克里金 | 相关长度 |
| 06 模型检验 | 线性与年周期模型的残差比较 | 季节幅度、拟合模型 |

振幅、相位噪声、大气采样和时序噪声在打开页面时随机生成。点击“重新随机”可更换当前样本；调整参数、切换语言或重置参数时保留这组样本。相位转换和给定弧差值的网络平差没有随机观测，因此不显示采样按钮。

动画支持暂停、进度拖动及 0.5×、1×、2× 倍速。模糊度函数演示显示已搜索候选中的最优值，大气演示按进度应用改正；其余指标显示完整解。

## 阅读与交互

打开[在线演示](https://xfjm136.github.io/PSI-SimLab/)，选择章节即可查看动画与对应推导。

也可以直接用浏览器打开 `dist/index.html`。所有资源均保存在项目内，无需后端或外部服务。

## 数据导出与复算

导出 JSON 包含参数、输入、结果、本次采样的随机种子和 `synthetic: true` 标记。页面不使用固定种子；导出种子用于复算某一次观测。没有随机观测的章节导出 `seed: null`。

`dist/core.js` 中的数值函数可独立调用：

```js
const PSI = require('./dist/core.js');

const observation = PSI.observations({
  seed: 123,
  noise: 0.25
});

const result = PSI.searchAF(observation);
console.log(result.best);
```

不传 `seed` 时生成新种子；传入同一 `seed` 可复现相同随机输入。大气函数调用形式为 `PSI.atmosphere(correlationLength, seed)`。

## 数值检查

安装 Node.js 后运行，无需安装 npm 依赖：

```bash
node tests/numerics.cjs
node tests/content.cjs
```

检查相位缠绕与单位换算、无噪声参数恢复、网络基准和闭合差、采样复现、空间预测以及模型遗漏。测试使用固定输入作为回归对照，与网页的随机采样分开。

## 单位与简化

- 约定朝向卫星的 LOS 位移为正：$d=-\Delta R$，$\varphi=4\pi d/\lambda$。
- 波长为 0.056 m，斜距为 800 km，入射角为 35°。界面速度单位为 mm/yr，内部转换为 m/yr。
- 六节各自使用合成数据，不构成完整处理链，不包含真实 SLC 预处理或地区监测结果。
- 模糊度函数采用二维网格搜索；网络算例调整连续速度，异常弧位置已知。
- 大气算例假定残差已从时序中分离，使用固定协方差模型，不估计变差函数和未知趋势。
- LOS 速度不能直接当作垂直沉降速度。实际分析还需考虑观测几何、相关噪声与模型适用性。

## 文件

| 路径 | 内容 |
| --- | --- |
| `dist/index.html` | 页面结构 |
| `dist/content.js` | 中英文笔记、记号和参考文献 |
| `dist/core.js` | 数值函数 |
| `dist/app.js` | 绘图、采样、动画与导出 |
| `dist/styles.css` | 排版与响应式样式 |
| `dist/assets/fonts/` | 数学字体与原始许可 |
| `tests/` | 数值与内容检查 |

## 参考文献

1. van Leijen, F. J. (2014). *Persistent Scatterer Interferometry based on geodetic estimation theory*. Doctoral thesis, Delft University of Technology. [DOI](https://doi.org/10.4233/uuid:5dba48d7-ee26-4449-b674-caa8df93e71e)

2. Ferretti, A., Prati, C., & Rocca, F. (2001). *Permanent scatterers in SAR interferometry*. IEEE Transactions on Geoscience and Remote Sensing, 39(1), 8–20. [DOI](https://doi.org/10.1109/36.898661)

3. Ferretti, A., Prati, C., & Rocca, F. (2000). *Nonlinear subsidence rate estimation using permanent scatterers in differential SAR interferometry*. IEEE Transactions on Geoscience and Remote Sensing, 38(5), 2202–2212. [DOI](https://doi.org/10.1109/36.868878)

4. Hooper, A., Zebker, H., Segall, P., & Kampes, B. (2004). *A new method for measuring deformation on volcanoes and other natural terrains using InSAR persistent scatterers*. Geophysical Research Letters, 31, L23611. [DOI](https://doi.org/10.1029/2004GL021737)

5. Hooper, A., Segall, P., & Zebker, H. (2007). *Persistent scatterer interferometric synthetic aperture radar for crustal deformation analysis, with application to Volcán Alcedo, Galápagos*. Journal of Geophysical Research: Solid Earth, 112, B07407. [DOI](https://doi.org/10.1029/2006JB004763)

6. Hanssen, R. F. (2001). *Radar Interferometry: Data Interpretation and Error Analysis*. Springer, Remote Sensing and Digital Image Processing, vol. 2. [DOI](https://doi.org/10.1007/0-306-47633-9)

7. Colesanti, C., Ferretti, A., Novali, F., Prati, C., & Rocca, F. (2003). *SAR monitoring of progressive and seasonal ground deformation using the permanent scatterers technique*. IEEE Transactions on Geoscience and Remote Sensing, 41(7), 1685–1701. [DOI](https://doi.org/10.1109/TGRS.2003.813278)

各节列出对应引用。原文版权归各作者；本仓库不分发论文或书籍 PDF，也不复制原图版。

## 许可

原创代码采用 [MIT 许可](LICENSE)。Latin Modern Math 字体保留其原始许可，详见 `dist/assets/fonts/`。
