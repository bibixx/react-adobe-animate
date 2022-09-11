import { Properties } from 'types/AdobeAn';

export const getCanvasSize = (properties: Properties | undefined) => {
  if (typeof window === 'undefined') {
    return {
      width: 0,
      height: 0,
    };
  }

  const width = properties?.width ?? 0;
  const height = properties?.height ?? 0;
  const pRatio = window.devicePixelRatio ?? 1;

  return {
    width: width * pRatio,
    height: height * pRatio,
  };
};
