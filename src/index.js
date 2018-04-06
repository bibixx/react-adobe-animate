import React from "react";
import PropTypes from "prop-types";
import init from "./adobeFunctions";

export default class AnimateCC extends React.Component {
  static propTypes = {
    animationName: PropTypes.string.isRequired,
    getAnimationObject: PropTypes.func,
    paused: PropTypes.bool,
    style: PropTypes.object,
  }

  static defaultProps = {
    getAnimationObject: () => {},
    paused: false,
    style: {},
  }

  static hexToRgba = (color, opacity) => {
    const r = parseInt(color.substring(1, 3), 16);
    const g = parseInt(color.substring(3, 5), 16);
    const b = parseInt(color.substring(5, 7), 16);

    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }

  constructor() {
    super();

    this.state = {
      properties: {},
      error: false,
    };
  }

  componentDidMount() {
    try {
      init(
        this.props.animationName,
        this.canvas,
        this.animationContainer,
        this.domOverlayContainer,
        (l) => {
          this.props.getAnimationObject(l);
          this.lib = l;
          this.lib.tickEnabled = !this.props.paused;
        },
        properties => (this.setState({ properties })),
      );
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

  componentWillReceiveProps({ paused }) {
    if (!this.state.error) {
      this.lib.tickEnabled = !paused;
    }
  }

  componentWillUnmount() {
    if (!this.state.error) {
      this.lib.visible = false;
    }
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
