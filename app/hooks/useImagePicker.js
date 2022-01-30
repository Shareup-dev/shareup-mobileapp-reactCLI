import { useState } from "react";
import * as ImagePicker from "expo-image-picker";

export default useImagesPicker = () => {
  // const [imageUri, setImageUri] = useState("");
  const [file, setFile] = useState({});

  const pickImage = async () => {
    // get permission
    const { granted } = await ImagePicker.requestCameraPermissionsAsync();
    if (!granted) alert("You need to enable permission to access the library");

    // select an image
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        allowsMultipleSelection: true,
        quality: 0.5,
      });
      // setImageUri(result.uri);
      setFile(result);
      console.log("Selected image in image picker: ", result);
      return result;
    } catch (error) {
      console.log("Error reading an image", error);
    }
  };

  const clearFile = () => {
    setFile({});
  };

  return { file, pickImage, clearFile };
};
