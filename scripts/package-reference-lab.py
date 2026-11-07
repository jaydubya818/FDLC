#!/usr/bin/env python3
"""Package only the trusted Reference Lab; no repository, credentials or dependencies."""
import argparse
import hashlib
import json
from pathlib import Path
import tempfile
import zipfile

root = Path(__file__).resolve().parents[1]
source = root / 'reference-factory'
version = '1.1.1'
folder = f'fdlc-reference-lab-v{version}'
files = ['README.md', 'lab.mjs', 'contract.test.mjs', 'factory-definition.json', 'work-order.json', 'sandbox/package.json', 'sandbox/src/add.js', 'sandbox/src/api.mjs', 'sandbox/tests/add.test.js', 'sandbox/tests/api.test.mjs']
public = root / 'public'
archive = public / 'downloads' / f'{folder}.zip'
source_public = public / 'reference-factory' / 'source'
check = argparse.ArgumentParser()
check.add_argument('--check', action='store_true')
args = check.parse_args()
records = []
with tempfile.TemporaryDirectory(prefix='fdlc-lab-package-') as tmp:
    packed = Path(tmp) / 'lab.zip'
    with zipfile.ZipFile(packed, 'w', compression=zipfile.ZIP_DEFLATED, compresslevel=9) as z:
        for name in files:
            content = (source / name).read_bytes()
            info = zipfile.ZipInfo(f'{folder}/{name}', date_time=(2026, 11, 6, 0, 0, 0))
            info.compress_type = zipfile.ZIP_DEFLATED
            info.external_attr = 0o100644 << 16
            z.writestr(info, content)
            target = source_public / f'{name}.txt'
            if args.check:
                assert target.read_bytes() == content, f'Stale public source: {name}'
            else:
                target.parent.mkdir(parents=True, exist_ok=True)
                target.write_bytes(content)
            records.append({'path': name, 'source': f'/reference-factory/source/{name}.txt', 'sha256': hashlib.sha256(content).hexdigest()})
    manifest = {'version': version, 'archive': f'/downloads/{folder}.zip', 'sha256': hashlib.sha256(packed.read_bytes()).hexdigest(), 'files': records, 'scope': 'Trusted local teaching fixture; no production qualification'}
    manifest_bytes = (json.dumps(manifest, indent=2) + '\n').encode()
    if args.check:
        assert archive.read_bytes() == packed.read_bytes(), 'Lab archive differs from source'
        assert (source_public / 'manifest.json').read_bytes() == manifest_bytes, 'Lab manifest differs from source'
    else:
        archive.parent.mkdir(parents=True, exist_ok=True)
        archive.write_bytes(packed.read_bytes())
        (source_public / 'manifest.json').write_bytes(manifest_bytes)
print(f'Reference Lab {"matches" if args.check else "packaged"}: {len(records)} source files, deterministic archive and SHA-256 manifest.')
