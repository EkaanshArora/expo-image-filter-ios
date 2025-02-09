import { registerWebModule, NativeModule } from 'expo';
import { SharedRef } from 'expo-modules-core/types';

import { DictVals, ExpoImageFilterModuleEvents } from './ExpoImageFilter.types';

class ExpoImageFilterModule extends NativeModule<ExpoImageFilterModuleEvents> {
  ApplyCIFilterToImageAndReturnBase64(
    image: SharedRef<'image'>,
    filterName: string,
    filterValues: Array<{ key: string, value: string | SharedRef<'image'> }>
  ): Promise<string> {
    return Promise.resolve("not implemented")
  }
  createCIFilter(filter: string): Promise<string> {
    return Promise.resolve("not implemented")
  }
  logSharedRef(FilterRef: SharedRef<'CIFilter'>): Promise<string> {
    return Promise.resolve("not implemented")
  }
  setValue(FilterRef: SharedRef<'CIFilter'>, value: DictVals, forKey: string): Promise<string> {
    return Promise.resolve("not implemented")
  }
  setValueImage(FilterRef: SharedRef<'CIFilter'>, value: SharedRef<'image'>, forKey: string): Promise<string> {
    return Promise.resolve("not implemented")
  }
  outputImage(FilterRef: SharedRef<'CIFilter'>): Promise<string> {
    return Promise.resolve("not implemented")
  }
  base64ImageData(Image: SharedRef<'UIImageOutput'>): Promise<string> {
    return Promise.resolve("not implemented")
  }
}

export default registerWebModule(ExpoImageFilterModule);
