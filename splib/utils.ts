import { ec } from 'elliptic';
import * as bitcoin from 'bitcoinjs-lib';

let Buffer = require('buffer/').Buffer;

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

export function sha256(buf: Buffer) {
  // adding buffer as wrapper to ensure that the output is the correct type of Buffer object
  return Buffer.from(bitcoin.crypto.sha256(buf));
}

export function taggedHash(tag: string, data: Buffer) {
  // Convert the tag to a WordArray object and hash it
  let ss = sha256(Buffer.from(tag));
  // ss = Buffer.from(ss);
  ss = Buffer.concat([ss, ss]);
  ss = Buffer.concat([ss, data]);

  // Hash the final WordArray and return it as a digest
  return bitcoin.crypto.sha256(ss);
}

export function ser32UintBE(val: number) {
  let nBuf = Buffer.alloc(4);
  nBuf.writeUInt32BE(val, 0);
  return nBuf;
}

