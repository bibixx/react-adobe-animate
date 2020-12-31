import type createjs from 'createjs-module';

type Stage = typeof createjs.Stage;

export type Properties = {
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
  ssMetadata?: Array<Metadata | undefined>
} & {
  [id: string]: typeof createjs.DisplayObject
};

export type Composition = {
  getLibrary: () => Library,
  getSpriteSheet: () => Record<string, createjs.SpriteSheet>,
  getImages: () => any
};

export interface An {
  compositions: {
    [id: string]: Composition
  };
  getComposition: (id: string) => Composition | undefined
  compositionLoaded: (id: string) => void
}
