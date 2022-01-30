import { useState } from "react";
import * as ImagePicker from "expo-image-picker";

export default useImagePicker = () => {
  // const [imageUri, setImageUri] = useState("");
  const [files, setFiles] = useState([]);

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
      setFiles(...files, result.url);
    } catch (error) {
      console.log("Error reading an image", error);
    }
  };

  const clearFiles = () => {
    setFiles([]);
  };

  return { files, pickImage, clearFiles };
};
