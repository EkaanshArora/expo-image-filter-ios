import { useReleasingSharedObject } from 'expo-modules-core';
import { NativeModule, requireNativeModule } from 'expo';

import { ExpoImageFilterModuleEvents } from './ExpoImageFilter.types';
import { SharedRef } from 'expo-modules-core/types';
declare class ExpoImageFilterModule extends NativeModule<ExpoImageFilterModuleEvents> {
  // PI: number;
  // hello(): string;
  // setValueAsync(value: string): Promise<void>;
  ApplyCIFilterToImageAndReturnBase64(
    image: SharedRef<'image'>,
    filterName: string,
    filterValues: [{ key: string, value: string | SharedRef<'image'> }]
  ): Promise<string>;
  // applyFilter(image: SharedRef<'image'>, filter: string): Promise<[SharedRef<'image'>, string]>;
  createCIFilter(filter: string): Promise<SharedRef<'CIFilter'>>;
  logSharedRef(FilterRef: SharedRef<'CIFilter'>): Promise<boolean>;
  setValue(FilterRef: SharedRef<'CIFilter'>, value: string | SharedRef<'image'>, forKey: string): Promise<boolean>;
  outputImage(FilterRef: SharedRef<'CIFilter'>): Promise<SharedRef<'UIImageOutput'>>;
  base64ImageData(Image: SharedRef<'UIImageOutput'>): Promise<string>;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<ExpoImageFilterModule>('ExpoImageFilter');
