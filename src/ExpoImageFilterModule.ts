import { useReleasingSharedObject } from 'expo-modules-core';
import { NativeModule, requireNativeModule } from 'expo';

import { DictVals, ExpoImageFilterModuleEvents } from './ExpoImageFilter.types';
import { SharedRef } from 'expo-modules-core/types';

declare class ExpoImageFilterModule extends NativeModule<ExpoImageFilterModuleEvents> {
  ApplyCIFilterToImageAndReturnBase64(
    image: SharedRef<'image'>,
    filterName: string,
    filterValues: Array<{ key: string, value: string | SharedRef<'image'> }>
  ): Promise<string>;
  createCIFilter(filter: string): Promise<SharedRef<'CIFilter'>>;
  logSharedRef(FilterRef: SharedRef<'CIFilter'>): Promise<boolean>;
  setValue(FilterRef: SharedRef<'CIFilter'>, value: DictVals, forKey: string): Promise<boolean>;
  setValueImage(FilterRef: SharedRef<'CIFilter'>, value: SharedRef<'image'>, forKey: string): Promise<boolean>;
  outputImage(FilterRef: SharedRef<'CIFilter'>, cropToInputImage?: boolean): Promise<SharedRef<'UIImageOutput'>>;
  base64ImageData(Image: SharedRef<'UIImageOutput'>): Promise<string>;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<ExpoImageFilterModule>('ExpoImageFilter');
