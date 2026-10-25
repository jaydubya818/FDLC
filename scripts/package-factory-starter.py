"""Build or check the downloadable starter without local state or installed skills."""
import argparse
import hashlib
import io
import json
from pathlib import Path
import zipfile

root = Path(__file__).resolve().parent.parent
source = root / "factory-starter"
parser = argparse.ArgumentParser()
parser.add_argument("--check", action="store_true")
args = parser.parse_args()
files = [source / name for name in ["README.md", "package.json", "skills.lock.json", "runner.mjs", "demo.mjs"]]
files += sorted((source / "example").rglob("*")) + sorted((source / "test").rglob("*"))
buffer = io.BytesIO()
with zipfile.ZipFile(buffer, "w", compression=zipfile.ZIP_STORED) as archive:
    for file in sorted(files):
        if file.is_symlink():
            raise SystemExit(f"Refusing symlink: {file}")
        if file.is_file():
            name = str(file.relative_to(root))
            if any(part.startswith(".") for part in file.relative_to(source).parts):
                raise SystemExit(f"Unexpected hidden file: {name}")
            info = zipfile.ZipInfo(name, (2026, 1, 1, 0, 0, 0))
            info.external_attr = 0o100644 << 16
            info.compress_type = zipfile.ZIP_STORED
            archive.writestr(info, file.read_bytes())
content = buffer.getvalue()
version = json.loads((source / "package.json").read_text())["version"]
target = root / "public" / "downloads" / f"fdlc-factory-starter-{version}.zip"
metadata = json.dumps({"version": version, "sha256": hashlib.sha256(content).hexdigest(), "bytes": len(content), "href": f"/downloads/{target.name}"}, indent=2) + "\n"
manifest = target.parent / "factory-starter.json"
if args.check:
    if not target.exists() or target.read_bytes() != content or not manifest.exists() or manifest.read_text() != metadata:
        raise SystemExit("Starter download is stale. Run npm run starter:pack.")
    print("Starter download matches source.")
else:
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_bytes(content)
    manifest.write_text(metadata)
    print(f"Packaged {target.name}: {len(content)} bytes")
