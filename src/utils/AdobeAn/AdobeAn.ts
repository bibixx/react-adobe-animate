import createjs from "createjs-module";

export interface LibraryProperties {
  id: string,
  width: number,
  height: number,
  fps: number,
  color: string,
  opacity: number,
  manifest: any[],
  preloads: any[]
}

export interface Library {
  properties: LibraryProperties

  [key: string]: any
}

export interface SpriteSheets {
  [key: string]: createjs.SpriteSheet
}

export interface Composition {
  getImages: () => HTMLImageElement[]
  getStage: () => any
  getSpriteSheet: () => SpriteSheets
  getLibrary: () => Library
}

export interface IAdobeAn {
  getComposition: (compositionId: string) => Composition;
  compositionLoaded: (id: string) => void;
  compositions: {
    [compositionId: string]: Composition
  }
}


const { AdobeAn }: { AdobeAn: IAdobeAn } = (window as any);

if (AdobeAn === undefined) {
  throw new Error("AdobeAn dependency not found");
}

export default AdobeAn;
