import { load } from './compiler.wasm-runtime.js';

self.addEventListener('message', async (event) => {
    let output = '';

    try {
        const program = await load(event.data.code, {
            stackDeobfuscator: {
                enabled: false,
            },

            installImports(imports) {
                imports.teavmConsole.putcharStdout = (character) => {
                    output += String.fromCharCode(character);
                };

                imports.teavmConsole.putcharStderr = (character) => {
                    output += String.fromCharCode(character);
                };
            },
        });

        await program.exports.main([]);

        self.postMessage({
            command: 'finished',
            output,
        });
    } catch (error) {
        self.postMessage({
            command: 'runtime-error',
            message:
                error instanceof Error
                    ? error.message
                    : String(error),
        });
    }
});