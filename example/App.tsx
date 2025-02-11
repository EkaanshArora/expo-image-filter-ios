import React, { useState } from 'react';
import { setFilterValue, createCIFilter, getOutputImage, createBase64FromImage } from 'expo-image-filter';
import { useImage } from 'expo-image';
import { Button, SafeAreaView, ScrollView, Text, Image } from 'react-native';

const imageURL = "";

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
  });

  const applyFilter = async () => {
    if (image) {
      try {
        const nativeFilter = await createCIFilter("CIColorMonochrome")
        await setFilterValue(nativeFilter, "inputImage", image)
        await setFilterValue(nativeFilter, "inputColor", "#ff00ff")
        await setFilterValue(nativeFilter, "inputIntensity", 1)
        const outputImageRes = getOutputImage(nativeFilter, true)
        const base64Image = await createBase64FromImage(outputImageRes)
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
