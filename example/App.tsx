import React, { useState } from 'react';
import { setFilterValue, createCIFilter, getOutputImage, createBase64 } from 'expo-image-filter';
import { useImage } from 'expo-image';
import { Button, SafeAreaView, ScrollView, Text, Image } from 'react-native';

const imageURL = "https://ik.imagekit.io/ikmedia/Graphics/AI%20Landing%20page/Text%20prompt%20in%20URL.jpg?updatedAt=1726226940145&tr=w-1000";

export default function App() {

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.container}>
        <Text style={styles.header}>Expo Image Filter</Text>
        <Image source={{ uri: imageURL }} style={styles.image} />
        <ExpoModuleComponent />
      </ScrollView>
    </SafeAreaView>
  );
}

const ExpoModuleComponent = () => {
  const [imageData, setImageData] = useState<string | null>(null);
  const image = useImage({
    uri: imageURL,
    cacheKey: "example-image",
  });

  const applyFilter = async () => {
    if (image) {
      try {
        const nativeFilter = await createCIFilter("CIColorMonochrome")
        await setFilterValue(nativeFilter, "inputImage", image)
        await setFilterValue(nativeFilter, "inputColor", "#ff00ff")
        await setFilterValue(nativeFilter, "inputIntensity", 1)
        const outputImageRes = await getOutputImage(nativeFilter, true)
        const base64Image = await createBase64(outputImageRes)
        setImageData(base64Image)
      } catch (error) {
        console.error("Error applying filter:", error);
      }
    }

  }

  return <>
    <Button
      title="Native Filter"
      onPress={async () => {
        await applyFilter();
      }}
    />
    {imageData ? <Image source={{ uri: `data:image/png;base64,${imageData}` }} style={styles.image} /> : <></>}
  </>
}

const styles = {
  header: {
    fontSize: 30,
    margin: 20,
  },
  container: {
    flex: 1,
    backgroundColor: '#eee',
  },
  image: { width: 300, height: 300 }
};
