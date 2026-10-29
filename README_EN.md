# PSI-SimLab

PS-InSAR study notes with browser-based numerical examples.

[中文说明](README.md)

A dependency-free static site with six numerical examples. Inline and displayed equations use native MathML with a bundled Latin Modern Math font. Each tab contains its visualization, controls, equations, derivation, assumptions and DOI references. The interface and complete method notes are available in Chinese and English.

## Experiments

1. LOS displacement, continuous phase and modulo-2π observations.
2. Amplitude-dispersion screening of synthetic scatterer candidates.
3. A two-parameter ambiguity-function grid search, with a running optimum and residual phasors.
4. Datum-constrained network adjustment and the effect of a known biased arc.
5. Zero-mean simple kriging of isolated atmospheric residuals.
6. Linear and annual displacement models, velocity estimates and residual diagnostics.

The notation, equations and derivation appear directly below the plot. Playback supports pause/resume, timeline scrubbing and 0.5× / 1× / 2× speed. New sample is available for the four stochastic examples. Parameters recalculate the complete solution. AF metrics track evaluated candidates during playback; APS metrics track the applied correction. Other metrics describe the complete solution. JSON exports contain inputs, parameters, results, units and a synthetic-data flag.

## Run

Open `dist/index.html` directly. All scripts and styles are local and use no module imports, fetch requests or external CDN.

Optional development server:

```bash
python3 -m http.server 8000 --directory dist
```

Open `http://localhost:8000`. Choose EN / 中文 in the navigation bar. Language changes preserve the selected experiment, parameters and random sample; the preference is retained locally. A `?lang=en` query can select English explicitly.

## Verify

With Node.js installed, no package installation is required:

```bash
node tests/numerics.cjs
node tests/content.cjs
node --check dist/app.js
```

Numerical checks cover wrapping invariance, units, deterministic generation, noiseless parameter recovery, network datum and closure, atmospheric prediction and model misspecification. Content checks validate bilingual completeness and reference identifiers. These checks do not establish accuracy on real radar data.

## Conventions and scope

- Positive LOS displacement is toward the satellite: d = −ΔR, phase = 4πd/λ.
- Wavelength: 0.056 m; range: 800 km; incidence angle: 35°. These are illustrative constants.
- Displayed velocity is mm/yr; the phase model converts it to m/yr. Time is in years and residual height in meters.
- A fresh seed is generated on page load. New sample replaces the current random observations while retaining parameters. Exported seeds reproduce individual samples; only regression tests use fixed fixtures.
- The six experiments are independent. They do not form an operational processing chain.
- AF grid search is not integer least squares. The network example adjusts continuous velocities with a known outlier location.
- The APS example assumes atmospheric residuals have already been isolated. It does not perform blind separation, variogram estimation or unknown-trend fitting.
- Synthetic errors are not real-world monitoring accuracy. LOS velocity is not vertical subsidence without additional geometry and assumptions.
- Small normal systems use pivoted Gaussian elimination. Larger or ill-conditioned applications require appropriate QR/SVD solvers and numerical libraries.

## References

Seven verified DOI references are listed in `README.md`, in `dist/content.js`, and on the website. They cover PS theory, amplitude and phase-based selection, atmospheric errors, geodetic estimation and seasonal deformation. Referenced publications are not bundled. Original implementation is MIT licensed.
