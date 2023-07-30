import { defineConfig } from 'vite'

export default defineConfig({
    build: {
        outDir: 'src/front/dist',
        sourcemap: true,
        rollupOptions: {
            input: 'src/front/javascript/app.ts',
            output: {
                entryFileNames: 'app.js'
            }
        }
    }
})
