#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const { WASI } = require('wasi');

const wasi = new WASI({
  args: [
    process.argv[1],
    '--help'
  ],
  env: process.env,
  preopens: {
    '/sandbox': process.cwd()
  }
});

const importObject = { wasi_snapshot_preview1: wasi.wasiImport };

(async () => {
  const p = path.resolve(__dirname, 'yosys.wasm')
  const wasm = await WebAssembly.compile(fs.readFileSync(p));
  const instance = await WebAssembly.instantiate(wasm, importObject);
  wasi.start(instance);
})();
