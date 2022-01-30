import React from "react";
import { View, TextInput } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import defaultStyles from "../config/styles.js";
import colors from "../config/colors.js";

export default function AppTextInput({
  icon,
  width = "100%",
  centerText = false,
  backgroundColor = colors.lighterGray,
  ...otherProps
}) {
  return (
    <View style={[defaultStyles.inputContainer, { width, backgroundColor }]}>
      {icon && (
        <MaterialCommunityIcons
          name={icon}
          size={20}
          color={colors.dimGray}
          style={defaultStyles.inputIcon}
        />
      )}
      <TextInput
        placeholderTextColor={colors.dimGray}
        style={[
          defaultStyles.text,
          {
            width: "100%",
            textAlign: centerText ? "center" : "auto",
            height: 50,
            fontSize: 16,
          },
        ]}
        {...otherProps}
      />
    </View>
  );
}
