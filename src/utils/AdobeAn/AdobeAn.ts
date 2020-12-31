import { AnimateCCError } from '../AnimateCCError';
import { An } from './types';

export const AdobeAn = (window as any).AdobeAn as An;

if (AdobeAn === undefined) {
  throw new AnimateCCError('AdobeAn dependency not found');
}
