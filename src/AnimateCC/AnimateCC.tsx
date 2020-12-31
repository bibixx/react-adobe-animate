import React from 'react';
import type createjs from 'createjs-module';
import { hexToRgba } from '../utils/hexToRgba';
import { checkLibs } from '../utils/checkLibs';

type CreateJS = typeof createjs;
type Stage = typeof createjs.Stage;

type Properties = {
  color: string
  fps: number
  id: string
  manifest: [{ type: string }]
  opacity: number
  preloads: []
  width: number
  height: number
};

type Metadata = {
  name: string
  frames: any
};

type Library = {
  properties: Properties
  Stage: Stage
  ssMetadata: Metadata[]
} & {
  [id: string]: typeof createjs.DisplayObject
};

type CompositionLib = createjs.DisplayObject;

type Composition = {
  getLibrary: () => Library,
  getSpriteSheet: () => Record<string, createjs.SpriteSheet>,
  getImages: () => any
};

interface An {
  compositions: {
    [id: string]: Composition
  };
  getComposition: (id: string) => Composition | undefined
  compositionLoaded: (id: string) => void
}

export type Props = {
  animationName: string,
  composition?: string,
  getAnimationObject?: (object: createjs.DisplayObject) => void,
  paused?: boolean,
  style?: React.CSSProperties,
};

export type State = {
  properties?: Properties,
  error: boolean,
};

// Libs are instantiated below in loadLibs
const AdobeAn = (window as any).AdobeAn as An;
const CreateJs = window.createjs as CreateJS;

export class AnimateCC extends React.Component<Props, State> {
  private compositionLib?: CompositionLib;

  private stage?: createjs.Stage;

  private lastS = 0;

  private canvasRef = React.createRef<HTMLCanvasElement>();

  static defaultProps = {
    getAnimationObject: () => {},
    composition: null,
    paused: false,
    style: {},
  };

  dimensions = {
    // config
    isResp: false,
    respDim: 'both',
    isScale: false,
    scaleType: 1,

    // init values
    lastW: 1,
    lastH: 1,
    lastS: 1,
  };

  state: State = {
    error: false,
  };

  componentDidMount() {
    checkLibs(AdobeAn, CreateJs);

    const { animationName } = this.props;

    const composition = this.getCompositionId(animationName);

    const comp = AdobeAn.getComposition(composition);

    if (comp === undefined) {
      console.error(`AnimateCC: Animation with name ${animationName} was not found`);
      this.setState({ error: true });
      return;
    }

    const lib = comp.getLibrary();

    const loader = new CreateJs.LoadQueue(false);
    loader.addEventListener('fileload', (evt) => { this.handleFileLoad(evt as createjs.Event, comp); });
    loader.addEventListener('complete', (evt) => { this.handleComplete(evt as createjs.Event, comp); });
    loader.loadManifest(lib.properties.manifest);

    if (lib.properties.manifest.filter(({ type }) => type === 'image').length === 0) {
      this.handleComplete(null, comp);
    }
  }

  componentDidUpdate() {
    const { error } = this.state;
    const { paused } = this.props;

    if (!error && this.compositionLib !== undefined) {
      this.compositionLib.tickEnabled = !paused;
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

    window.removeEventListener('resize', this.resizeCanvas);
    this.stopAnimation();
  }

  onAnimationReady = () => {
    window.addEventListener('resize', this.resizeCanvas);
    this.resizeCanvas();
    this.startAnimation();
  };

  getCompositionId = (searchedName: string): string => {
    const { composition } = this.props;

    if (composition) {
      return composition;
    }

    const compositionIds = Object.keys(AdobeAn.compositions);

    const [foundComposition] = compositionIds.filter((id) => {
      const library = (AdobeAn.compositions[id].getLibrary() as any) as {
        [id: string]: { prototype?: { mode?: string } }
      };
      const props = Object.keys(library);

      const independent = props.filter((prop) => {
        if (library?.[prop]?.prototype?.mode === 'independent') {
          return true;
        }

        return false;
      });

      return independent.some((name) => name === searchedName);
    });

    return foundComposition;
  };

  handleComplete = (evt: createjs.Event|null, comp: Composition) => {
    const { animationName, paused, getAnimationObject } = this.props;

    const lib = comp.getLibrary();

    if (evt !== null) {
      const ss = comp.getSpriteSheet();
      const queue = evt.target;
      const { ssMetadata } = lib;

      for (const metadata of ssMetadata) {
        ss[metadata.name] = new CreateJs.SpriteSheet({
          images: [queue.getResult(metadata.name)],
          frames: metadata.frames,
        });
      }
    }

    const exportRoot = new lib[animationName]();
    getAnimationObject?.(exportRoot);

    this.compositionLib = exportRoot;
    this.compositionLib.tickEnabled = !paused;

    if (this.canvasRef.current) {
      const stage = new lib.Stage(this.canvasRef.current);

      this.stage = stage;
      this.setState({ properties: lib.properties }, this.onAnimationReady);
    }
  };

  handleFileLoad = (evt: createjs.Event, comp: Composition) => {
    const images = comp.getImages();

    if (evt?.item?.type === 'image') {
      images[evt.item.id] = evt.result;
    }
  };

  // Registers the "tick" event listener.
  startAnimation = () => {
    const { properties } = this.state;

    if (properties !== undefined) {
      AdobeAn.compositionLoaded(properties.id);
    }

    if (this.compositionLib !== undefined) {
      this.stage?.addChild(this.compositionLib);
    }

    if (properties !== undefined && this.stage !== undefined) {
      CreateJs.Ticker.framerate = properties.fps;
      CreateJs.Ticker.addEventListener('tick', this.stage);
    }
  };

  // Unregisters the "tick" event listener.
  stopAnimation = () => {
    if (this.stage !== undefined) {
      CreateJs.Ticker.removeEventListener('tick', this.stage as any as Function);
    }
  };

  // Code to support hidpi screens and responsive scaling.
  resizeCanvas = () => {
    const { properties } = this.state;
    const w = properties?.width ?? 1;
    const h = properties?.height ?? 1;
    const iw = window.innerWidth;
    const ih = window.innerHeight;
    const pRatio = window.devicePixelRatio || 1;
    const xRatio = iw / w;
    const yRatio = ih / h;
    let sRatio = 1;
    const dim = this.dimensions;

    if (dim.isResp) {
      if ((dim.respDim === 'width' && dim.lastW === iw) || (dim.respDim === 'height' && dim.lastH === ih)) {
        sRatio = this.lastS;
      } else if (!dim.isScale) {
        if (iw < w || ih < h) { sRatio = Math.min(xRatio, yRatio); }
      } else if (dim.scaleType === 1) {
        sRatio = Math.min(xRatio, yRatio);
      } else if (dim.scaleType === 2) {
        sRatio = Math.max(xRatio, yRatio);
      }
    }

    if (this.canvasRef.current !== null) {
      this.canvasRef.current.width = w * pRatio * sRatio;
      this.canvasRef.current.height = h * pRatio * sRatio;
    }

    if (this.stage !== undefined) {
      this.stage.scaleX = pRatio * sRatio;
      this.stage.scaleY = pRatio * sRatio;
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
      ...props
    } = this.props;

    const { properties } = this.state;

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
