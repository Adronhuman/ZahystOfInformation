import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "../../wwwroot/lab5",
    emptyOutDir: true
  },
  base: "/lab5"
})
