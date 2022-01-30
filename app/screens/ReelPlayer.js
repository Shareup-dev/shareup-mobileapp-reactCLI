import React, { useState } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { Video } from "expo-av";

import Screen from "../components/Screen";
import fileStorage from "../config/fileStorage";
import colors from "../config/colors";

const ReelPlayer = ({ route }) => {
  const reelVideo = route.params.reel.reelMedia[0].mediaPath;
  const videoRef = React.useRef(null);

  const [activityIndicator, setActivityIndicator] = useState(true);

  console.log("video", fileStorage.baseUrl + reelVideo);

  return (
    <Screen>
      <View>
        {activityIndicator && (
          <ActivityIndicator
            size="large"
            color={colors.iondigoDye}
            style={styles.activityIndicator}
          />
        )}
        <Video
          onReadyForDisplay={() => {
            videoRef.current.playAsync();
            setActivityIndicator(false);
          }}
          onLoad={() => {}}
          ref={videoRef}
          useNativeControls={true}
          source={{
            uri: fileStorage.baseUrl + reelVideo,
          }}
          resizeMode={"contain"}
          style={{ height: "100%", width: "100%", backgroundColor: "black" }}
          // shouldRasterizeIOS={true}
        />
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  activityIndicator: {
    position: "absolute",
    zIndex: 2,
    top: "50%",
    bottom: "50%",
    left: "50%",
    right: "50%",
  },
});

export default ReelPlayer;
