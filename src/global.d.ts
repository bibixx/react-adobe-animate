import type CreateJS from 'createjs-module';
import { An } from 'types/AdobeAn';

declare global {
  interface Window {
    AdobeAn: An;
    createjs: typeof CreateJS;
  }
}
