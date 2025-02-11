# expo-image-filter

Apply filters to images in React Native (iOS only, for now). Works with `expo-image`, uses the native shared image object for blazingly fast performance.

## Installation

```bash
$ npx expo install expo-image-filter
$ npx pod-install
```

## Usage

```tsx
import { useImage } from 'expo-image';
import { createCIFilter, setFilterValue, getOutputImage, createBase64 } from 'expo-image-filter';
function App() {
  const [viewImage, setViewImage] = useState<string>();
  const inputImage = useImage({ uri: uri });

  const func = async () => {
    if (inputImage) {
      const filter = await createCIFilter("CISepiaTone")
      await setFilterValue(filter, "0.8", "inputIntensity")
      await setFilterValue(filter, image, "inputImage")
      const imageRef = await getOutputImage(nativeFilter)
      const base64Image = await createBase64(outputImageRes)
      setViewImage(base64Image)
    }
  }
```
