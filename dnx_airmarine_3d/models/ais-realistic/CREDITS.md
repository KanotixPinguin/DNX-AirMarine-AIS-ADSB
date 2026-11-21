# DNX AirMarine — 3D model attribution

The following representative ship-class models are included in DNX AirMarine. They are **not exact models of the individual AIS-tracked vessels**. Each underlying Sketchfab model is licensed by its author under [Creative Commons Attribution 4.0 International (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/).

| Local file | Model title | Author | Source |
|---|---|---|---|
| `ship-container.glb` | Container Ship | RM02 | [Sketchfab model](https://sketchfab.com/3d-models/aaa41cca946b4a08bc08cf692b7757be) |
| `ship-tanker.glb` | Tanker Ship | Art Blender | [Sketchfab model](https://sketchfab.com/3d-models/96ebf61af42b4062ae98a6ad848e1a25) |
| `ship-lng.glb` | LNG Ship | Art Blender | [Sketchfab model](https://sketchfab.com/3d-models/fa335b96450d4344863bbf5d912a0288) |
| `ship-bulk.glb` | Bulk Carrier - TFCC HERITAGE - IBEE Corp | Gwenaël Hervé | [Sketchfab model](https://sketchfab.com/3d-models/e78b4f1fdc094a63bb7d6c24d8e7e7dd) |
| `ship-cruise.glb` | Cruise Ship | farhad.Guli | [Sketchfab model](https://sketchfab.com/3d-models/bb782326932e4c179e34f3d6c8e36b86) |
| `ship-ferry_small.glb` | Sydney Emerald-Class Low Poly | A Certain Duck | [Sketchfab model](https://sketchfab.com/3d-models/8b39b8957231420d919b60febb627bd5) |
| `ship-ferry.glb` | Hailuoto car ferry L/A Meriluoto | Snowsoup | [Sketchfab model](https://sketchfab.com/3d-models/44eaf2dd56b74e76a310d2e532957dbe) |
| `ship-navy.glb` | 1:1 Low poly US NAVY DDG-51 USS Arleigh Burke. | Yi Tsung Lee | [Sketchfab model](https://sketchfab.com/3d-models/17be09c31c6047e4a5969b68c29eba03) |
| `ship-pilot.glb` | Pilot II | gogiart | [Sketchfab model](https://sketchfab.com/3d-models/6ea031237b6b4382ab362790f8af4e66) |
| `ship-sail.glb` | Sailboat | Sergei | [Sketchfab model](https://sketchfab.com/3d-models/76d0b1e24be14d2f9a524bfce3001aeb) |
| `ship-yacht.glb` | Frickie's yacht | dannzjs | [Sketchfab model](https://sketchfab.com/3d-models/1afd320662384bc0910f1778e9cb5eae) |
| `ship-runabout.glb` | bateau RIVA boat | maxipub | [Sketchfab model](https://sketchfab.com/3d-models/91f0f11ba42b4000abf788d54d73b9b1) |
| `ship-tug.glb` | 40ft Tugboat | Potater_King | [Sketchfab model](https://sketchfab.com/3d-models/0555e3e0c1be4080a2ba6731b801f8da) |
| `ship-fishing.glb` | Fishing Ship game-ready asset | Dominik Biały | [Sketchfab model](https://sketchfab.com/3d-models/f791868a8b5f4996a49a3c8cd99336f6) |

## Asset provenance and changes

The GLB files are the preprocessed assets distributed in [jchisholm59/ais-monitor v1.8.1](https://github.com/jchisholm59/ais-monitor/tree/v1.8.1), commit `064dad517774034ad796f61689db5496fbe78d49`. The upstream `CREDITS.md` describes its changes: bow-forward along +X, centered, scaled to unit length and beam with the waterline at y=0, simplified meshes, textures resized to at most 1024 px and converted to WebP, and meshopt compression. DNX AirMarine uses these files without further binary modification; it maps them to AIS vessel classes and scales them using reported length/beam.

The camera can orbit a tracked ship independently. A separate temporary model-heading offset is marked as visual-only; it never changes the AIS course/heading data and resets when Follow view ends.

The code from `ais-monitor` is not included. The model authors and `ais-monitor` maintainers do not endorse this DNX integration.

## License

Each model remains under its author's CC BY 4.0 license. Provide attribution, link to the license, and indicate changes as required by the license. Full legal code: <https://creativecommons.org/licenses/by/4.0/legalcode>. The upstream attribution document is retained as `UPSTREAM-CREDITS.md`; per-file hashes and source URLs are in `MODEL-SOURCES.json` and `SHA256SUMS.txt`.
