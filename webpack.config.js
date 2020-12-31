/* eslint-disable import/no-commonjs */

const path = require("path");

const exp = {
  entry: "./src/index.ts",
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "index.js",
    libraryTarget: "commonjs2",
  },
  target: "web",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        include: path.resolve(__dirname, "src"),
        exclude: /(node_modules|build)/,
        use: {
          loader: "ts-loader",
        },
      },
      {
        test: /\.js$/,
        include: path.resolve(__dirname, "src"),
        exclude: /(node_modules|build)/,
        use: {
          loader: "babel-loader",
        },
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  externals: [
    "react",
    "react-dom",
  ],
  devtool: "#source-map",
};

if (process.env.NODE_ENV !== "production") {
  exp.externals = {
    react: "commonjs react", // this line is just to use the React dependency of our parent-testing-project instead of using our own React.
    "prop-types": "commonjs prop-types", // this line is just to use the React dependency of our parent-testing-project instead of using our own React.
  };
} else {
  exp.devtool = "#source-map";
}

module.exports = exp;
