import {solidjs} from "./plugin-solid.js";

export default {
  build: {
    plugins: [
      solidjs()
    ],
    entryPoints: [
      "source/*"
    ],
    loader: {
      ".json": "copy",
      ".js": "js",
      ".css": "css",
      ".html": "copy",
      ".svg": "copy",
      ".png": "copy",
      ".ttf": "copy"
    },
    assetNames: "[dir]/[name]",
    entryNames: "[dir]/[name]",
    outdir: "public",
    target: "esnext",
    format: "esm",
    bundle: true,
    treeShaking: true,
    splitting: false,
    sourcemap: false,
    minify: true,
    minifyIdentifiers: true,
    minifyWhitespace: true,
    minifySyntax: true,
    legalComments: "none",
    write: true
  },
  serve: {
    host: "0.0.0.0",
    port: 3000,
    servedir: "public",
    fallback: "public/index.html"
  }
};
