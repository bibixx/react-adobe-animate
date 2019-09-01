<h1 align="center">Adobe Animate React component</h1>

[![npm](https://badgen.net/npm/v/react-adobe-animate)](https://www.npmjs.com/package/react-adobe-animate)
[![npm](https://badgen.net/npm/dt/react-adobe-animate)](https://www.npmjs.com/package/react-adobe-animate)
[![npm](https://badgen.net/npm/dm/react-adobe-animate)](https://www.npmjs.com/package/react-adobe-animate)
![CircleCI branch](https://badgen.net/circleci/github/bibixx/react-adobe-animate)
[![david-dm.org](https://badgen.net/david/dep/bibixx/react-adobe-animate)](https://david-dm.org/bibixx/react-adobe-animate)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![Commitizen friendly](https://badgen.net/badge/commitizen/friendly/green)](http://commitizen.github.io/cz-cli/)

> The component for embedding animations from Adobe Animate.

## Installation

`npm install -S react-adobe-animate`

## Examples

* [Simple implementation (codesandbox.io)](https://codesandbox.io/s/react-adobe-animate-zw61y)

## Dependencies

* React
* CreateJS – add this to your page `<script src="https://code.createjs.com/createjs-2015.11.26.min.js"></script>`
* Your animation – add .js file exported from Adobe Animate to page with `<script>` tag

## How to use
### Example
#### index.html
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <title>React Adobe Animate exmaple</title>
  </head>
  <body>
    <div id="root"></div>
    <script src="https://code.createjs.com/createjs-2015.11.26.min.js" type="text/javascript"></script>
    <script src="./lishtml5-with-background.js" type="text/javascript"></script>
    <script src="./lishtml5.js" type="text/javascript"></script>
  </body>
</html>

```

#### App.js
```jsx
import React, { useState } from "react";
import AnimateCC from "react-adobe-animate";

const App = () => {
  const [paused, setPaused] = useState(false);
  const [, setAnimationObject] = useState(null);
  const getAnimationObject = obj => setAnimationObject(obj);
  const onClick = () => setPaused(!paused);

  return (
    <div style={{ width: "400px" }}>
      <AnimateCC
        animationName="lishtml5"
        getAnimationObject={getAnimationObject}
        paused={paused}
      />

      <AnimateCC
        animationName="lishtml5"
        composition="C1475B64B160904BB90B34246A5FF54B"
        paused={paused}
      />

      <button onClick={onClick}>{paused ? "Unpause" : "Pause"}</button>
    </div>
  );
};
```

### Props

| Prop name | Type | Required | Description  |
| --------- | ---- | -------- | ------------ |
| animationName | string | true | Name of animation (`exportRoot = new lib.animationName();` in js file. There the name is `(lib.animationName = function`. Also usually name of published file) |
composition | string | false | If you have two animations with same name you can specify an id of that animation. You can get it from .html file generate by Adobe Animate (`var comp=AdobeAn.getComposition("C1475B64B160904BB90B34246A5FF54B");`) |
| getAnimationObject | function | false | It is fired after component was mounted. It takes 1 argument – animation object that enables you to fire functions created in Adobe Animate
paused | boolean | false | Whether an animation should be paused

All other props will be passed to div surrounding canvas

### FAQ

#### How do I insert animations published from the same file?

Unfortunately it isn't possible to export from Adobe Animate two unique animations. However you can make one! Simply replace all occurrences of composition id inside your .js file of an animation to one created by you. Composition id is this long string in `var comp=AdobeAn.getComposition("C1475B64B160904BB90B34246A5FF54B");` found in .html file published by Adobe Animate.

## 🤝 Contributing

Contributions, issues and feature requests are welcome!<br />Feel free to check [issues page](https://github.com/bibixx/react-adobe-animate/issues).

## Show your support

Give a ⭐️ if this project helped you!

## 📝 License

Copyright © 2019 [bibixx <bartosz@legiec.eu>](https://github.com/bibixx).<br />
This project is [MIT](https://github.com/bibixx/react-adobe-animate/blob/master/LICENSE) licensed.
