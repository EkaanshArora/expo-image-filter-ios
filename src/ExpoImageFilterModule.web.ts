import { registerWebModule, NativeModule } from 'expo';

import { ExpoImageFilterModuleEvents } from './ExpoImageFilter.types';

class ExpoImageFilterModule extends NativeModule<ExpoImageFilterModuleEvents> {
  PI = Math.PI;
  async setValueAsync(value: string): Promise<void> {
    this.emit('onChange', { value });
  }
  hello() {
    return 'Hello world! 👋';
  }
}

export default registerWebModule(ExpoImageFilterModule);
