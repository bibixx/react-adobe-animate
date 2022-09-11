import type CreateJS from 'createjs-module';
import { An } from 'src/types/AdobeAn';

declare global {
	interface Window {
		AdobeAn: An;
    createjs: typeof CreateJS;
	}
}
