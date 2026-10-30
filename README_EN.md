# PSI-SimLab

Study notes on PS-InSAR, with numerical examples that run in the browser.

[Live demo](https://xfjm136.github.io/PSI-SimLab/) · [中文](README.md)

The notes cover phase and displacement, amplitude dispersion, the ambiguity function, network adjustment, atmospheric prediction, and time-series fitting. Each section places notation, equations, derivations, and an interactive example together. The website supports Chinese and English.

Equations use native MathML with a locally bundled Latin Modern Math font. Fractions, summations, and scripts render without an external CDN or a runtime equation library.

## Topics

| Section | Content | Adjustable parameters |
| --- | --- | --- |
| 01 Phase observations | Continuous phase and wrapping into [−π, π) | LOS velocity |
| 02 Candidate selection | Amplitude dispersion across 180 pixels | Selection threshold |
| 03 Ambiguity function | Joint search for velocity and residual height | Phase noise |
| 04 Network adjustment | Relative point velocities from arc differences | Arc bias, removal of a known anomalous arc |
| 05 Atmospheric prediction | Simple kriging of atmospheric residuals | Correlation length |
| 06 Model assessment | Residual comparison between linear and annual models | Seasonal amplitude, fitted model |

Amplitude samples, phase noise, atmospheric samples, and time-series noise are generated randomly when the page opens. Resampling replaces the current sample. Parameter changes, language switching, and parameter resets retain it. Phase conversion and network adjustment use deterministic inputs and therefore have no resampling control.

Animations support pause, timeline scrubbing, and 0.5×, 1×, and 2× playback.
The six chapters prioritize linked numerical graphics, with equations, derivations and chapter references directly below the plots. Phase playback advances physical time; candidate selection accumulates acquisitions; AF playback replays a precomputed grid search with separate trial, best and truth markers. Network playback applies a selected arc bias and recomputes the adjustment, with a selectable reference. Atmospheric playback applies a correction fraction and exposes kriging weights at a selected location. Time-series playback starts with 12 acquisitions and refits both models as each new acquisition arrives; curves, components, velocities and residuals update together.

The interface uses a monochrome shell and muted plot colors. Plots use the full content width, with controls and metrics below them. Sticky chapter navigation, related chapters and a chapter selector support comparison. Equations, derivations and citations appear directly below each plot; the full bibliography is listed on the page. Chapters play once on entry unless disabled; reduced-motion preferences disable automatic playback.

## Reading and interaction

Open the [live demo](https://xfjm136.github.io/PSI-SimLab/) and select a section to view its animation and derivation.

For offline reading, open `dist/index.html` directly in a browser. All resources are included in the project; no backend or external service is required.

Run `python -m http.server 8000 --bind 127.0.0.1 --directory dist` and visit `http://localhost:8000`. Use `?stage=3&lang=en#lab` for a direct chapter link.

## Data export and reproduction

JSON exports (schema version 4) contain parameters, inputs, complete results, the displayed `currentView`, playback progress, the seed used for the current sample, and a `synthetic: true` flag. The website does not use a fixed seed. Exported seeds allow a particular observation set to be reproduced. Sections without random observations export `seed: null`.

The numerical functions in `dist/core.js` can also be called independently:

```js
const PSI = require('./dist/core.js');

const observation = PSI.observations({
  seed: 123,
  noise: 0.25
});

const result = PSI.searchAF(observation);
console.log(result.best);
```

Omitting `seed` generates a new seed. Supplying the same seed reproduces the same random inputs. The atmospheric function accepts `PSI.atmosphere(correlationLength, seed)`.

## Numerical checks

With Node.js installed, run the following commands. No npm dependencies are required.

```bash
node tests/numerics.cjs
node tests/content.cjs
```

The checks cover phase wrapping and unit conversion, noiseless parameter recovery, the network datum and closure errors, sample reproducibility, spatial prediction, and model omission. Tests use fixed inputs for regression checks, independently of random sampling in the website.

## Conventions and simplifications

- LOS displacement toward the satellite is positive: $d=-\Delta R$, with $\varphi=4\pi d/\lambda$.
- The wavelength is 0.056 m, slant range is 800 km, and incidence angle is 35°. Velocities are displayed in mm/yr and converted internally to m/yr.
- The six sections use separate synthetic datasets. They do not form a complete processing chain or include real SLC preprocessing or regional monitoring results.
- The ambiguity function uses a two-dimensional grid search. The network example adjusts continuous velocities and assumes the anomalous arc is known.
- The atmospheric example assumes that residuals have already been separated from the time series. It uses a fixed covariance model without estimating a variogram or an unknown trend.
- LOS velocity cannot be interpreted directly as vertical subsidence velocity. Practical analysis also requires attention to observation geometry, correlated noise, and model suitability.

## Files

| Path | Content |
| --- | --- |
| `dist/index.html` | Page structure |
| `dist/content.js` | Bilingual notes, notation, and references |
| `dist/core.js` | Numerical functions |
| `dist/app.js` | Plotting, sampling, animation, and export |
| `dist/styles.css` | Typography and responsive layout |
| `dist/assets/fonts/` | Mathematical font and original license |
| `tests/` | Numerical and content checks |

## References

1. van Leijen, F. J. (2014). *Persistent Scatterer Interferometry based on geodetic estimation theory*. Doctoral thesis, Delft University of Technology. [DOI](https://doi.org/10.4233/uuid:5dba48d7-ee26-4449-b674-caa8df93e71e)

2. Ferretti, A., Prati, C., & Rocca, F. (2001). *Permanent scatterers in SAR interferometry*. IEEE Transactions on Geoscience and Remote Sensing, 39(1), 8–20. [DOI](https://doi.org/10.1109/36.898661)

3. Ferretti, A., Prati, C., & Rocca, F. (2000). *Nonlinear subsidence rate estimation using permanent scatterers in differential SAR interferometry*. IEEE Transactions on Geoscience and Remote Sensing, 38(5), 2202–2212. [DOI](https://doi.org/10.1109/36.868878)

4. Hooper, A., Zebker, H., Segall, P., & Kampes, B. (2004). *A new method for measuring deformation on volcanoes and other natural terrains using InSAR persistent scatterers*. Geophysical Research Letters, 31, L23611. [DOI](https://doi.org/10.1029/2004GL021737)

5. Hooper, A., Segall, P., & Zebker, H. (2007). *Persistent scatterer interferometric synthetic aperture radar for crustal deformation analysis, with application to Volcán Alcedo, Galápagos*. Journal of Geophysical Research: Solid Earth, 112, B07407. [DOI](https://doi.org/10.1029/2006JB004763)

6. Hanssen, R. F. (2001). *Radar Interferometry: Data Interpretation and Error Analysis*. Springer, Remote Sensing and Digital Image Processing, vol. 2. [DOI](https://doi.org/10.1007/0-306-47633-9)

7. Colesanti, C., Ferretti, A., Novali, F., Prati, C., & Rocca, F. (2003). *SAR monitoring of progressive and seasonal ground deformation using the permanent scatterers technique*. IEEE Transactions on Geoscience and Remote Sensing, 41(7), 1685–1701. [DOI](https://doi.org/10.1109/TGRS.2003.813278)

Relevant references are listed in each section. Copyright in the cited works remains with their respective authors and rights holders. This repository does not distribute paper or book PDFs or reproduce their original figures.

## License

Original code is released under the [MIT License](LICENSE). Latin Modern Math retains its original license; see `dist/assets/fonts/`.
