#!/usr/bin/env python3
"""Offline integrity/provenance checks for the licensed AirMarine GLB set."""
from __future__ import annotations

import hashlib
import json
import struct
from pathlib import Path

TEST_DIR = Path(__file__).resolve().parent
if (TEST_DIR / "models").is_dir():
    PROJECT_ROOT = TEST_DIR
elif (TEST_DIR.parent / "models").is_dir():
    PROJECT_ROOT = TEST_DIR.parent
elif (TEST_DIR.parent / "dnx_airmarine_3d" / "models").is_dir():
    PROJECT_ROOT = TEST_DIR.parent / "dnx_airmarine_3d"
else:
    raise RuntimeError("could not locate the AirMarine models directory")
ROOT = PROJECT_ROOT / "models" / "ais-realistic"
EXPECTED = {
    "ship-container.glb", "ship-tanker.glb", "ship-lng.glb", "ship-bulk.glb",
    "ship-cruise.glb", "ship-ferry_small.glb", "ship-ferry.glb", "ship-navy.glb",
    "ship-pilot.glb", "ship-sail.glb", "ship-yacht.glb", "ship-runabout.glb",
    "ship-tug.glb", "ship-fishing.glb",
}
REQUIRED_EXTENSIONS = {"EXT_meshopt_compression", "EXT_texture_webp", "KHR_mesh_quantization"}


def aircraft_scene_bounds(path: Path) -> tuple[float, float, float]:
    """Approximate transformed model bounds from POSITION accessors and the glTF node graph."""
    data = path.read_bytes()
    offset = 12
    gltf = None
    while offset < len(data):
        chunk_length, chunk_type = struct.unpack_from("<I4s", data, offset)
        offset += 8
        chunk = data[offset:offset + chunk_length]
        offset += chunk_length
        if chunk_type == b"JSON":
            gltf = json.loads(chunk.decode("utf-8").rstrip(" \0"))
            break
    assert gltf is not None

    def identity() -> list[list[float]]:
        return [[1.0, 0.0, 0.0, 0.0], [0.0, 1.0, 0.0, 0.0],
                [0.0, 0.0, 1.0, 0.0], [0.0, 0.0, 0.0, 1.0]]

    def multiply(a: list[list[float]], b: list[list[float]]) -> list[list[float]]:
        return [[sum(a[row][k] * b[k][column] for k in range(4)) for column in range(4)]
                for row in range(4)]

    def node_matrix(node: dict) -> list[list[float]]:
        if "matrix" in node:
            m = node["matrix"]  # glTF stores matrices in column-major order.
            return [[m[0], m[4], m[8], m[12]], [m[1], m[5], m[9], m[13]],
                    [m[2], m[6], m[10], m[14]], [m[3], m[7], m[11], m[15]]]
        x, y, z, w = node.get("rotation", [0.0, 0.0, 0.0, 1.0])
        sx, sy, sz = node.get("scale", [1.0, 1.0, 1.0])
        tx, ty, tz = node.get("translation", [0.0, 0.0, 0.0])
        rotation = [[1 - 2 * (y*y + z*z), 2 * (x*y - z*w), 2 * (x*z + y*w)],
                    [2 * (x*y + z*w), 1 - 2 * (x*x + z*z), 2 * (y*z - x*w)],
                    [2 * (x*z - y*w), 2 * (y*z + x*w), 1 - 2 * (x*x + y*y)]]
        return [[rotation[0][0] * sx, rotation[0][1] * sy, rotation[0][2] * sz, tx],
                [rotation[1][0] * sx, rotation[1][1] * sy, rotation[1][2] * sz, ty],
                [rotation[2][0] * sx, rotation[2][1] * sy, rotation[2][2] * sz, tz],
                [0.0, 0.0, 0.0, 1.0]]

    nodes = gltf.get("nodes", [])
    meshes = gltf.get("meshes", [])
    accessors = gltf.get("accessors", [])
    scenes = gltf.get("scenes", [])
    scene_index = gltf.get("scene", 0)
    roots = scenes[scene_index].get("nodes", []) if scenes else []
    if not roots:
        child_ids = {child for node in nodes for child in node.get("children", [])}
        roots = [i for i in range(len(nodes)) if i not in child_ids]
    points: list[list[float]] = []

    def visit(index: int, parent: list[list[float]]) -> None:
        node = nodes[index]
        world = multiply(parent, node_matrix(node))
        if "mesh" in node:
            for primitive in meshes[node["mesh"]].get("primitives", []):
                accessor = accessors[primitive["attributes"]["POSITION"]]
                minimum, maximum = accessor.get("min"), accessor.get("max")
                if minimum is None or maximum is None:
                    continue
                for mask in range(8):
                    point = [maximum[i] if mask & (1 << i) else minimum[i] for i in range(3)]
                    points.append([sum(world[row][col] * point[col] for col in range(3)) + world[row][3]
                                   for row in range(3)])
        for child in node.get("children", []):
            visit(child, world)

    for root_index in roots:
        visit(root_index, identity())
    assert points, f"no transformed positions in {path.name}"
    minimum = [min(point[i] for point in points) for i in range(3)]
    maximum = [max(point[i] for point in points) for i in range(3)]
    return tuple(maximum[i] - minimum[i] for i in range(3))


