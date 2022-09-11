import type CreateJS from 'createjs-module';

import { Composition, Library } from 'types/AdobeAn';

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
  const pRatio = window.devicePixelRatio;

  stage.scaleX = pRatio;
  stage.scaleY = pRatio;
  stage.tickOnUpdate = false;
  stage.update();
  stage.tickOnUpdate = true;
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  window.createjs.Ticker.removeEventListener('tick', stage as any);
};
