import type createjs from 'createjs-module';
import { AnimateCCError } from '../AnimateCCError';

export const CreateJS = global.createjs as typeof createjs;

if (typeof window !== 'undefined' && CreateJS === undefined) {
  throw new AnimateCCError('createjs dependency not found');
}
