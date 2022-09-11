import { MutableRefObject, useEffect, useRef, useState } from 'react';
import type CreateJS from 'createjs-module';

import { getCompositionId } from '../../utils/getCompositionId';
import { log } from '../../utils/log';

import { Props } from '../../AnimateCC/AnimateCC.types';
import { Composition, Properties } from '../../types/AdobeAn';

import {
  createSpriteSheets,
  resizeCanvas,
  startAnimation,
  stopAnimation,
} from './useSetupAdobe.utils';

interface Arguments extends Props {
  canvasRef: MutableRefObject<HTMLCanvasElement | null>;
}

export const useSetupAdobe = ({
  animationName,
  composition: externalCompositionId,
  getAnimationObject,
  paused,
  onError,
  canvasRef,
}: Arguments) => {
  const [properties, setProperties] = useState<Properties>();
  const compositionRef = useRef<Composition>();
  const animationObjectRef = useRef<CreateJS.DisplayObject>();
  const stageRef = useRef<CreateJS.Stage>();
  const hasError = useRef(false);

  const setHasError = (newHasError: boolean) => {
    hasError.current = newHasError;

    if (newHasError) {
      onError?.();
    }
  };

  const setAnimationObject = (animationObject: CreateJS.DisplayObject) => {
    animationObjectRef.current = animationObject;
    getAnimationObject?.(animationObject);
  };

  const handleComplete = (event: CreateJS.Event | null) => {
    if (hasError.current) {
      return;
    }

    const composition = compositionRef.current as Composition;
    const lib = composition.getLibrary();

    if (event !== null) {
      createSpriteSheets(event.target, lib, composition);
    }

    const animationObject = new lib[animationName]();
    setAnimationObject(animationObject);

    animationObject.tickEnabled = !paused;

    const canvas = canvasRef.current as HTMLCanvasElement;

    const stage = new lib.Stage(canvas);
    stageRef.current = stage;
    const { properties: newProperties } = lib;

    setProperties(newProperties);

    resizeCanvas(stage);
    startAnimation(newProperties.id, newProperties.fps, animationObject, stage);
  };

  const handleFileLoad = (event: CreateJS.Event) => {
    const composition = compositionRef.current as Composition;

    const images = composition.getImages();
    if (event?.item?.type === 'image') {
      images[event.item.id] = event.result;
    }
  };

  const handleFileError = (event: CreateJS.ErrorEvent) => {
    setHasError(true);

    if (event.title === 'FILE_LOAD_ERROR') {
      const { src } = event.data as { src: string };

      log(`Asset ${src} failed to load`);
    } else {
      log('An unknown error has occurred while loading an asset', event);
    }
  };

  const cleanup = (loader?: CreateJS.LoadQueue) => {
    const stage = stageRef.current;
    loader?.removeEventListener('fileload', handleFileLoad);
    loader?.removeEventListener('complete', handleComplete);
    loader?.removeEventListener('error', handleFileError);

    setProperties(undefined);
    compositionRef.current = undefined;
    animationObjectRef.current = undefined;
    stageRef.current = undefined;
    setHasError(false);

    if (stage) {
      stopAnimation(stage);
    }
  };

  useEffect(() => {
    const compositionId = getCompositionId(
      animationName,
      externalCompositionId,
    );

    if (compositionId === null) {
      log(
        `${externalCompositionId} composition was not found in ${animationName} animation`,
      );
      setHasError(true);
      return () => cleanup();
    }

    const composition = window.AdobeAn.getComposition(compositionId);

    if (composition === undefined) {
      log(`Animation with name ${animationName} was not found`);
      setHasError(true);
      return () => cleanup();
    }

    compositionRef.current = composition;

    const {
      properties: { manifest },
    } = composition.getLibrary();

    const loader = new window.createjs.LoadQueue(false);

    loader.loadManifest(manifest);

    /* eslint-disable @typescript-eslint/no-explicit-any */
    loader.addEventListener('fileload', handleFileLoad as any);
    loader.addEventListener('complete', handleComplete as any);
    loader.addEventListener('error', handleFileError as any);
    /* eslint-enable @typescript-eslint/no-explicit-any */

    if (manifest.filter(({ type }) => type === 'image').length === 0) {
      handleComplete(null);
    }

    return () => cleanup(loader);
    // We want to rerun the Adobe Animate startup only on first render and when
    // the properties for which animation should be rendered are changed
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animationName, externalCompositionId]);

  useEffect(() => {
    if (!animationObjectRef.current) {
      return;
    }

    animationObjectRef.current.tickEnabled = !paused;
  }, [paused]);

  return {
    properties,
  };
};