def main() -> None:
    files = {p.name for p in ROOT.glob("*.glb")}
    assert files == EXPECTED, f"unexpected asset list: missing={EXPECTED-files}, extra={files-EXPECTED}"
    manifest = json.loads((ROOT / "MODEL-SOURCES.json").read_text(encoding="utf-8"))
    assert manifest["source_tag"] == "v1.8.1"
    assert manifest["source_commit"] == "064dad517774034ad796f61689db5496fbe78d49"
    assert manifest["license"] == "CC BY 4.0"
    assert len(manifest["assets"]) == 14

    hashes: dict[str, str] = {}
    total = 0
    for path in sorted(ROOT.glob("*.glb")):
        data = path.read_bytes()
        total += len(data)
        assert len(data) >= 20 and data[:4] == b"glTF", f"bad GLB magic: {path.name}"
        version, declared_length = struct.unpack_from("<II", data, 4)
        assert version == 2 and declared_length == len(data), f"invalid GLB header: {path.name}"
        json_length, json_type = struct.unpack_from("<II", data, 12)
        assert json_type == 0x4E4F534A, f"missing GLB JSON chunk: {path.name}"
        gltf = json.loads(data[20:20 + json_length].decode("utf-8").rstrip(" \0"))
        assert REQUIRED_EXTENSIONS.issubset(set(gltf.get("extensionsRequired", []))), path.name
        assert gltf.get("meshes"), f"no meshes: {path.name}"
        hashes[path.name] = hashlib.sha256(data).hexdigest()

    assert 10_000_000 < total < 20_000_000, f"unexpected model-set size: {total}"
    for asset in manifest["assets"]:
        path = ROOT / asset["file"]
        assert path.stat().st_size == asset["bytes"], asset["file"]
        assert hashes[asset["file"]] == asset["sha256"], asset["file"]

    credits = (ROOT / "CREDITS.md").read_text(encoding="utf-8")
    assert "creativecommons.org/licenses/by/4.0" in credits
    assert "064dad517774034ad796f61689db5496fbe78d49" in credits
    assert all(asset["author"] in credits and asset["model_url"] in credits for asset in manifest["assets"])
    assert (ROOT / "UPSTREAM-CREDITS.md").is_file()
    assert (ROOT / "credits.html").is_file()
    assert (ROOT / "LICENSE-CC-BY-4.0.html").is_file()
    checksum_lines = (ROOT / "SHA256SUMS.txt").read_text(encoding="utf-8").splitlines()
    checked = set()
    for line in checksum_lines:
        digest, filename = line.split("  ", 1)
        assert hashlib.sha256((ROOT / filename).read_bytes()).hexdigest() == digest, filename
        checked.add(filename)
    assert len(checked) == 19, f"unexpected checksum list: {len(checked)} entries"

    aircraft_root = PROJECT_ROOT / "models" / "adsb-realistic"
    expected_aircraft = {
        "A320_nologo.glb", "A350_nologo.glb", "A380_nologo.glb", "B737_nologo.glb",
        "B787_nologo.glb", "EVTOL_nologo.glb", "drone_nologo.glb",
        "helicopter.glb", "glider.glb", "f15.glb",
    }
    aircraft_files = {p.name for p in aircraft_root.glob("*.glb")}
    assert aircraft_files == expected_aircraft, (
        f"unexpected aircraft asset list: missing={expected_aircraft-aircraft_files}, "
        f"extra={aircraft_files-expected_aircraft}"
    )
    aircraft_manifest = json.loads((aircraft_root / "MODEL-SOURCES.json").read_text(encoding="utf-8"))
    assert aircraft_manifest["amvlab_commit"] == "91d835e8e851b2317fe79af291c9fed6153fd525"
    assert aircraft_manifest["sdrangel_commit"] == "59d1ee24ebc2c24343afb54b26928f965a625140"
    assert aircraft_manifest["license"] == "CC BY 4.0 for all included aircraft GLBs"
    assert {asset["file"] for asset in aircraft_manifest["assets"]} == expected_aircraft
    aircraft_total = 0
    aircraft_hashes: dict[str, str] = {}
    for path in sorted(aircraft_root.glob("*.glb")):
        data = path.read_bytes()
        aircraft_total += len(data)
        assert len(data) >= 20 and data[:4] == b"glTF", f"bad aircraft GLB magic: {path.name}"
        version, declared_length = struct.unpack_from("<II", data, 4)
        assert version == 2 and declared_length == len(data), f"invalid aircraft GLB header: {path.name}"
        json_length, json_type = struct.unpack_from("<II", data, 12)
        assert json_type == 0x4E4F534A, f"missing aircraft GLB JSON chunk: {path.name}"
        gltf = json.loads(data[20:20 + json_length].decode("utf-8").rstrip(" \0"))
        assert gltf.get("meshes"), f"no aircraft meshes: {path.name}"
        aircraft_hashes[path.name] = hashlib.sha256(data).hexdigest()
    expected_scaled_longest = {
        "A320_nologo.glb": 37.681, "A350_nologo.glb": 67.471, "A380_nologo.glb": 80.424,
        "B737_nologo.glb": 37.872, "B787_nologo.glb": 58.005, "EVTOL_nologo.glb": 7.080,
        "drone_nologo.glb": 0.824, "f15.glb": 21.940, "glider.glb": 17.014,
        "helicopter.glb": 19.909,
    }
    runtime_scales = {"A380_nologo.glb": 0.42, "EVTOL_nologo.glb": 5.0}
    for filename, expected in expected_scaled_longest.items():
        measured = max(aircraft_scene_bounds(aircraft_root / filename)) * runtime_scales.get(filename, 1.0)
        assert abs(measured - expected) < 0.01, (
            f"unexpected node-transformed dimensions for {filename}: {measured:.3f} m"
        )
    assert 5_000_000 < aircraft_total < 8_000_000, f"unexpected aircraft model-set size: {aircraft_total}"
    for asset in aircraft_manifest["assets"]:
        path = aircraft_root / asset["file"]
        assert path.stat().st_size == asset["bytes"], asset["file"]
        assert aircraft_hashes[asset["file"]] == asset["sha256"], asset["file"]
    aircraft_credits = (aircraft_root / "CREDITS.md").read_text(encoding="utf-8")
    assert "creativecommons.org/licenses/by/4.0" in aircraft_credits
    assert "91d835e8e851b2317fe79af291c9fed6153fd525" in aircraft_credits
    assert "59d1ee24ebc2c24343afb54b26928f965a625140" in aircraft_credits
    assert all(asset["author"] in aircraft_credits for asset in aircraft_manifest["assets"])
    assert all(asset["source_url"] in aircraft_credits for asset in aircraft_manifest["assets"] if "source_url" in asset)
    assert (aircraft_root / "credits.html").is_file()
    assert (aircraft_root / "LICENSE-CC-BY-4.0.txt").is_file()
    assert (aircraft_root / "SDRANGEL-MODEL-LICENSE.txt").is_file()
    aircraft_sums = (aircraft_root / "SHA256SUMS.txt").read_text(encoding="utf-8").splitlines()
    aircraft_checked = set()
    for line in aircraft_sums:
        digest, filename = line.split("  ", 1)
        assert hashlib.sha256((aircraft_root / filename).read_bytes()).hexdigest() == digest, filename
        aircraft_checked.add(filename)
    actual_aircraft_files = {p.name for p in aircraft_root.iterdir() if p.is_file() and p.name != "SHA256SUMS.txt"}
    assert aircraft_checked == actual_aircraft_files, "aircraft checksum list must cover every shipped file"
    print(
        f"PASS: {len(files)} AIS GLBs ({total:,} bytes) and {len(aircraft_files)} aircraft GLBs "
        f"({aircraft_total:,} bytes), with pinned source/credit records and checksums verified"
    )


if __name__ == "__main__":
    main()
