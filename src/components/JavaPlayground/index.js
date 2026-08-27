import React, { useState, useRef, useEffect } from "react";
import useBaseUrl from "@docusaurus/useBaseUrl";
import CodeMirror from '@uiw/react-codemirror';
import { java } from '@codemirror/lang-java';
import styles from './styles.module.css';

const javaLanguage = java();

export default function JavaPlayground({ initialCode }) {

    const [code, setCode] = useState(initialCode);
    const [output, setOutput] = useState('');
    const [compilerStatus, setCompilerStatus] = useState('Loading compiler...');

    const assetRoot = useBaseUrl('/teavm/');
    const compilerRef = useRef(null);

    useEffect(() => {

        const worker = new Worker(
            `${assetRoot}compiler-worker.js`,
            { type: `module` },
        );

        compilerRef.current = worker;

        let runner = null;

        function runProgram(wasm) {
            runner?.terminate();

            runner = new Worker(
                `${assetRoot}runner-worker.js`,
                { type: 'module' },
            );

            setCompilerStatus('Running...');

            runner.addEventListener('message', (event) => {
                const message = event.data;

                if (message.command === 'finished') {
                    setOutput(message.output || 'Program finished with no output.');
                    setCompilerStatus('Ready');

                    runner.terminate();
                    runner = null;
                }

                if (message.command === 'runtime-error') {
                    setOutput(`Runtime error: ${message.message}\n`);
                    setCompilerStatus('Ready');

                    runner.terminate();
                    runner = null;
                }
            });

            runner.postMessage({
                code: wasm,
            });
        }

        worker.addEventListener(`message`, (event) => {
            const message = event.data;

            if (message.command === `initialized`) {
                setCompilerStatus('Loading Java libraries...');

                worker.postMessage({
                    command: 'load-classlib',
                    id: 'load-classlib',
                    url: `${assetRoot}compile-classlib-teavm.bin`,
                    runtimeUrl: `${assetRoot}runtime-classlib-teavm.bin`,
                })
            }

            if (
                message.command === 'ok' &&
                message.id === 'load-classlib'
            ) {
                setCompilerStatus('Ready');
            }

            if (
                message.id === 'compile-main' &&
                (
                    message.command === 'compiler-diagnostic' ||
                    message.command === 'diagnostic'
                )
            ) {
                const location = message.lineNumber
                    ? `Line ${message.lineNumber}: `
                    : '';

                const text =
                    message.message ||
                    message.text ||
                    'Unknown compilation error';

                setOutput((current) => {
                    return `${current}${location}${text}\n`;
                });
            }

            if (
                message.command === 'compilation-complete' &&
                message.id === 'compile-main'
            ) {
                if (message.status === 'successful') {
                    runProgram(message.script);
                } else {
                    setCompilerStatus('Ready');

                    setOutput((current) => {
                        return current || 'Compilation failed.\n';
                    });
                }
            }

            if (
                message.command === 'error' &&
                message.id === 'compile-main'
            ) {
                setCompilerStatus('Ready');
                setOutput(`Compiler error: ${message.text}\n`);
            }
        });

        worker.addEventListener('error', (event) => {
            console.error(event);
            setCompilerStatus('Compiler failed to load');
        })

        return () => {
            return () => {
                runner?.terminate();
                worker.terminate();

                compilerRef.current = null;
            };
        }
    }, [assetRoot]);

    function handleRun() {
        const worker = compilerRef.current;
        if (!worker || compilerStatus !== 'Ready') {
            return
        }

        setOutput('')
        setCompilerStatus('Compiling');

        worker.postMessage({
            command: 'compile',
            id: 'compile-main',
            text: code,
        });
    }

    function handleReset() {
        setOutput('');
        setCode(initialCode);
    }

    return (
        <section className={styles.playground}>
            <header className={styles.header}>
                <strong>Java Playground</strong>
                <span className={styles.filename}>
                    Main.java · {compilerStatus}
                </span>
            </header>

            <CodeMirror
                className={styles.editor}
                value={code}
                height="240px"
                theme="dark"
                extensions={[javaLanguage]}
                onChange={(value) => setCode(value)}
            />

            <div className={styles.actions}>
                <button
                    className="button button--primary button--sm"
                    type="button"
                    onClick={handleRun}
                    disabled={compilerStatus !== 'Ready'}
                >
                    Run Java
                </button>

                <button
                    className="button button--secondary button--sm"
                    type="button"
                    onClick={handleReset}
                >
                    Reset
                </button>
            </div>

            <div className={styles.outputLabel}>Output</div>

            <pre className={styles.output}>
                {output || 'Program output will appear here.'}
            </pre>
        </section>
    );
}