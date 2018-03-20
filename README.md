# Adobe Animate React component

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

export default class Component extends React.Component {
  constructor() {
    super();
    this.state = {
      paused: true,
    };
  }

  onClick = () => this.setState({ paused: !this.state.paused })

  getAnimationObject = obj => (this.lis = obj, window.lis = obj)

  render() {
    return (
      <div style={{ width: "400px" }}>
        <AnimateCC
          fileName="animationName"
          composition="C1475B64B160904BB90B34246A5FF54B"
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

* composition[string] – an id of a animation that you can get from .html file generate by Adobe Animate (line 24: `var comp=AdobeAn.getComposition("2697D3D4B7EF4694B053B7ED09E94D07");`)
* fileName[string] – name of a file exported from Adobe Animate (one you specify in publish settings)
* getAnimationObject[function] – it is fired after component was mounted. It takes 1 argument – animation object that enables you to fire functions created in Adobe Animate
* paused[boolean] – whether an animation should be paused
* all other props will be passed to div surrounding canvas

### Exporting from Adobe Animate

Make sure to have `Make responsive` checked