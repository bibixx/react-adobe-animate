import { HTMLProps } from 'react';

import { Properties } from 'types/AdobeAn';

export type GetAnimationObjectParameter = createjs.DisplayObject;
export type AnimationObject = createjs.DisplayObject;

export interface Props extends HTMLProps<HTMLDivElement> {
  /**
   * @description Name of animation (`exportRoot = new lib.animationName();` in js file. There the name is `(lib.animationName = function`. Also usually name of published file)
   */
  animationName: string;
  /**
   * @description If you have two animations with same name you can specify an id of that animation. You can get it from .html file generate by Adobe Animate (`var comp=AdobeAn.getComposition("C1475B64B160904BB90B34246A5FF54B");`)
   */
  composition?: string;
  /**
   * @description It is fired after component was mounted. It takes 1 argument – animation object that enables you to fire functions created in Adobe Animate
   */
  getAnimationObject?: (object: GetAnimationObjectParameter) => void;
  /**
   * @description Whether an animation should be paused
   */
  paused?: boolean;
  /**
   * @description Function called whenever an error is thrown inside the component
   */
  onError?: () => void;
}

export type State = {
  properties?: Properties;
  error: boolean;
};
