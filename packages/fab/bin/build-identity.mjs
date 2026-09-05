import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('..', import.meta.url));
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const env = { PATH: '/usr/bin:/bin', HOME: '/nonexistent', GIT_CONFIG_GLOBAL: '/dev/null', GIT_CONFIG_NOSYSTEM: '1' };
const git = args => execFileSync('/usr/bin/git', args, { cwd: root, env, encoding: 'utf8' }).trim();
const source = [];
for (const directory of ['src', 'native', 'bin']) {
  for (const name of readdirSync(path.join(root, directory)).sort()) {
    source.push([`${directory}/${name}`, hash(readFileSync(path.join(root, directory, name)))]);
  }
}
for (const name of ['package.json', 'package-lock.json', 'tsconfig.json', 'tsconfig.build.json']) source.push([name, hash(readFileSync(path.join(root, name)))]);
source.sort(([left], [right]) => Buffer.compare(Buffer.from(left), Buffer.from(right)));
const native = process.platform === 'darwin' ? ['fab-keychain', 'fab-check-guard'].map(name => ({ name, sha256: hash(readFileSync(path.join(root, 'dist', name))) })) : [];
const metadata = {
  schema: 'fab-build-identity/v1', packageVersion: JSON.parse(readFileSync(path.join(root, 'package.json'), 'utf8')).version,
  sourceCommit: git(['rev-parse', 'HEAD']), sourceDirty: Boolean(git(['status', '--porcelain=v1', '--', '.'])),
  sourceSha256: hash(JSON.stringify({ schema: 'fab-source-closure/v1', files: source })),
  dependencyLockSha256: hash(readFileSync(path.join(root, 'package-lock.json'))),
  toolchain: { node: process.versions.node, platform: process.platform, arch: process.arch,
    typescript: JSON.parse(readFileSync(path.join(root, 'node_modules/typescript/package.json'), 'utf8')).version,
    clang: process.platform === 'darwin' ? execFileSync('/usr/bin/xcrun', ['clang', '--version'], { env, encoding: 'utf8' }).split('\n')[0] : null },
  native, distribution: 'PRIVATE_EXPERIMENTAL', developerSigningIdentity: null, notarization: 'NOT_PERFORMED',
};
writeFileSync(path.join(root, 'dist/build-identity.json'), JSON.stringify(metadata, null, 2) + '\n');
