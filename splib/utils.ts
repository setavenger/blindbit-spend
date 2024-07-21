import { ec } from 'elliptic';

export function getBytes(keyPair: ec.KeyPair, bip340 = true) {
  const publicKey = keyPair.getPublic();
  const x = publicKey.getX().toArray('be', 32); // x-coordinate as a 32-byte array
  if (bip340) {
    return Buffer.from(x);
  }

  if (publicKey.getY().isOdd()) {
    return Buffer.concat([Buffer.from('03', 'hex'), Buffer.from(x)]);
  } else {
    return Buffer.concat([Buffer.from('02', 'hex'), Buffer.from(x)]);
  }
}

