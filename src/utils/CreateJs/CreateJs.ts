import createjs from "createjs-module";

const { createjs: CreateJs }: { createjs: (typeof createjs) } = (window as any);

if (CreateJs === undefined) {
  throw new Error("createjs dependency not found");
}

export default CreateJs;
