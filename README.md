# Chrome Music Lab Learn

A local learning clone inspired by [Chrome Music Lab](https://musiclab.chromeexperiments.com/).

This project is built for study and experimentation. It keeps the local implementation simple: static HTML, CSS, JavaScript modules, Canvas, and the Web Audio API.

## Run

```bash
npm run dev
```

Open `http://127.0.0.1:8000/`.

## Test

```bash
npm test
```

## Notes

- The homepage thumbnails are local copies of the public Chrome Music Lab experiment thumbnails for visual study and fidelity.
- Experiment pages are local MVP implementations so the site remains usable without access to the live official site.
- Official open-source experiments are tracked in code with `source.type = "official-open-source-port"` and can be ported incrementally from `googlecreativelab/chrome-music-lab`.
- Experiments not present in the official repository use `source.type = "local-recreation"` and are recreated locally from observed behavior.
- The first porting baseline includes the official note colors plus Arpeggios major/minor wheel order.
- This is not an official Google project.
