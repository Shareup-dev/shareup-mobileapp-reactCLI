import React, { useState, useEffect, useContext, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  Image,
  ActivityIndicator,
} from "react-native";
import { Camera } from "expo-camera";
import { FontAwesome } from "@expo/vector-icons";
import { StackActions } from "@react-navigation/native";
import * as ImageManipulator from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";
import { Video, AVPlaybackStatus } from "expo-av";
import * as VideoThumbnails from "expo-video-thumbnails";

import defaultStyles from "../config/styles";
import colors from "../config/colors";
import Icon from "../components/Icon";
import UserContext from "../UserContext";
import { storiesAction } from "../redux/stories";
import store from "../redux/store";
import { useImagePicker } from "../hooks";
import ReelService from "../services/ReelService";
import CameraHeader from "../components/headers/CameraHeader";
import CameraBottomActions from "../components/CameraBottomActions";

export default function AddNewReel({ navigation }) {
  let cameraRef;
  const [reelPhoto, setreelPhoto] = useState({});
  const [mode, setMode] = useState("capture");
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [isUploading, setIsUploading] = useState(false);
  const [cameraImg, setCameraImg] = useState(false);
  const video = React.useRef(null);
  let thumbnail;
  let loadingBarRef = useRef();
  const imagePickHandler = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        // quality: 0.1,
        videoQuality: 0.1,
      });
      setreelPhoto(result);
      setCameraImg(false);
      setMode("view");
      if (!result.uri) {
        return;
      }
      console.log("result: ", result);
      // video.current.presentFullscreenPlayer();
    } catch (error) {
      console.log("Error reading an image", error);
    }
  };

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
    setMode("view");
    setreelPhoto(editedResult);
  }
  const addreelHandler = async () => {
    setIsUploading(true);
    video.current.pauseAsync();
    if (isUploading) {
      return;
    }
    try {
      thumbnail = await VideoThumbnails.getThumbnailAsync(reelPhoto.uri, {
        time: 15000,
      });
    } catch (e) {
      console.warn("Error occurred while generating thumbnail: ", e);
    }
    let reelData = new FormData();

    reelData.append("reelfiles", {
      name: "reelFiles",
      type: "video/mp4",
      uri: reelPhoto.uri,
    });
    reelData.append("thumbnail", {
      name: "thumbnail",
      type: "image/jpg",
      uri: thumbnail.uri,
    });
    reelData.append("content", "Sample caption");
    // let progress = 0;
    // let progressInterval = setInterval(() => {
    //   progress += 2;
    //   loadingBarRef?.current?.setNativeProps({
    //     style: {
    //       left: progress + "%",
    //     },
    //   });
    //   if (progress > 80) {
    //     progress = 0;
    //   }
    // }, 30);
    ReelService.addReel(loggedInUser.id, reelData)
      .then((resp) => {
        console.log("reel add resp: ", resp.data);
        setIsUploading(false);
        navigation.popToTop();
      })
      .catch((error) => {
        console.log("Error occurred while posting reel");
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
      <View>
        {isUploading && (
          <View
            style={{
              flex: 1,
              height: Dimensions.get("screen").height,
              width: Dimensions.get("screen").width,
              zIndex: 2,
              position: "absolute",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View
              style={{
                backgroundColor: "white",
                borderRadius: 30,
                width: 220,
                paddingVertical: 2,
                paddingHorizontal: 20,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                // paddingBottom: 5,
              }}
            >
              <View
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{ fontSize: 16, marginBottom: 5, marginRight: 10 }}
                >
                  Processing Reel...
                  <ActivityIndicator size="small" color={colors.iondigoDye} />
                </Text>
              </View>
            </View>
          </View>
        )}
      </View>
      <View
        style={{
          flex: 1,
          opacity: isUploading ? 0.3 : 1,
          backgroundColor: isUploading ? "black" : null,
        }}
      >
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
              <CameraHeader title="Reels" onClosePress={handelCloseCamera} />

              <CameraBottomActions
                onPickFile={imagePickHandler}
                onCapture={captureImage}
                onRevertCamera={handelRevertCamera}
              />
            </Camera>
          </View>
        ) : (
          <View style={styles.reelImgViewer}>
            <CameraHeader
              title="Reels"
              onClosePress={() => setMode("capture")}
            />
            <Video
              ref={video}
              onReadyForDisplay={() => {
                setTimeout(() => {
                  video.current.playAsync();
                  video.current.setNativeProps({
                    useNativeControls: true,
                  });
                }, 200);
              }}
              useNativeControls={true}
              source={reelPhoto}
              resizeMode={cameraImg ? "cover" : "contain"}
              style={{
                height: "100%",
                width: "100%",
              }}
            />

            <TouchableOpacity
              style={styles.forwardArrow}
              onPress={addreelHandler}
            >
              <Icon type={"AntDesign"} name={"arrowright"} size={64} />
            </TouchableOpacity>
          </View>
        )}
      </View>
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
  captureButton: {
    height: 86,
    width: 86,
    backgroundColor: colors.white,
    position: "absolute",
    bottom: 150,
    left: Dimensions.get("screen").width / 2 - 43,
    borderRadius: 60,
    borderWidth: 5,
    borderColor: colors.LightGray,
  },
  reelImgViewer: {
    flex: 1,
  },
  forwardArrow: {
    position: "absolute",
    bottom: 50,
    right: 50,
  },
  reverseIcon: {
    height: 86,
    width: 86,
    position: "absolute",
    bottom: 100,
    right: 40,
    zIndex: 1,
    borderRadius: 60,
  },
  fileOpenerIcon: {
    right: null,
    left: 50,
  },
});
