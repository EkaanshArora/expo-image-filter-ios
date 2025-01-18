import * as React from 'react';

import { ExpoImageFilterViewProps } from './ExpoImageFilter.types';

export default function ExpoImageFilterView(props: ExpoImageFilterViewProps) {
  return (
    <div>
      <iframe
        style={{ flex: 1 }}
        src={props.url}
        onLoad={() => props.onLoad({ nativeEvent: { url: props.url } })}
      />
    </div>
  );
}
