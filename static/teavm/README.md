# Bundled TeaVM Compiler Assets

This directory contains the browser compiler used by the Sim Docs Java
playground.

## Upstream projects and licenses

- [TeaVM-Javac](https://github.com/konsoletyper/teavm-javac) — Apache License
  2.0
- [TeaVM](https://teavm.org/) — Apache License 2.0
- OpenJDK compiler components included in the WebAssembly output — GNU General
  Public License, version 2, with the Classpath Exception

Official license texts:

- [Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0)
- [OpenJDK GPLv2 with the Classpath Exception](https://openjdk.org/legal/gplv2+ce.html)

Upstream source and build instructions are available in the TeaVM-Javac
repository. The project README identifies the downloadable compiler and class
library artifacts and documents their worker protocol.

## Asset sources

The upstream binary assets were obtained from the official TeaVM playground:

- `https://teavm.org/playground/compiler.wasm`
- `https://teavm.org/playground/compile-classlib-teavm.bin`
- `https://teavm.org/playground/runtime-classlib-teavm.bin`

The JavaScript runtime is TeaVM-generated runtime code. `compiler-worker.js`
loads the compiler through TeaVM's documented API. `runner-worker.js` is Sim
Docs integration code and is covered by the repository's MIT License.

## Local asset checksums

The following SHA-256 checksums record the bundled files as of August 28,
2026:

```text
A79245353AC623DF4FDE5740BB2BEDACEDC9C98544253F01AA4B63268F9CB8BA  compiler.wasm
F23FD88D5CE586B411B9D748D0155B8852A71D07257F30B15D9C7CFDE50C2988  compiler.wasm-runtime.js
4ED72DE9E6EA1B58ADFAA1B75C30379D7BCCDE71C529F795DF383D62045367D9  compile-classlib-teavm.bin
E62AB99CE291A3379ABC0756A1E80F4796F00C60FEE655E488B82E37B469D5B7  runtime-classlib-teavm.bin
```

When these files are updated, update the checksums and record the corresponding
upstream source revision whenever possible.
