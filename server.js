import {context} from "esbuild";

const esbuild = await context({
  entryPoints: [
    "./source/*"
  ],
  loader: {
    ".html": "copy",
    ".css": "css",
    ".js": "js",
    ".jsx": "jsx",
    ".json": "copy",
    ".svg": "copy",
    ".png": "copy"
  },
  assetNames: "[dir]/[name]",
  entryNames: "[dir]/[name]",
  publicPath: "./",
  outdir: "public",
  target: "esnext",
  format: "esm",
  jsx: "automatic",
  bundle: true,
  treeShaking: true,
  splitting: false,
  sourcemap: false,
  minify: true,
  minifyIdentifiers: true,
  minifyWhitespace: true,
  minifySyntax: true,
  write: true
});

await esbuild.watch();

const {host, port} = await esbuild.serve({
  servedir: "public",
  fallback: "public/index.html"
});

console.table({Server: `http://${host}:${port}`});
