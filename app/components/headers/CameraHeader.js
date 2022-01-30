import React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import Constants from "expo-constants";

import colors from "../../config/colors";

export default function CameraHeader({ title, style, onClosePress }) {
  return (
    <View
      style={[
        styles.container,
        { paddingTop: Constants.statusBarHeight },
        style,
      ]}
    >
      <Text style={styles.title}>{title}</Text>
      <TouchableOpacity onPress={onClosePress}>
        <AntDesign
          name="close"
          size={25}
          color={colors.white}
          style={styles.icon}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "space-between",
    flexDirection: "row",
    position: "absolute",
    width: "100%",
    borderBottomWidth: 2,
    borderColor: colors.white,
    paddingHorizontal: 20,
    paddingBottom: 5,
    zIndex: 1,
    // backgroundColor: "red",
  },
  title: {
    fontSize: 32,
    fontWeight: "500",
    color: colors.white,
  },
  icon: {
    marginTop: 10,
  },
});
