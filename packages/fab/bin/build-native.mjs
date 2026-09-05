import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
if (process.platform === 'darwin') {
  execFileSync('/usr/bin/xcrun', ['clang', '-fobjc-arc', '-Werror', '-Wno-deprecated-declarations', '-Wno-incompatible-pointer-types', '-framework', 'Foundation', '-framework', 'Security', fileURLToPath(new URL('../native/keychain.m', import.meta.url)), '-o', fileURLToPath(new URL('../dist/fab-keychain', import.meta.url))], { stdio: 'inherit', env: { PATH: '/usr/bin:/bin', HOME: '/nonexistent', TMPDIR: '/private/tmp' } });
  execFileSync('/usr/bin/xcrun', ['clang', '-std=c11', '-Wall', '-Wextra', '-Werror', fileURLToPath(new URL('../native/check-guard.c', import.meta.url)), '-o', fileURLToPath(new URL('../dist/fab-check-guard', import.meta.url))], { stdio: 'inherit', env: { PATH: '/usr/bin:/bin', HOME: '/nonexistent', TMPDIR: '/private/tmp' } });
}
