import React, { useState } from 'react';
import { inferTypeAndSetValue, createCIFilter, outputImage, base64ImageData, ApplyCIFilterToImageAndReturnBase64 } from 'expo-image-filter';
import { useImage } from 'expo-image';
import { Button, SafeAreaView, ScrollView, Text, Image } from 'react-native';
const imageURL = "https://ik.imagekit.io/ikmedia/Graphics/AI%20Landing%20page/Text%20prompt%20in%20URL.jpg?updatedAt=1726226940145&tr=w-10";

export default function App() {
  const [imaged2, setImage2] = useState<string | null>(null);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.container}>
        <Text style={styles.header}>Module Example</Text>
        <Image source={{ uri: imageURL }} style={{ width: 200, height: 200 }} />
        <ExpoModuleComponent />
        <RNImageFilter />
        {imaged2 && (
          <Image
            source={{ uri: `data:image/jpeg;base64,${imaged2}` }}
            style={{ width: 200, height: 200, marginTop: 20 }}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const RNImageFilter = () => {
  const [imaged2, setImage2] = useState<string | null>(null);
  const image = useImage({
    uri: imageURL,
    cacheKey: "example-image",
  });
  return <></>
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
        const nativeFilter = await createCIFilter("CIColorMonochrome")
        await inferTypeAndSetValue(nativeFilter, "inputIntensity", 1)
        await inferTypeAndSetValue(nativeFilter, "inputColor", "#ff00ffff")
        await inferTypeAndSetValue(nativeFilter, "inputImage", image)
        const outputImageRes = await outputImage(nativeFilter)
        const base64Image = await base64ImageData(outputImageRes)
        console.log("base64Image", base64Image)
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
    {imaged2 ? <Image source={{ uri: `data:image/jpg;base64,${imaged2}` }} style={{ width: 200, height: 200 }} /> : <></>}
  </>
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
