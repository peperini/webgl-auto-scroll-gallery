import { defineConfig } from 'vite';

import glslPlugin from 'vite-plugin-glsl';

export default defineConfig({
    plugins: [glslPlugin()]
})