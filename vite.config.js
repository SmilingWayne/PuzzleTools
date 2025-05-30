import { fileURLToPath, URL } from "url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

const isProdEnv = process.env.NODE_ENV === 'production';
const PUBLIC_PATH = isProdEnv ? process.env.PUBLIC_PATH + "/" + process.env.CHAT_VARIABLE : process.env.PUBLIC_PATH;
const OUT_DIR = isProdEnv ? 'build/' + process.env.CHAT_VARIABLE : 'build';
const PLUGINS  = isProdEnv ? [react()] : [
    react()
];

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: "::",
    port: "8080",
    hmr: {
      overlay: false
    }
  },
  plugins: [
    PLUGINS
  ],
  base: "/PuzzleTools",
  build: {
    outDir: "./build"
  },
  resolve: {
    alias: [
      {
        find: "@",
        replacement: fileURLToPath(new URL("./src", import.meta.url)),
      },
      {
        find: "lib",
        replacement: resolve(__dirname, "lib"),
      },
    ],
  },
});
