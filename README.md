# DNX AirMarine AIS/ADS-B v4.09

Browser-side AIS/ADS-B add-on for compatible OpenWebRX+ installations. This release adds an orbiting 3D follow-camera for a selected AIS ship, optional visual-only model heading adjustment, and 14 representative class-based ship models with bundled attribution.

**Deployment and publication:** v4.09 was deployed to the target receiver and published to the DNX Projects catalog on 2026-10-18 without a receiver/container restart. The AirMarine catalog entry keeps its existing project URL and now serves this v4.09 package; the prior v4.08 ZIP is retained in a private backup. Project page: <<PROJECT_MANAGER_URL>/project/1f0836d4eaef4b6a96bcb55f61a1b7b8>. A headless browser test using the receiver's actual CesiumJS 1.121 vendor files loaded all 14 models (`Model.ready === true`) and visibly rendered a reference model without console/page/request errors. A full interactive OpenWebRX/live-AIS follow-view E2E test was not performed.

## What changed in v4.09

- Right-click an AIS target and choose **“3D um dieses Schiff kreisen”** to follow it in a close 3D view. Drag to orbit; use the wheel or touch pinch to zoom. Presets provide behind, side, front, and overhead views; an optional 360° mode rotates the camera.
- **Model-Offset** rotates only the visible model relative to the AIS course/heading. It is explicitly labelled as visual-only, does not modify AIS records, and has a reset button. Ending follow mode also restores the AIS-aligned model orientation.
- Replaces the default AIS-class visuals with 14 locally served class models from `ais-monitor` v1.8.1. These are representative classes, not exact replicas of individual tracked vessels.
- The 3D view links to a bundled attribution page listing model authors, Sketchfab sources, and CC BY 4.0; the package also includes source metadata, hashes, upstream credits, and the full license text.

## Package contents

- `dnx_styler.js` — complete v4.09 Styler with cache-busted AirMarine loader.
- `dnx_stand.txt` — matching version/size stamp: `v4.09 614560`.
- `dnx_airmarine_3d/dnx_airmarine_3d.js` — AIS/ADS-B frontend module.
- `dnx_airmarine_3d/models/ais-realistic/` — 14 CC BY 4.0 GLBs, `credits.html`, `CREDITS.md`, `UPSTREAM-CREDITS.md`, `MODEL-SOURCES.json`, per-file `SHA256SUMS.txt`, and the CC BY 4.0 legal code.
- `tests/` — offline AIS/ADS-B regression test and GLB/provenance integrity check.
- Top-level `SHA256SUMS.txt` — integrity checks for package files other than this checksum list.

## Runtime dependencies and scope

The receiver must already provide Cesium and Leaflet at `/static/plugins/receiver/dnx_weather/vendor/cesium/` and `/static/plugins/receiver/dnx_weather/vendor/leaflet/`, plus the existing AIS/ADS-B data stream from its active OpenWebRX profile. For fallback when a new GLB fails to load, the module uses the receiver's pre-existing `models/ais/` files; the ADS-B view also expects its existing `models/aircraft/Cesium_Air.glb`. Those legacy files are deliberately not redistributed in this package because their separate redistribution licenses have not been verified. Keep them in place when updating an existing receiver.

The new ship GLBs use `EXT_meshopt_compression`, `EXT_texture_webp`, and `KHR_mesh_quantization` (ferry/runabout also use `EXT_mesh_gpu_instancing`). Use a Cesium build that supports those glTF extensions. The receiver's local bundle reported CesiumJS 1.121 in the headless test, where all 14 GLBs loaded successfully. The GLBs are served from the receiver; they are not fetched from Sketchfab at runtime.

No receiver core, OpenWebRX core, Docker configuration, profile, second decoder, WebSocket, hard-coded receiver/profile ID, or iframe is added. The add-on passively reads messages already delivered to the open page. OSM/OpenSeaMap and Wikimedia Commons features need browser internet access; OpenSeaMap is a transparent seamark overlay, not an official nautical chart and not for navigation. Esri imagery remains disabled unless a suitable restricted API key is configured.

## Install overview

Back up the target receiver's current Styler, `dnx_stand.txt`, AirMarine module, and any existing `models/ais-realistic/` directory. Install the two top-level files in the receiver plugin directory and place the AirMarine module and `models/ais-realistic/` subtree under `dnx_airmarine_3d/`. Preserve the receiver's existing `models/ais/`, aircraft-model, and local Weather vendor directories. Refresh the browser after installation. Paths may need adjustment on non-DNX OpenWebRX+ layouts.

## Verification

Run from `tests/` with Node.js and Python 3:

```sh
node --check ../dnx_airmarine_3d/dnx_airmarine_3d.js
node --check test_decoder.js
node test_decoder.js
python3 test_model_assets.py
```

The offline checks cover the existing AIS/ADS-B data paths, class/model selection, bounded model dimensions, camera-orbit geometry, visual-only heading offset, GLB structure/extensions, attribution records, and checksums. A separate headless CesiumJS 1.121 test used the receiver's actual vendor files: all 14 models reached `Model.ready === true`, a reference model rendered visibly, and there were no browser console/page/request errors. This does not replace a full interactive OpenWebRX/live-AIS follow-view test.

## Model attribution and license

The 14 model assets are the preprocessed GLBs from [`jchisholm59/ais-monitor` v1.8.1](https://github.com/jchisholm59/ais-monitor/tree/v1.8.1), commit `064dad517774034ad796f61689db5496fbe78d49`. Each original Sketchfab model is licensed by its author under [Creative Commons Attribution 4.0 International (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/). Authors, source links, asset identifiers, and per-file hashes are included in the attribution and manifest files. Preserve attribution and the license when redistributing these model files. The model authors and upstream project do not endorse this DNX integration.

The DNX code itself has no separate reuse license specified in this package; do not infer a code license from the model license or from a separate Styler listing.
