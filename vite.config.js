import { resolve } from 'path';
import { defineConfig } from 'vite';
import glslPlugin from 'vite-plugin-glsl'

export default defineConfig({
    resolve: {
        alias: {
            '/@': resolve(__dirname, './')
        }
    },

    plugins: [
        glslPlugin()
    ]
})