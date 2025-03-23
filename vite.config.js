import { defineConfig } from 'vite';

import usePHP from 'vite-plugin-php';
export default defineConfig({
    plugins: [
        usePHP({
            entry: ['index.php'],
        }),
    ],
    root: './',
    build: {
        outDir: './public',
    },
    server: {
        port: 3000,
    },
});
