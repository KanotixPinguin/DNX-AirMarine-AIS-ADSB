# DNX AirMarine — 3D aircraft model attribution

The following representative aircraft-class models are included in DNX AirMarine. They are **not exact models of the individual ADS-B-tracked aircraft**. Each model is licensed by its author under [Creative Commons Attribution 4.0 International (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/).

| Local file | Model title | Author | Source |
|---|---|---|---|
| `A320_nologo.glb` | A320 (logo-free variant) | amvlab | [source](https://raw.githubusercontent.com/amvlab/aircraft-models/91d835e8e851b2317fe79af291c9fed6153fd525/models/A320_nologo.glb) · [GitHub repo](https://github.com/amvlab/aircraft-models) |
| `A350_nologo.glb` | A350 (logo-free variant) | amvlab | [source](https://raw.githubusercontent.com/amvlab/aircraft-models/91d835e8e851b2317fe79af291c9fed6153fd525/models/A350_nologo.glb) · [GitHub repo](https://github.com/amvlab/aircraft-models) |
| `A380_nologo.glb` | A380 (logo-free variant) | amvlab | [source](https://raw.githubusercontent.com/amvlab/aircraft-models/91d835e8e851b2317fe79af291c9fed6153fd525/models/A380_nologo.glb) · [GitHub repo](https://github.com/amvlab/aircraft-models) |
| `B737_nologo.glb` | B737 (logo-free variant) | amvlab | [source](https://raw.githubusercontent.com/amvlab/aircraft-models/91d835e8e851b2317fe79af291c9fed6153fd525/models/B737_nologo.glb) · [GitHub repo](https://github.com/amvlab/aircraft-models) |
| `B787_nologo.glb` | B787 (logo-free variant) | amvlab | [source](https://raw.githubusercontent.com/amvlab/aircraft-models/91d835e8e851b2317fe79af291c9fed6153fd525/models/B787_nologo.glb) · [GitHub repo](https://github.com/amvlab/aircraft-models) |
| `EVTOL_nologo.glb` | eVTOL (logo-free variant) | amvlab | [source](https://raw.githubusercontent.com/amvlab/aircraft-models/91d835e8e851b2317fe79af291c9fed6153fd525/models/EVTOL_nologo.glb) · [GitHub repo](https://github.com/amvlab/aircraft-models) |
| `drone_nologo.glb` | Drone (logo-free variant) | amvlab | [source](https://raw.githubusercontent.com/amvlab/aircraft-models/91d835e8e851b2317fe79af291c9fed6153fd525/models/drone_nologo.glb) · [GitHub repo](https://github.com/amvlab/aircraft-models) |
| `helicopter.glb` | Helicopter | Gigantic Burger | [source](https://raw.githubusercontent.com/srcejon/sdrangel-3d-models/59d1ee24ebc2c24343afb54b26928f965a625140/helicopter.glb) · [Sketchfab model](https://skfb.ly/6XBwS) |
| `glider.glb` | ASK 21 Mi | helijah | [source](https://raw.githubusercontent.com/srcejon/sdrangel-3d-models/59d1ee24ebc2c24343afb54b26928f965a625140/glider.glb) · [Sketchfab model](https://skfb.ly/S9LQ) |
| `f15.glb` | McDonnell Douglas F-15 Eagle | PolyDucky | [source](https://raw.githubusercontent.com/srcejon/sdrangel-3d-models/59d1ee24ebc2c24343afb54b26928f965a625140/f15.glb) · [Sketchfab model](https://skfb.ly/6QWGp) |

## Asset provenance and changes

Seven logo-free airliner/eVTOL/drone models are the preprocessed assets distributed in [amvlab/aircraft-models](https://github.com/amvlab/aircraft-models/tree/91d835e8e851b2317fe79af291c9fed6153fd525), commit `91d835e8e851b2317fe79af291c9fed6153fd525`, licensed CC BY 4.0 by amvlab. The helicopter, glider, and F-15 models are distributed in [srcejon/sdrangel-3d-models](https://github.com/srcejon/sdrangel-3d-models/tree/59d1ee24ebc2c24343afb54b26928f965a625140), commit `59d1ee24ebc2c24343afb54b26928f965a625140`; their upstream attribution (`SDRANGEL-MODEL-LICENSE.txt`) names the original Sketchfab authors: "Helicopter" by Gigantic Burger, "ASK 21 Mi" by helijah, and "McDonnell Douglas F-15 Eagle" by PolyDucky, all CC BY 4.0. Each source_url above pins the exact blob used.

DNX AirMarine uses these GLBs without binary modification. Per-asset runtime scale, forward axis, and node-transformed bounds are recorded in `MODEL-SOURCES.json`; per-file hashes are in `SHA256SUMS.txt`. The A380 is displayed at 0.42× and the eVTOL at 5× so their on-screen size is representative of the real aircraft.

The camera can orbit a tracked aircraft independently. A separate temporary model-heading offset is marked as visual-only; it never changes the ADS-B course/heading/altitude data and resets when Follow view ends. Unknown aircraft types and model load failures keep the receiver's existing Cesium Air model as fallback.

## License

Each model remains under its author's CC BY 4.0 license. Provide attribution, link to the license, and indicate changes as required by the license. Full legal code: <https://creativecommons.org/licenses/by/4.0/legalcode>. The upstream attribution documents are retained as `UPSTREAM-README.md` and `SDRANGEL-MODEL-README.md` / `SDRANGEL-MODEL-LICENSE.txt`.
