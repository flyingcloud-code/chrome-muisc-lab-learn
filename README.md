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
- By default, experiment pages embed the live official Chrome Music Lab experiments for maximum fidelity.
- Add `?local=1` before the hash route, for example `/?local=1#/experiment/song-maker`, to view the local MVP implementations.
- The local MVP implementations are not the original Google source code.
- This is not an official Google project.
