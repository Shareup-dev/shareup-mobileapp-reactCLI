import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
} from "react-native";

import Icon from "../components/Icon";
import colors from "../config/colors";
import fileStorage from "../config/fileStorage";

const StoryViewScreen = ({ navigation, route }) => {
  const borderLineRef = useRef();

  useEffect(() => {
    let storyWidth = 0;
    let maxStoryWidth = Dimensions.get("window").width;
    let storyIntervalId = setInterval(() => {
      storyWidth += 2;
      if (storyWidth >= maxStoryWidth) navigation.popToTop();

      borderLineRef?.current?.setNativeProps({
        style: {
          width: storyWidth,
        },
      });
    }, 20);

    return () => {
      storyWidth = 0;
      clearInterval(storyIntervalId);
    };
  }, []);

  return (
    <View>
      <ImageBackground
        style={{ width: "100%", height: "100%" }}
        source={{ uri: fileStorage.baseUrl + route.params.image }}
      >
        <View ref={borderLineRef} style={[styles.borderLine]}></View>

        <View style={styles.profileImg}>
          <Image
            source={require("../assets/icons/user-icon.png")}
            resizeMode={"center"}
            style={styles.userProfileImg}
          />
        </View>
        <Text style={styles.userName}>{route.params.userName}</Text>
        <TouchableOpacity
          style={styles.closeIcon}
          onPress={() => navigation.popToTop()}
        >
          <Icon
            name={"close"}
            type={"AntDesign"}
            size={54}
            backgroundColor={"unset"}
            noBackground={true}
          />
        </TouchableOpacity>
      </ImageBackground>
    </View>
  );
};

export default StoryViewScreen;

const styles = StyleSheet.create({
  borderLine: {
    borderBottomWidth: 5,
    borderColor: colors.grayX11Gray,
    position: "absolute",
    top: 50,
    zIndex: 1,
    width: "10%",
  },
  profileImg: {
    width: 56,
    height: 56,
    top: 64,
    left: 20,
    borderWidth: 2,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.grayX11Gray,
    borderColor: colors.mediumGray,
  },
  userProfileImg: {
    width: 32,
    height: 32,
  },
  userName: {
    color: colors.white,
    left: 80,
    top: 20,
    fontSize: 18,
  },
  closeIcon: {
    position: "absolute",
    right: 0,
    top: 56,
  },
});
