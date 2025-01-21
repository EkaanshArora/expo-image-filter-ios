import { useEvent } from 'expo';
import ExpoImageFilter from 'expo-image-filter';
import { launchImageLibraryAsync } from 'expo-image-picker';
import { useImage } from 'expo-image';
import { useEffect, useState } from 'react';
import { Button, SafeAreaView, ScrollView, Text, View, Image } from 'react-native';

const { createCIFilter, logSharedRef, setValue, outputImage, base64ImageData } = ExpoImageFilter;

export default function App() {
  const [imaged, setImage] = useState<string | null>(null);
  const [imaged2, setImage2] = useState<string | null>(null);
  // useEffect(() => {
  const image = useImage({
    uri: 'https://ik.imagekit.io/ikmedia/Graphics/AI%20Landing%20page/Text%20prompt%20in%20URL.jpg',
    cacheKey: "example-image",
  });

  const func = async () => {
    if (image) {
      try {
        console.log("image", image)
        const nativeFilter = await createCIFilter("CIColorMonochrome")
        console.log("nativeFilter", nativeFilter)
        await logSharedRef(nativeFilter)
        console.log("set value", await setValue(nativeFilter, image, "inputImage"))
        console.log("native filter before outputImage", nativeFilter)
        const outputImageRes = await outputImage(nativeFilter)
        console.log("outputImageRef", outputImageRes)
        if(!outputImageRes) {
          console.log("outputImage is nil")
          return
        }
        const base64Image = await base64ImageData(outputImageRes)
        console.log(base64Image)
        setImage(base64Image)
        // const base64Image = await ApplyCIFilterToImageAndReturnBase64(image, "CIColorMonochrome", [{ key: "inputImage", value: image }])
      } catch (error) {
        console.error("Error applying filter:", error);
      }
      try {
        const nativeFilter = await createCIFilter("CISepiaTone")
        await setValue(nativeFilter, "0.8", "inputIntensity")
        await setValue(nativeFilter, image, "inputImage")
        const outputImageRes = await outputImage(nativeFilter)
        const base64Image = await base64ImageData(outputImageRes)
        setImage2(base64Image)
      } catch (error) {
        console.error("Error applying filter:", error);
      }
    }

  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.container}>
        <Text style={styles.header}>Module Example</Text>
        <Image source={{ uri: 'https://ik.imagekit.io/ikmedia/Graphics/AI%20Landing%20page/Text%20prompt%20in%20URL.jpg' }} style={{ width: 200, height: 200 }} />
        {imaged ? <Image source={{ uri: `data:image/png;base64,${imaged}` }} style={{ width: 200, height: 200 }} /> : <></>}
        {imaged2 ? <Image source={{ uri: `data:image/png;base64,${imaged2}` }} style={{ width: 200, height: 200 }} /> : <></>}
        {imaged ? <Text>{imaged.length}</Text> : <></>}
        <Button
            title="Set value"
            onPress={async () => {
              await func();
            }}
          />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = {
  header: {
    fontSize: 30,
    margin: 20,
  },
  groupHeader: {
    fontSize: 20,
    marginBottom: 20,
  },
  group: {
    margin: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
  },
  container: {
    flex: 1,
    backgroundColor: '#eee',
  },
  view: {
    flex: 1,
    height: 200,
  },
};
