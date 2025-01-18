import { requireNativeView } from 'expo';
import * as React from 'react';

import { ExpoImageFilterViewProps } from './ExpoImageFilter.types';

const NativeView: React.ComponentType<ExpoImageFilterViewProps> =
  requireNativeView('ExpoImageFilter');

export default function ExpoImageFilterView(props: ExpoImageFilterViewProps) {
  return <NativeView {...props} />;
}
