import { AnimateCCError } from './AnimateCCError';

export const checkLibs = (AdobeAn: any|undefined, CreateJs: any|undefined) => {
  if (AdobeAn === undefined) {
    throw new AnimateCCError('AdobeAn dependency not found');
  }

  if (CreateJs === undefined) {
    throw new AnimateCCError('createjs dependency not found');
  }
};
