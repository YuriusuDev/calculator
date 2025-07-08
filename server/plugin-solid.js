import {transformAsync} from "@babel/core";
import solid from "babel-preset-solid";
import {read} from "./utilities.js";

const solidjs = () => ({
  name: "solidjs",
  setup: ({onLoad}) => {
    onLoad({filter: /\.js?$/}, async ({path}) => {
      const source = await read(path, {encoding: "utf-8"});
      const {code} = await transformAsync(source, {presets: [solid]});
      return {contents: code, loader: "js"};
    });
  }
});

export {solidjs};
