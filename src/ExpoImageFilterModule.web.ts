import { registerWebModule, NativeModule } from 'expo';
import type { SharedRef } from 'expo-modules-core/types';

import type { DictVals, ExpoImageFilterModuleEvents } from './ExpoImageFilter.types';

class ExpoImageFilterModule extends NativeModule<ExpoImageFilterModuleEvents> {
  createCIFilter(filter: string): Promise<string> {
    return Promise.resolve("not implemented")
  }
  setFilterValue(FilterRef: SharedRef<'CIFilter'>, value: DictVals, forKey: string): Promise<string> {
    return Promise.resolve("not implemented")
  }
  getOutputImage(FilterRef: SharedRef<'CIFilter'>): Promise<string> {
    return Promise.resolve("not implemented")
  }
  createBase64FromImage(Image: SharedRef<'UIImageOutput'>): Promise<string> {
    return Promise.resolve("not implemented")
  }
  createImageFromBase64(base64: string): Promise<string> {
    return Promise.resolve("not implemented")
  }
}

export default registerWebModule(ExpoImageFilterModule);
