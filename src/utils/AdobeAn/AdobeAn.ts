import { AnimateCCError } from '../AnimateCCError';
import { An } from './types';

export const AdobeAn = (global as any).AdobeAn as An;

if (typeof window !== 'undefined' && AdobeAn === undefined) {
  throw new AnimateCCError('AdobeAn dependency not found');
}
