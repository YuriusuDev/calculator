import {argv} from "node:process";
import {build, context} from "esbuild";
import {remove} from "./utilities.js";
import configuration from "./configuration.js";

switch (argv.at(2)) {
  case "serve":
    const esbuild = await context(configuration.build);
    await esbuild.watch();
    await esbuild.serve(configuration.serve);
    break;
  case "build":
    await build(configuration.build);
    break;
  case "clean":
    await remove(configuration.build.outdir);
    break;
  default:
    console.log([
      "Usage: node server <command>",
      "",
      "Commands:",
      "  serve             Launch development server",
      "  build             Bundle for production",
      "  clean             Remove generated build"
    ].join("\n"));
}
