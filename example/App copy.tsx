import ExpoImageFilter from 'expo-image-filter';
import { useImage } from 'expo-image';
import { useState } from 'react';
import { Button, SafeAreaView, Image } from 'react-native';

const { createCIFilter, setValue, outputImage, base64ImageData } = ExpoImageFilter;

export default function App() {
  const [viewImage, setViewImage] = useState<string | null>(null);
  const uri = "https://ik.imagekit.io/ikmedia/Graphics/AI%20Landing%20page/Text%20prompt%20in%20URL.jpg"
  const image = useImage({ uri: uri, cacheKey: "onload" });

  const func = async () => {
    if (image) {
      const nativeFilter = await createCIFilter("CISepiaTone")
      await setValue(nativeFilter, "0.8", "inputIntensity")
      await setValue(nativeFilter, image, "inputImage")
      const outputImageRes = await outputImage(nativeFilter)
      const base64Image = await base64ImageData(outputImageRes)
      nativeFilter.release ? nativeFilter.release() : () => { }
      outputImageRes.release ? outputImageRes.release() : () => { }
      setViewImage(base64Image)
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <Image source={{ uri: uri }} style={styles.image} />
      {viewImage ? <Image source={{ uri: `data:image/png;base64,${viewImage}` }} style={styles.image} /> : <></>}
      <Button
        title="Apply filter"
        onPress={async () => {
          await func();
        }}
      />
    </SafeAreaView>
  );
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#eee',
  },
  image: {
    width: 200,
    height: 200,
  },
};
