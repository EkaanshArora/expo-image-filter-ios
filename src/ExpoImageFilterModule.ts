import { NativeModule, requireNativeModule } from 'expo';
import type { DictVals, ExpoImageFilterModuleEvents } from './ExpoImageFilter.types';
import type { SharedRef } from 'expo-modules-core/types';

declare class ExpoImageFilterModule extends NativeModule<ExpoImageFilterModuleEvents> {
  createCIFilter(filterName: string): Promise<SharedRef<'CIFilter'>>;
  logSharedFilterRef(FilterRef: SharedRef<'CIFilter'>): Promise<boolean>;
  setValue(FilterRef: SharedRef<'CIFilter'>, value: DictVals, forKey: string): Promise<boolean>;
  setValueImage(FilterRef: SharedRef<'CIFilter'>, value: SharedRef<'image'>, forKey: string): Promise<boolean>;
  getOutputImage(FilterRef: SharedRef<'CIFilter'>, cropToInputImage?: boolean): Promise<SharedRef<'UIImageOutput'>>;
  createBase64(outputImage: SharedRef<'UIImageOutput'>): Promise<string>;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<ExpoImageFilterModule>('ExpoImageFilter');
