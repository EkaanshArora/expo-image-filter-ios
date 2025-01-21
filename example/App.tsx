import { useEvent } from 'expo';
import ExpoImageFilter from 'expo-image-filter';
import { launchImageLibraryAsync } from 'expo-image-picker';
import { useImage } from 'expo-image';
import { useEffect, useState } from 'react';
import { Button, SafeAreaView, ScrollView, Text, View, Image } from 'react-native';

export default function App() {
  const [imaged, setImage] = useState<string | null>(null);
  // useEffect(() => {
  const image = useImage({
    uri: 'https://picsum.photos/200/300',
    cacheKey: new Date().getTime().toString(),
  });

  const func = async () => {
    if (image) {
      try {
        //   const filteredImage = await ExpoImageFilter.applyFilter(image, 'CIColorMonochrome');
        //   if (filteredImage) {
        //     console.log(filteredImage);
        //     setImage(filteredImage[1]);
        //   } else {
        //     console.error("Filtered image is null");
        //   }
        // } catch (error) {
        //   console.error("Error applying filter:", error);
        // }
        console.log("image", image)
        const nativeFilter = await ExpoImageFilter.createCIFilter("CIColorMonochrome")
        console.log("nativeFilter", nativeFilter)
        await ExpoImageFilter.logSharedRef(nativeFilter)
        console.log("logged")
        await ExpoImageFilter.setValue(nativeFilter, image, "kCIInputImageKey")
        console.log("nativeFilter", nativeFilter)
        const outputImage = await ExpoImageFilter.outputImage(nativeFilter)
        console.log(outputImage)
        const base64Image = await ExpoImageFilter.base64ImageData(outputImage)
        console.log(base64Image)
        setImage(base64Image)
        // const base64Image = await ExpoImageFilter.ApplyCIFilterToImageAndReturnBase64(image, "CIColorMonochrome", [{ key: "inputImage", value: image }])
      } catch (error) {
        console.error("Error applying filter:", error);
      }
    }

  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.container}>
        <Text style={styles.header}>Module API Example</Text>
        <Image source={{ uri: 'https://picsum.photos/200/300' }} style={{ width: 200, height: 200 }} />
        {imaged ? <Image source={{ uri: `data:image/png;base64,${imaged}` }} style={{ width: 200, height: 200 }} /> : <></>}
        {imaged ? <Text>{imaged.length}</Text> : <></>}
        <Group name="Constants">
          <Text>{ExpoImageFilter.PI}</Text>
        </Group>
        <Group name="Functions">
          <Text>{ExpoImageFilter.hello()}</Text>
        </Group>
        <Group name="Async functions">
          <Button
            title="Set value"
            onPress={async () => {
              await func();
            }}
          />
        </Group>
      </ScrollView>
    </SafeAreaView>
  );
}

function Group(props: { name: string; children: React.ReactNode }) {
  return (
    <View style={styles.group}>
      <Text style={styles.groupHeader}>{props.name}</Text>
      {props.children}
    </View>
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
