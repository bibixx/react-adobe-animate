import { Properties } from 'src/types/AdobeAn';

export const getCanvasSize = (properties: Properties | undefined) => {
  const width = properties?.width ?? 0;
  const height = properties?.height ?? 0;
  const pRatio = window.devicePixelRatio;

  return {
    width: width * pRatio,
    height: height * pRatio,
  };
};
