import { HTMLProps } from 'react';

import { Properties } from 'src/types/AdobeAn';

export type GetAnimationObjectParameter = createjs.DisplayObject;
export type AnimationObject = createjs.DisplayObject;

export interface Props extends HTMLProps<HTMLDivElement> {
  animationName: string;
  composition?: string;
  getAnimationObject?: (object: GetAnimationObjectParameter) => void;
  onError?: () => void;
  paused?: boolean;
}

export type State = {
  properties?: Properties;
  error: boolean;
};
