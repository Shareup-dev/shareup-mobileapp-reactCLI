import React, { useEffect } from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";

import colors from "../../config/colors";
import Icon from "../Icon";

export default function OptionBox({ currentOption, onPress }) {
  useEffect(() => {
    console.log("Current Option:", currentOption);
  }, [currentOption]);

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      {currentOption.icon && (
        <Icon
          image={currentOption.icon}
          backgroundSizeRatio={1}
          size={15}
          color={colors.dimGray}
        />
      )}

      <Text style={styles.text}>{currentOption.value}</Text>
      <MaterialIcons
        name="keyboard-arrow-down"
        size={15}
        color={colors.dimGray}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.dimGray,
    margin: 5,
    borderRadius: 5,
    padding: 2,
  },
  text: {
    fontSize: 14,
    color: colors.dimGray,
    marginHorizontal: 5,
  },
});
