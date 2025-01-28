import ExpoImageFilter from 'expo-image-filter';
import { useImage } from 'expo-image';
import { useState } from 'react';
import { Button, SafeAreaView, ScrollView, Text, Image } from 'react-native';

const { createCIFilter, setValueImage, setValue, outputImage, base64ImageData } = ExpoImageFilter;
const imageURL = "https://ik.imagekit.io/ikmedia/Graphics/AI%20Landing%20page/Text%20prompt%20in%20URL.jpg?updatedAt=1726226940145&tr=w-400";

export default function App() {

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.container}>
        <Text style={styles.header}>Module Example</Text>
        <Image source={{ uri: imageURL }} style={{ width: 200, height: 200 }} />
        <ExpoModuleComponent />
        <RNImageFilter />
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

  const applyFilter = async () => {
    if (image) {
      try {
        const response = await fetch(imageURL);
        const blob = await response.blob();
        const reader = new FileReader();

        reader.onloadend = () => {
          const base64 = reader.result as string;
          // Get the base64 data without the data URL prefix
          const base64Data = base64.split(',')[1];

          // Decode base64 to binary
          const binaryData = atob(base64Data);
          const length = binaryData.length;
          const uint8Array = new Uint8Array(length);

          // Convert binary to Uint8Array
          for (let i = 0; i < length; i++) {
            uint8Array[i] = binaryData.charCodeAt(i);
          }

          // Simple monochrome filter
          for (let i = 0; i < uint8Array.length; i += 4) {
            const avg = (uint8Array[i] + uint8Array[i + 1] + uint8Array[i + 2]) / 3;
            uint8Array[i] = avg;     // Red
            uint8Array[i + 1] = avg; // Green
            uint8Array[i + 2] = avg; // Blue
            // Keep alpha channel unchanged
          }

          // Convert back to base64 directly
          let binary = '';
          for (let i = 0; i < uint8Array.length; i++) {
            binary += String.fromCharCode(uint8Array[i]);
          }
          const finalBase64 = btoa(binary);
          console.log("finalBase64", finalBase64)
          setImage2(finalBase64);
        };

        reader.readAsDataURL(blob);
      } catch (error) {
        console.error("Error applying filter:", error);
      }
    }
  };

  return <>
    <Button
      title="Apply Filter"
      onPress={async () => {
        await applyFilter();
      }}
    />
    {imaged2 ? <Image source={{ uri: `data:image/jpeg;base64,${imaged2}` }} style={{ width: 200, height: 200 }} /> : <></>}
  </>
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
        await setValue(nativeFilter, { stringValue: "1", type: "float" }, "inputIntensity")
        // can we wrap this as: 
        // await setValue(nativeFilter, "#ff00ffff", "inputColor") and 
        // await setValue(nativeFilter, true, "inputImage")
        // we can inherit the type from the value
        await setValue(nativeFilter, { stringValue: "#ff00ffff", type: "CIColor" }, "inputColor")
        await setValueImage(nativeFilter, image, "inputImage")
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
    {imaged2 ? <Image source={{ uri: `data:image/png;base64,${imaged2}` }} style={{ width: 200, height: 200 }} /> : <></>}
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
