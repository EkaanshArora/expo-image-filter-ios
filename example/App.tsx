import React, { useState } from 'react';
import { inferTypeAndSetValue, createCIFilter, outputImage, base64ImageData } from 'expo-image-filter';
import { useImage } from 'expo-image';
import { Button, SafeAreaView, ScrollView, Text, Image } from 'react-native';
const imageURL = "https://ik.imagekit.io/ikmedia/Graphics/AI%20Landing%20page/Text%20prompt%20in%20URL.jpg?updatedAt=1726226940145&tr=w-1000";

export default function App() {

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.container}>
        <Text style={styles.header}>Module Example</Text>
        <Image source={{ uri: imageURL }} style={styles.image} />
        <ExpoModuleComponent />
      </ScrollView>
    </SafeAreaView>
  );
}

const ExpoModuleComponent = () => {
  const [imaged2, setImage2] = useState<string | null>(null);
  const image = useImage({
    uri: imageURL,
    cacheKey: "example-image",
  });

  const applyFilter = async () => {
    if (image) {
      try {
        const nativeFilter = await createCIFilter("CIZoomBlur")
        await inferTypeAndSetValue(nativeFilter, "inputImage", image)
        await inferTypeAndSetValue(nativeFilter, "inputCenter", { x: 100, y: 100 })
        await inferTypeAndSetValue(nativeFilter, "inputAmount", 10)
        const outputImageRes = await outputImage(nativeFilter)
        const base64Image = await base64ImageData(outputImageRes)
        setImage2(base64Image)
      } catch (error) {
        console.error("Error applying filter:", error);
      }
    }

  }

  return <>
    <Button
      title="Native Swift"
      onPress={async () => {
        await applyFilter();
      }}
    />
    {imaged2 ? <Image source={{ uri: `data:image/jpg;base64,${imaged2}` }} style={styles.image} /> : <></>}
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
