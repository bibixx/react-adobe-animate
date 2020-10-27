import React from "react";
import PropTypes from "prop-types";

// Libs are instanciated below in loadLibs
let AdobeAn;
let CreateJs;

export default class AnimateCC extends React.Component {
  static hexToRgba = (color, opacity) => {
    const r = parseInt(color.substring(1, 3), 16);
    const g = parseInt(color.substring(3, 5), 16);
    const b = parseInt(color.substring(5, 7), 16);

    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }

  static propTypes = {
    animationName: PropTypes.string.isRequired,
    composition: PropTypes.string,
    getAnimationObject: PropTypes.func,
    paused: PropTypes.bool,
    style: PropTypes.object,
  }

  static defaultProps = {
    getAnimationObject: () => {},
    composition: null,
    paused: false,
    style: {},
  }

  dimensions = {
    // config
    isResp: false,
    respDim: "both",
    isScale: false,
    scaleType: 1,

    // init values
    lastW: 1,
    lastH: 1,
    lastS: 1,
  }

  constructor() {
    super();

    this.state = {
      properties: {},
      error: false,
    };
  }

  componentDidMount() {
    this.loadLibs();

    try {
      this.initAdobeAn();
    } catch (e) {
      if (e.name === "AnimateCC") {
        console.error(`AnimateCC: ${e.message}`);
      } else {
        throw e;
      }

      this.setState({
        error: true,
      });
    }
  }

  componentDidUpdate() {
    const { error } = this.state;
    const { paused } = this.props;

    if (!error && this.lib !== undefined) {
      this.lib.tickEnabled = !paused;
    }
  }

  componentWillUnmount() {
    const { error } = this.state;

    if (!error) {
      window.removeEventListener("resize", this.resizeCanvas);
      this.stopAnimation();
    }
  }

  onAnimationReady = () => {
    window.addEventListener("resize", this.resizeCanvas);
    this.resizeCanvas();
    this.startAnimation();
  }

  getComposition = (searchedName) => {
    const { composition } = this.props;

    if (composition !== null) {
      return composition;
    }

    const compositionIds = Object.keys(AdobeAn.compositions);

    const [foundComposition] = compositionIds.filter((id) => {
      const library = AdobeAn.compositions[id].getLibrary();
      const props = Object.keys(library);

      const independent = props.filter((prop) => {
        if (library[prop].prototype
            && library[prop].prototype.mode
            && library[prop].prototype.mode === "independent") {
          return true;
        }

        return false;
      });

      return independent.filter(name => name === searchedName).length > 0;
    });

    return foundComposition;
  }

  loadLibs = () => {
    ({ AdobeAn } = window);
    CreateJs = window.createjs;
    if (!AdobeAn) {
      throw new Error("AdobeAn dependency not found");
    }
    if (!CreateJs) {
      throw new Error("createjs dependency not found");
    }
  }

  initAdobeAn = () => {
    const { animationName } = this.props;

    const composition = this.getComposition(animationName);

    let lib;
    let comp;
    try {
      comp = AdobeAn.getComposition(composition);
      lib = comp.getLibrary();
    } catch (e) {
      if (e.message === "Cannot read property 'getLibrary' of undefined") {
        const err = new Error(`Animation with name ${animationName} was not found`, "test");
        err.name = "AnimateCC";
        throw err;
      }

      throw e;
    }

    const loader = new CreateJs.LoadQueue(false);
    loader.addEventListener("fileload", (evt) => { this.handleFileLoad(evt, comp); });
    loader.addEventListener("complete", (evt) => { this.handleComplete(evt, comp); });
    lib = comp.getLibrary();
    loader.loadManifest(lib.properties.manifest);

    if (lib.properties.manifest.filter(({ type }) => type === "image").length === 0) {
      this.handleComplete(null, comp);
    }
  }

  handleComplete = (evt, comp) => {
    const { animationName, paused, getAnimationObject } = this.props;

    const lib = comp.getLibrary();

    if (evt) {
      const ss = comp.getSpriteSheet();
      const queue = evt.target;
      const { ssMetadata } = lib;
      for (let i = 0; i < ssMetadata.length; i++) {
        ss[ssMetadata[i].name] = new CreateJs.SpriteSheet({
          images: [queue.getResult(ssMetadata[i].name)],
          frames: ssMetadata[i].frames,
        });
      }
    }

    const exportRoot = new lib[animationName]();
    getAnimationObject(exportRoot);

    this.lib = exportRoot;
    this.lib.tickEnabled = !paused;

    const stage = new lib.Stage(this.canvas);

    this.stage = stage;
    this.setState({ properties: lib.properties }, this.onAnimationReady);
  }

  handleFileLoad = (evt, comp) => {
    const images = comp.getImages();
    if (evt && (evt.item.type === "image")) { images[evt.item.id] = evt.result; }
  }

  // Registers the "tick" event listener.
  startAnimation = () => {
    const { properties } = this.state;

    AdobeAn.compositionLoaded(properties.id);

    this.stage.addChild(this.lib);
    CreateJs.Ticker.setFPS(properties.fps);
    CreateJs.Ticker.addEventListener("tick", this.stage);
  }

  // Unregisters the "tick" event listener.
  stopAnimation = () => {
    CreateJs.Ticker.removeEventListener("tick", this.stage);
  }

  // Code to support hidpi screens and responsive scaling.
  resizeCanvas = () => {
    const { properties } = this.state;
    const w = properties.width;
    const h = properties.height;
    const iw = window.innerWidth;
    const ih = window.innerHeight;
    const pRatio = window.devicePixelRatio || 1;
    const xRatio = iw / w;
    const yRatio = ih / h;
    let sRatio = 1;
    const dim = this.dimensions;

    if (dim.isResp) {
      if ((dim.respDim === "width" && dim.lastW === iw) || (dim.respDim === "height" && dim.lastH === ih)) {
        sRatio = this.lastS;
      } else if (!dim.isScale) {
        if (iw < w || ih < h) { sRatio = Math.min(xRatio, yRatio); }
      } else if (dim.scaleType === 1) {
        sRatio = Math.min(xRatio, yRatio);
      } else if (dim.scaleType === 2) {
        sRatio = Math.max(xRatio, yRatio);
      }
    }

    this.canvas.width = w * pRatio * sRatio;
    this.canvas.height = h * pRatio * sRatio;
    this.stage.scaleX = pRatio * sRatio;
    this.stage.scaleY = pRatio * sRatio;
    dim.lastW = iw;
    dim.lastH = ih;
    dim.lastS = sRatio;
    this.stage.tickOnUpdate = false;
    this.stage.update();
    this.stage.tickOnUpdate = true;
  }

  render() {
    const {
      animationName,
      getAnimationObject,
      paused,
      style: additionalStyles,
      ...props
    } = this.props;

    const { properties } = this.state;

    if (Object.keys(properties).length === 0) {
      return (
        <div>
          <div ref={(el) => { this.animationContainer = el; }}>
            <canvas ref={(el) => { this.canvas = el; }} />
            <div ref={(el) => { this.domOverlayContainer = el; }} />
          </div>
        </div>
      );
    }

    const color = AnimateCC.hexToRgba(properties.color, properties.opacity);

    return (
      <div>
        <div
          ref={(el) => { this.animationContainer = el; }}
          style={{
            width: "100%",
            height: "100%",
            ...additionalStyles,
          }}
          {...props}
        >
          <canvas
            ref={(el) => { this.canvas = el; }}
            style={{
              display: "block",
              width: "100%",
              backgroundColor: color,
            }}
          />
          <div
            ref={(el) => { this.domOverlayContainer = el; }}
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
