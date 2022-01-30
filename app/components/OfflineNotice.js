import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import Constants from "expo-constants";
import { useNetInfo } from "@react-native-community/netinfo";

import colors from "../config/colors";
import Text from "./Text";

export default function OfflineNotice() {
  const { type, isInternetReachable } = useNetInfo();

  //   useEffect(() => {
  //     console.log("type: ", type);
  //     console.log("isInternetReachable: ", isInternetReachable);
  //   });

  if (type !== "unknown" && isInternetReachable === false)
    return (
      <View style={styles.container}>
        <Text style={styles.text}>No Internet Connection</Text>
      </View>
    );

  return null;
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: colors.red,
    height: 50,
    justifyContent: "center",
    position: "absolute",
    top: Constants.statusBarHeight,
    width: "100%",
    zIndex: 1,
  },
  text: {
    color: colors.white,
    fontSize: 18,
  },
});
