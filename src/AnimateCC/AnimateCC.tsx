import React from 'react';
import type createjs from 'createjs-module';
import { AdobeAn, Composition } from '../utils/AdobeAn';
import { CreateJS } from '../utils/CreateJS';

import { hexToRgba } from '../utils/hexToRgba';
import { getCompositionId } from '../utils/getCompositionId';
import { log } from '../utils/log';

import {
  AnimationObject,
  Props,
  State,
} from './types';

export class AnimateCC extends React.Component<Props, State> {
  private animationObject?: AnimationObject;

  private stage?: createjs.Stage;

  private canvasRef = React.createRef<HTMLCanvasElement>();

  static defaultProps = {
    getAnimationObject: () => {},
    composition: null,
    paused: false,
    style: {},
  };

  state: State = {
    error: false,
  };

  componentDidMount() {
    const { animationName, composition: externalCompositionId } = this.props;

    const compositionId = getCompositionId(animationName, externalCompositionId);

    if (compositionId === null) {
      log(`${externalCompositionId} composition was not found in ${animationName} animation`);
      this.setState({ error: true });
      return;
    }

    const composition = AdobeAn.getComposition(compositionId);

    if (composition === undefined) {
      log(`Animation with name ${animationName} was not found`);
      this.setState({ error: true });
      return;
    }

    const { properties: { manifest } } = composition.getLibrary();

    const loader = new CreateJS.LoadQueue(false);
    loader.addEventListener('fileload', (evt) => { this.handleFileLoad(evt as createjs.Event, composition); });
    loader.addEventListener('complete', (evt) => { this.handleComplete(evt as createjs.Event, composition); });
    loader.loadManifest(manifest);

    if (manifest.filter(({ type }) => type === 'image').length === 0) {
      this.handleComplete(null, composition);
    }
  }

  componentDidUpdate() {
    const { error } = this.state;
    const { paused } = this.props;

    if (!error && this.animationObject !== undefined) {
      this.animationObject.tickEnabled = !paused;
    }
  }

  componentWillUnmount() {
    const { error } = this.state;
    if (error) {
      return;
    }

    // Force garbage collection on Safari
    // https://bugs.webkit.org/show_bug.cgi?id=195325
    if (this.canvasRef.current) {
      this.canvasRef.current.height = 0;
      this.canvasRef.current.width = 0;
    }

    this.stopAnimation();
  }

  private onAnimationReady = () => {
    this.resizeCanvas();
    this.startAnimation();
  };

  private handleComplete = (evt: createjs.Event|null, composition: Composition) => {
    const {
      animationName, paused, getAnimationObject,
    } = this.props;

    const lib = composition.getLibrary();

    if (evt !== null) {
      const ss = composition.getSpriteSheet();

      const queue = evt.target;
      const { ssMetadata = [] } = lib;

      for (const metadata of ssMetadata) {
        if (metadata) {
          ss[metadata.name] = new CreateJS.SpriteSheet({
            images: [queue?.getResult(metadata.name)],
            frames: metadata.frames,
          });
        }
      }
    }

    const animationObject = new lib[animationName]();
    getAnimationObject?.(animationObject);

    this.animationObject = animationObject;
    this.animationObject.tickEnabled = !paused;

    if (this.canvasRef.current) {
      this.stage = new lib.Stage(this.canvasRef.current);
      this.setState({ properties: lib.properties }, this.onAnimationReady);
    }
  };

  private handleFileLoad = (evt: createjs.Event, comp: Composition) => {
    const images = comp.getImages();
    if (evt?.item?.type === 'image') {
      images[evt.item.id] = evt.result;
    }
  };

  // Registers the "tick" event listener.
  private startAnimation = () => {
    const { properties } = this.state;

    if (properties !== undefined) {
      AdobeAn.compositionLoaded(properties.id);
    }

    if (this.animationObject !== undefined) {
      this.stage?.addChild(this.animationObject);
    }

    if (properties !== undefined && this.stage !== undefined) {
      CreateJS.Ticker.framerate = properties.fps;
      CreateJS.Ticker.addEventListener('tick', this.stage);
    }
  };

  // Unregisters the "tick" event listener.
  private stopAnimation = () => {
    if (this.stage !== undefined) {
      CreateJS.Ticker.removeEventListener('tick', this.stage as any as Function);
    }
  };

  private getCanvasSize = () => {
    const { properties } = this.state;
    const width = properties?.width ?? 1;
    const height = properties?.height ?? 1;
    const pRatio = window.devicePixelRatio;

    return {
      width: width * pRatio,
      height: height * pRatio,
    };
  };

  // Code to support hidpi screens and responsive scaling.
  private resizeCanvas = () => {
    const pRatio = window.devicePixelRatio;

    if (this.stage !== undefined) {
      this.stage.scaleX = pRatio;
      this.stage.scaleY = pRatio;
      this.stage.tickOnUpdate = false;
      this.stage.update();
      this.stage.tickOnUpdate = true;
    }
  };

  render() {
    const {
      animationName,
      getAnimationObject,
      paused,
      style: additionalStyles,
      composition,
      ...props
    } = this.props;

    const { properties } = this.state;
    const { width: canvasWidth, height: canvasHeight } = this.getCanvasSize();

    if (properties === undefined || Object.keys(properties).length === 0) {
      return (
        <div>
          <div>
            <canvas ref={this.canvasRef} />
            <div />
          </div>
        </div>
      );
    }

    const color = hexToRgba(properties.color, properties.opacity);

    return (
      <div>
        <div
          style={{
            width: '100%',
            height: '100%',
            ...additionalStyles,
          }}
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...props}
        >
          <canvas
            ref={this.canvasRef}
            width={canvasWidth}
            height={canvasHeight}
            style={{
              display: 'block',
              width: '100%',
              backgroundColor: color,
            }}
          />
          <div
            style={{
              pointerEvents: 'none',
              overflow: 'hidden',
              width: `${properties.width}px`,
              height: `${properties.height}px`,
              position: 'absolute',
              left: '0px',
              top: '0px',
              display: 'block',
            }}
          />
        </div>
      </div>
    );
  }
}
