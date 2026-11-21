#!/usr/bin/env python3
"""Offline integrity/provenance checks for the licensed AirMarine GLB set."""
from __future__ import annotations

import hashlib
import json
import struct
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent / "dnx_airmarine_3d" / "models" / "ais-realistic"
EXPECTED = {
    "ship-container.glb", "ship-tanker.glb", "ship-lng.glb", "ship-bulk.glb",
    "ship-cruise.glb", "ship-ferry_small.glb", "ship-ferry.glb", "ship-navy.glb",
    "ship-pilot.glb", "ship-sail.glb", "ship-yacht.glb", "ship-runabout.glb",
    "ship-tug.glb", "ship-fishing.glb",
}
REQUIRED_EXTENSIONS = {"EXT_meshopt_compression", "EXT_texture_webp", "KHR_mesh_quantization"}


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
    print(f"PASS: {len(files)} valid CC BY 4.0 GLBs, {total:,} bytes, source/credit records and checksums verified")


if __name__ == "__main__":
    main()
