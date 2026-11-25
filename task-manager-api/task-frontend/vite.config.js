import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // Port fix rakha hai taaki backend ke CORS origins se hamesha match kare
  server: { port: 5173, strictPort: true },
});
