import {createReadStream} from "node:fs";
import {access, rm} from "node:fs/promises";

const isAccessible = async (path) => {
  try {
    await access(path);
    return true;
  }
  catch {
    return false;
  }
};

const remove = async (path) => {
  if (Array.isArray(path)) {
    for (const item of path) {
      await remove(item);
    }
  }
  else if (await isAccessible(path)) {
    await rm(path, {recursive: true});
  }
};

const read = async (path, configuration = {encoding: "utf-8"}) => {
  let content = "";
  const readStream = createReadStream(path, configuration);
  for await (const chunk of readStream) {
    content += chunk;
  }
  return content;
};

export {remove, read};
