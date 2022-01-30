import React, { useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  Image,
} from "react-native";
import { Camera } from "expo-camera";

import colors from "../config/colors";
import Icon from "../components/Icon";
import { StackActions } from "@react-navigation/native";
import StoryService from "../services/StoryService";
import UserContext from "../UserContext";
import * as ImageManipulator from "expo-image-manipulator";
import { storiesAction } from "../redux/stories";
import store from "../redux/store";
import { useImagePicker } from "../hooks";
import * as ImagePicker from "expo-image-picker";
import CameraHeader from "../components/headers/CameraHeader";
import CameraBottomActions from "../components/CameraBottomActions";

export default function AddStoryScreen({ navigation }) {
  let cameraRef;

  const [storyPhoto, setstoryPhoto] = useState({});
  const [mode, setMode] = useState("capture");
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [isUploading, setIsUploading] = useState(false);
  const [cameraImg, setCameraImg] = useState(false);
  // let cameraImg = false;
  // const { file, pickImage, clearFile } = useImagePicker();

  const {
    user: loggedInUser,
    setloadingIndicator,
    loadingIndicator,
  } = useContext(UserContext);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const imagePickHandler = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.5,
      });
      setstoryPhoto(result);
      setCameraImg(false);
      setMode("view");
      if (!result.uri) {
        return;
      }
    } catch (error) {
      console.log("Error reading an image", error);
    }
  };

  async function captureImage() {
    let editedResult;
    let photo = await cameraRef.takePictureAsync({
      skipProcessing: true,
    });
    setCameraImg(true);
    console.log("Captured photo: ", photo.uri);
    try {
      editedResult = await ImageManipulator.manipulateAsync(
        photo.uri,
        [{ resize: { width: 960 } }],
        { compress: 0.5 }
      );
    } catch (error) {
      console.log("Edited error: ", error);
    }
    // console.log("cameraimg: ", cameraImg);
    setMode("view");
    setstoryPhoto(editedResult);
  }

  const addStoryHandler = async () => {
    setIsUploading(true);
    if (isUploading) {
      return;
    }
    let storyData = new FormData();

    storyData.append("stryfiles", {
      name: "stryfiles",
      type: "image/jpg",
      uri: storyPhoto.uri,
    });

    StoryService.addStory(loggedInUser.id, storyData)
      .then((resp) => {
        console.log("Story add resp: ", resp.data);
        store.dispatch(storiesAction.addNewStory(resp.data));
        navigation.popToTop();
      })
      .catch((error) => {
        console.log("Error occurred while posting story");
        setIsUploading(false);
      });
  };

  const handelCloseCamera = () => {
    const popAction = StackActions.pop(1);
    navigation.dispatch(popAction);
  };

  const handelRevertCamera = () => {
    setType(
      type === Camera.Constants.Type.back
        ? Camera.Constants.Type.front
        : Camera.Constants.Type.back
    );
  };

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  return (
    <View style={styles.container}>
      {mode === "capture" ? (
        <View>
          <Camera
            ratio={"16:9"}
            ref={(ref) => {
              cameraRef = ref;
            }}
            style={styles.camera}
            type={type}
          >
            <CameraHeader title="Story" onClosePress={handelCloseCamera} />

            <CameraBottomActions
              onPickFile={imagePickHandler}
              onCapture={captureImage}
              onRevertCamera={handelRevertCamera}
            />
          </Camera>
        </View>
      ) : (
        <View style={styles.storyImgViewer}>
          <CameraHeader title="Story" onClosePress={() => setMode("capture")} />
          <Image
            source={storyPhoto}
            resizeMode={cameraImg ? "cover" : "contain"}
            style={{ height: "100%", width: "100%" }}
          />
          <TouchableOpacity
            style={styles.forwardArrow}
            onPress={addStoryHandler}
          >
            <Icon type={"AntDesign"} name={"arrowright"} size={64} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    height: Dimensions.get("screen").height,
    width: Dimensions.get("screen").width,
  },
  storyImgViewer: {
    flex: 1,
  },
  forwardArrow: {
    position: "absolute",
    bottom: 50,
    right: 50,
  },
  title: {
    fontSize: 32,
    fontWeight: "500",
    color: colors.white,
  },
});
