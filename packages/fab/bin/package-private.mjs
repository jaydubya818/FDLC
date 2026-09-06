import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, realpathSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const output = process.argv[2];
if (!output || !path.isAbsolute(output)) throw new Error('Supply an existing absolute output directory.');
const destination = realpathSync(output);
const version = JSON.parse(readFileSync(path.join(root, 'package.json'), 'utf8')).version;
if (existsSync(path.join(destination, `fdlc-fab-${version}.tgz`))) throw new Error('Immutable package already exists; use a new version or a separate reproducibility directory.');
const status = () => execFileSync('/usr/bin/git', ['status', '--porcelain=v1', '--', '.'], { cwd: root, encoding: 'utf8' }).trim();
if (status()) throw new Error('Commit the package source before producing a private distribution.');
const npm = process.env.npm_execpath;
if (!npm || !path.isAbsolute(npm)) throw new Error('Invoke using npm run package:private -- /absolute/output.');
execFileSync(process.execPath, [npm, 'run', 'build'], { cwd: root, stdio: 'inherit' });
const identity = JSON.parse(readFileSync(path.join(root, 'dist/build-identity.json'), 'utf8'));
if (status() || identity.sourceDirty || identity.packageVersion !== version) throw new Error('Package source changed during preparation.');
execFileSync(process.execPath, [npm, 'pack', '--ignore-scripts', '--json', '--pack-destination', destination], { cwd: root, stdio: 'inherit' });
