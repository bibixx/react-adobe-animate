# Adobe Animate React component

[![npm](https://badgen.net/npm/dt/react-adobe-animate)](https://www.npmjs.com/package/react-adobe-animate)
![CircleCI branch](https://badgen.net/circleci/github/bibixx/react-adobe-animate/master)
[![david-dm.org](https://badgen.net/david/dep/bibixx/react-adobe-animate)](https://david-dm.org/bibixx/react-adobe-animate)

The component helps to embed animations from Adobe Animate.

## Installation

`npm install -S react-adobe-animate`

## Dependencies

* React
* CreateJS – add this to your page `<script src="https://code.createjs.com/createjs-2015.11.26.min.js"></script>`
* Your animation – add .js file exported from Adobe Animate to page with `<script>` tag

## How to use

```javascript
import React from "react";
import AnimateCC from "react-adobe-animate";

export default class Component extends React.Component {
  constructor() {
    super();
    this.state = {
      paused: true,
    };
  }

  onClick = () => this.setState({ paused: !this.state.paused })

  getAnimationObject = obj => (this.animationObject = obj)

  render() {
    return (
      <div style={{ width: "400px" }}>
        <AnimateCC
          animationName="animationName"
          getAnimationObject={this.getAnimationObject}
          paused={this.state.paused}
        />

        <button onClick={this.onClick}>{this.state.paused ? "Unpause" : "Pause"}</button>
      </div>
    );
  }
}
```

### This component accepts a few props

| Prop name | Type | Required | Description  |
| --------- | ---- | -------- | ------------ |
| animationName | string | true | Name of animation (line 32: `exportRoot = new lib.animationName();` or after `// stage content:` comment. There the name is `(lib.animationName = function`. Also usually name of published file) |
composition | string | false | If you have two animations with same name you can specify an id of that animation. You can get it from .html file generate by Adobe Animate (line 24: `var comp=AdobeAn.getComposition("C1475B64B160904BB90B34246A5FF54B");`) |
| getAnimationObject | function | false | It is fired after component was mounted. It takes 1 argument – animation object that enables you to fire functions created in Adobe Animate
paused | boolean | false | Whether an animation should be paused

All other props will be passed to div surrounding canvas

### FAQ

#### How do I insert animations published from the same file?

Unfortunately it isn't possible to export from Adobe Animate two unique animations. However you can make one! Simply replace all occurrences of composition id inside your .js file of an animation to one created by you. Composition id is this long string on line 24: `var comp=AdobeAn.getComposition("C1475B64B160904BB90B34246A5FF54B");` in .html file. (P.S. Also make sure that file names of published animations are unique)

### Example

[https://bibixx.github.io/react-adobe-animate/](https://bibixx.github.io/react-adobe-animate/)
