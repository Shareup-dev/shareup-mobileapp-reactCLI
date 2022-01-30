import React from "react";
import { View, StyleSheet, Text, Image, TouchableOpacity } from "react-native";

import Icon from "../Icon";
import colors from "../../config/colors";
import routes from "../../navigation/routes";

import { StackActions } from "@react-navigation/native";
import fileStorage from "../../config/fileStorage";

export default function StoryCard({ style, navigation, image, userName }) {
  const addStoryHandler = () => {
    navigation.navigate(routes.STORY_VIEW_SCREEN, {
      image,
      userName,
    });
  };
  return (
    <TouchableOpacity onPress={addStoryHandler}>
      <View style={[styles.container, style]}>
        <Image
          source={{ uri: fileStorage.baseUrl + image }}
          style={{ height: "100%", width: "100%" }}
        />
        <Text style={styles.userName}>{userName}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 100,
    height: 150,
    borderWidth: 1.5,
    borderColor: colors.lighterGray,
    borderRadius: 15,
    overflow: "hidden",
  },
  iconWrapper: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.grayX11Gray,
    height: "60%",
  },
  textWrapper: {
    justifyContent: "center",
    alignItems: "center",
    top: -8,
  },
  text: {
    fontSize: 9,
  },
  addIcon: {
    alignSelf: "center",
    top: -5,
  },
  userName: {
    fontSize: 10,
    zIndex: 2,
    position: "absolute",
    bottom: 3,
    left: 10,
    color: colors.white,
  },
});
