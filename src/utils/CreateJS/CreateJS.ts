import type createjs from 'createjs-module';
import { AnimateCCError } from '../AnimateCCError';

export const CreateJS = window.createjs as typeof createjs;

if (CreateJS === undefined) {
  throw new AnimateCCError('createjs dependency not found');
}
