import { NativeModule, requireNativeModule } from 'expo';

import { ExpoImageFilterModuleEvents } from './ExpoImageFilter.types';

declare class ExpoImageFilterModule extends NativeModule<ExpoImageFilterModuleEvents> {
  PI: number;
  hello(): string;
  setValueAsync(value: string): Promise<void>;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<ExpoImageFilterModule>('ExpoImageFilter');
