import { fail } from './validation.ts';

export async function readMaskedCredential(): Promise<string> {
  if (!process.stdin.isTTY || !process.stderr.isTTY) fail('AUTH_TTY', 'Enrollment requires a terminal with masked input. For headless use, explicitly select an environment reference.');
  const previous = process.stdin.isRaw; process.stdin.setRawMode(true); process.stdin.resume();
  process.stderr.write('Provider key (input hidden): ');
  return new Promise((resolve, reject) => {
    let value = '';
    const done = (cancelled: boolean) => {
      process.stdin.removeListener('data', onData); process.removeListener('SIGTERM', onTerm);
      process.stdin.setRawMode(previous); process.stdin.pause(); process.stderr.write('\n');
      if (cancelled) reject(new Error('Enrollment cancelled.')); else resolve(value);
      value = '';
    };
    const onTerm = () => done(true);
    const onData = (chunk: Buffer) => {
      for (const character of chunk.toString('utf8')) {
        if (character === '\u0003' || character === '\u0004') return done(true);
        if (character === '\r' || character === '\n') return done(false);
        if (character === '\u007f' || character === '\b') value = value.slice(0, -1);
        else if (character.charCodeAt(0) >= 32) value += character;
        if (value.length > 8192) return done(true);
      }
    };
    process.stdin.on('data', onData); process.once('SIGTERM', onTerm);
  });
}
