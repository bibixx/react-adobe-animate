import React from "react";
import createjs from "createjs-module";

import getCompositionId from "../../utils/getCompositionId";
import AnimateCCError from "../../utils/AnimateCCError";
import AdobeAn, { Composition, LibraryProperties } from "../../utils/AdobeAn";
import CreateJs from "../../utils/CreateJs";
import hexToRgba from "../../utils/hexToRgba";

type AnimateCCProps = {
  animationName: string;
  composition: string;
  paused: boolean;
  getAnimationObject: (animationObject: createjs.MovieClip) => void;
  style: object;
};

type AnimateCCState = {
  properties?: LibraryProperties;
};

export default class AnimateCC extends React.Component<AnimateCCProps, AnimateCCState> {
  private library?: createjs.MovieClip;

  private stage?: createjs.Stage;

  private canvas = React.createRef<HTMLCanvasElement>();

  private animationContainer = React.createRef<HTMLDivElement>();

  private domOverlayContainer = React.createRef<HTMLDivElement>();

  public state: AnimateCCState = {
    properties: undefined,
  };

  static defaultProps = {
    composition: undefined,
    paused: false,
    getAnimationObject: () => {},
    style: {},
  };

  componentDidMount() {
    try {
      this.initAdobeAn();
    } catch (error) {
      // todo
    }
  }

  initAdobeAn = () => {
    const {
      animationName,
      composition: compositionProp,
    } = this.props;

    const compositionId = getCompositionId(animationName, compositionProp);

    if (compositionId === undefined) {
      throw new AnimateCCError(animationName);
    }

    const composition = AdobeAn.getComposition(compositionId);

    const loader = new CreateJs.LoadQueue(false);

    loader.addEventListener("fileload", e => {
      this.handleFileLoad(e, composition);
    });

    loader.addEventListener("complete", e => {
      this.handleComplete(e, composition);
    });

    const library = composition.getLibrary();

    if (!library.properties || !library.properties.manifest) {
      return;
    }

    loader.loadManifest(library.properties.manifest);

    if (library.properties.manifest.filter(({ type }) => type === "image").length === 0) {
      this.handleComplete(null, composition);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handleFileLoad = (_evt: any, _comp: any) => {};

  handleComplete = (
    evt: any,
    composition: Composition,
  ) => {
    const { animationName, paused, getAnimationObject } = this.props;
    const library = composition.getLibrary();

    if (evt) {
      const spriteSheets = composition.getSpriteSheet();
      const queue = evt.target;
      const { ssMetadata } = library;
      for (let i = 0; i < ssMetadata.length; i++) {
        spriteSheets[ssMetadata[i].name] = new CreateJs.SpriteSheet({
          images: [queue.getResult(ssMetadata[i].name)],
          frames: ssMetadata[i].frames,
        });
      }
    }

    const currentAnimationLibrary: createjs.MovieClip = new library[animationName]();

    this.library = currentAnimationLibrary;
    this.library.tickEnabled = !paused;

    const stage = new library.Stage(this.canvas.current);

    this.stage = stage;

    this.setState({
      properties: library.properties,
    }, this.onAnimationReady);

    getAnimationObject(currentAnimationLibrary);
  };

  onAnimationReady = () => {
    // todo
    this.startAnimation();
  };

  startAnimation = () => {
    const { properties } = this.state;

    if (!properties || this.stage === undefined || this.library === undefined) {
      throw new ReferenceError("properties is not defined");
    }

    AdobeAn.compositionLoaded(properties.id);

    this.stage.addChild(this.library);

    CreateJs.Ticker.setFPS(properties.fps);
    CreateJs.Ticker.addEventListener("tick", this.stage);
  };

  render() {
    const {
      animationName,
      getAnimationObject,
      paused,
      style: additionalStyles,
      ...props
    } = this.props;

    const { properties } = this.state;

    if (!properties || Object.keys(properties).length === 0) {
      return (
        <div>
          <div ref={this.animationContainer}>
            <canvas ref={this.canvas} />
            <div ref={this.domOverlayContainer} />
          </div>
        </div>
      );
    }

    const color = hexToRgba(properties.color, properties.opacity);

    return (
      <div>
        <div
          ref={this.animationContainer}
          style={{
            width: "100%",
            height: "100%",
            position: "relative",
            ...additionalStyles,
          }}
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...props}
        >
          <canvas
            ref={this.canvas}
            style={{
              display: "block",
              width: "100%",
              backgroundColor: color,
            }}
          />
          <div
            ref={this.domOverlayContainer}
            style={{
              pointerEvents: "none",
              overflow: "hidden",
              width: `${properties.width}px`,
              height: `${properties.height}px`,
              position: "absolute",
              left: "0px",
              top: "0px",
              display: "block",
            }}
          />
        </div>
      </div>
    );
  }
}
