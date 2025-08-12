import {defineConfig} from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import pkg from './package.json';

export default defineConfig({
    plugins: [vue()],
    target: 'es2015',
    resolve: {
        extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue']
    },
    server: {
        host: true,
        port: 8080,
        open: true
    },
    css: {
        preprocessorOptions: {
            less: {
                javascriptEnabled: true,
            },
        }
    },
    define: {
        'process.env.VERSION': JSON.stringify(pkg.version),
    }
});
