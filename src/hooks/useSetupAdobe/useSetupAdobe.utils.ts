import type CreateJS from 'createjs-module';

import { Composition, Library } from 'src/types/AdobeAn';

export const createSpriteSheets = (
  queue: CreateJS.AbstractLoader,
  lib: Library,
  composition: Composition,
) => {
  const spriteSheet = composition.getSpriteSheet();
  const { ssMetadata = [] } = lib;

  for (const metadata of ssMetadata) {
    if (metadata) {
      spriteSheet[metadata.name] = new window.createjs.SpriteSheet({
        images: [queue?.getResult(metadata.name)],
        frames: metadata.frames,
      });
    }
  }
};

export const resizeCanvas = (stage: CreateJS.Stage) => {
  /* eslint-disable no-param-reassign */
  const pRatio = window.devicePixelRatio;

  stage.scaleX = pRatio;
  stage.scaleY = pRatio;
  stage.tickOnUpdate = false;
  stage.update();
  stage.tickOnUpdate = true;
  /* eslint-enable no-param-reassign */
};

export const startAnimation = (
  id: string,
  fps: number,
  animationObject: CreateJS.DisplayObject,
  stage: CreateJS.Stage,
) => {
  window.AdobeAn.compositionLoaded(id);

  stage.addChild(animationObject);

  window.createjs.Ticker.framerate = fps;
  window.createjs.Ticker.addEventListener('tick', stage);
};

export const stopAnimation = (stage: CreateJS.Stage) => {
  // `as any` has been used as `removeEventListener` lacks signature for `createjs.Stage`
  window.createjs.Ticker.removeEventListener('tick', stage as any);
};
