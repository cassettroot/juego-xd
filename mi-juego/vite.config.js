import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react' // O el framework que uses
import tailwindcss from '@tailwindcss/vite' // <-- Agrega esta línea

export default defineConfig({
  plugins: [
    react(), // (Si estás usando React)
    tailwindcss(), // <-- Agrega el plugin aquí
  ],
})