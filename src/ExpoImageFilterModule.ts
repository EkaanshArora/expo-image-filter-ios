import { NativeModule, requireNativeModule } from 'expo';
import { DictVals, ExpoImageFilterModuleEvents } from './ExpoImageFilter.types';
import { SharedRef } from 'expo-modules-core/types';

declare class ExpoImageFilterModule extends NativeModule<ExpoImageFilterModuleEvents> {
  createCIFilter(filter: string): Promise<SharedRef<'CIFilter'>>;
  logSharedRef(FilterRef: SharedRef<'CIFilter'>): Promise<boolean>;
  setValue(FilterRef: SharedRef<'CIFilter'>, value: DictVals, forKey: string): Promise<boolean>;
  setValueImage(FilterRef: SharedRef<'CIFilter'>, value: SharedRef<'image'>, forKey: string): Promise<boolean>;
  getOutputImage(FilterRef: SharedRef<'CIFilter'>, cropToInputImage?: boolean): Promise<SharedRef<'UIImageOutput'>>;
  createBase64(Image: SharedRef<'UIImageOutput'>): Promise<string>;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<ExpoImageFilterModule>('ExpoImageFilter');
