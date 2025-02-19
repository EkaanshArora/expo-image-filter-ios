# expo-image-filter
[![](https://img.shields.io/badge/expo_image_filter-a?logo=npm)](https://www.npmjs.com/package/expo-image-filter)

> Note: This module is still under development. Appreaciate any feedback or contributions!  
> iOS only for now

Apply filters to images in React Native. Works with `expo-image`, uses the native shared image object for blazingly fast performance. Read the [docs](https://ekaansharora.github.io/expo-image-filter-ios/).
## Installation

```bash
$ npx expo install expo-image-filter
$ npx pod-install
```

## Usage

```tsx
import { useImage } from "expo-image";
import {
  createCIFilter,
  setFilterValue,
  getOutputImage,
  createBase64,
} from "expo-image-filter";

function App() {
  const [imageData, setImageData] = useState<string>();
  const inputImage = useImage({ uri: uri });

  const func = async () => {
    if (inputImage) {
      const nativeFilter = await createCIFilter("CISepiaTone");
      await setFilterValue(nativeFilter, "inputImage", image);
      await setFilterValue(nativeFilter, "inputIntensity", 1);
      const outputImageRes = getOutputImage(nativeFilter, true);
      const base64Image = await createBase64FromImage(outputImageRes);
      setImageData(base64Image);
    }
  };

  return imageData ? (
    <Image
      source={{ uri: `data:image/png;base64,${imageData}` }}
      style={{ width: 100, height: 100 }}
    />
  ) : (
    <></>
  );
}
```

## Todo / Need help with:

- [ ] Make result of `getOutputImage` compatible with `<ExpoImage source={}>`
- [ ] Make result of `getOutputImage` be acceptable as `setImageValue` for filter chaining
