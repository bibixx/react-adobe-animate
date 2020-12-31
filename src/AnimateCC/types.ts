import { Properties } from '../utils/AdobeAn';

export type GetAnimationObjectParameter = createjs.DisplayObject;
export type AnimationObject = createjs.DisplayObject;

export type Props = {
  animationName: string,
  composition?: string,
  getAnimationObject?: (object: GetAnimationObjectParameter) => void,
  paused?: boolean,
  style?: React.CSSProperties,
};

export type State = {
  properties?: Properties,
  error: boolean,
};
