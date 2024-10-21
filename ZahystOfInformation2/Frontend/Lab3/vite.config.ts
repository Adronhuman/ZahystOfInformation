import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "../../wwwroot/lab3",
    emptyOutDir: true
  },
  base: "/lab3"
})
