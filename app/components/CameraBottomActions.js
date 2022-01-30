import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";

import Icon from "./Icon";
import colors from "../config/colors";

/**
 * @param {*} onPickFile: required
 * @param {*} onCapture: required
 * @param {*} onRevertCamera: required
 */
export default function CameraBottomActions({
  onPickFile,
  onCapture,
  onRevertCamera,
}) {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onPickFile} style={styles.bottomBtn}>
        <Icon type={"FontAwesome"} name={"file-photo-o"} size={64} />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.captureButton}
        onPress={onCapture}
      ></TouchableOpacity>

      <TouchableOpacity onPress={onRevertCamera} style={styles.bottomBtn}>
        <Icon type={"Ionicons"} name={"camera-reverse-outline"} size={64} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    position: "absolute",
    bottom: 50,
    zIndex: 1,
    paddingHorizontal: 20,
    height: 120,
  },
  bottomBtn: {
    bottom: -50,
  },
  captureButton: {
    height: 86,
    width: 86,
    backgroundColor: colors.white,
    borderRadius: 60,
    borderWidth: 5,
    borderColor: colors.LightGray,
  },
});
