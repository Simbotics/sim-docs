import { load } from './compiler.wasm-runtime.js';

const teavm = await load('./compiler.wasm', {
    stackDeobfuscator: {
        enabled: false,
    },
});

teavm.exports.installWorker();