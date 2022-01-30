import React, { Fragment } from "react";
import { View, Image } from "react-native";
import {
  MaterialCommunityIcons,
  AntDesign,
  Entypo,
  EvilIcons,
  Feather,
  FontAwesome,
  FontAwesome5,
  Fontisto,
  Foundation,
  MaterialIcons,
  Octicons,
  SimpleLineIcons,
  Zocial,
  Ionicons,
} from "@expo/vector-icons";

export default function Icon({
  image,
  name,
  size = 40,
  backgroundColor = "#fff",
  color = "#000",
  type = "MaterialCommunityIcons",
  backgroundSizeRatio = 0.5,
  style,
  noBackground = false,
  ...otherProps
}) {
  const renderImageOrIcon = () => {
    if (image)
      return (
        <Image
          source={image}
          style={{
            width: size * backgroundSizeRatio,
            height: size * backgroundSizeRatio,
            resizeMode: "contain",
          }}
        />
      );
    else
      return (
        <>
          {type === "MaterialCommunityIcons" && (
            <MaterialCommunityIcons
              size={size * backgroundSizeRatio}
              name={name}
              color={color}
              {...otherProps}
            />
          )}
          {type === "AntDesign" && (
            <AntDesign
              size={size * backgroundSizeRatio}
              name={name}
              color={color}
              {...otherProps}
            />
          )}
          {type === "Entypo" && (
            <Entypo
              size={size * backgroundSizeRatio}
              name={name}
              color={color}
              {...otherProps}
            />
          )}
          {type === "EvilIcons" && (
            <EvilIcons
              size={size * backgroundSizeRatio}
              name={name}
              color={color}
              {...otherProps}
            />
          )}
          {type === "Feather" && (
            <Feather
              size={size * backgroundSizeRatio}
              name={name}
              color={color}
              {...otherProps}
            />
          )}
          {type === "FontAwesome" && (
            <FontAwesome
              size={size * backgroundSizeRatio}
              name={name}
              color={color}
              {...otherProps}
            />
          )}
          {type === "FontAwesome5" && (
            <FontAwesome5
              size={size * backgroundSizeRatio}
              name={name}
              color={color}
              {...otherProps}
            />
          )}
          {type === "Fontisto" && (
            <Fontisto
              size={size * backgroundSizeRatio}
              name={name}
              color={color}
              {...otherProps}
            />
          )}
          {type === "Foundation" && (
            <Foundation
              size={size * backgroundSizeRatio}
              name={name}
              color={color}
              {...otherProps}
            />
          )}
          {type === "MaterialIcons" && (
            <MaterialIcons
              size={size * backgroundSizeRatio}
              name={name}
              color={color}
              {...otherProps}
            />
          )}
          {type === "Octicons" && (
            <Octicons
              size={size * backgroundSizeRatio}
              name={name}
              color={color}
              {...otherProps}
            />
          )}
          {type === "SimpleLineIcons" && (
            <SimpleLineIcons
              size={size * backgroundSizeRatio}
              name={name}
              color={color}
              {...otherProps}
            />
          )}
          {type === "Zocial" && (
            <Zocial
              size={size * backgroundSizeRatio}
              name={name}
              color={color}
              {...otherProps}
            />
          )}
          {type === "Ionicons" && (
            <Ionicons
              size={size * backgroundSizeRatio}
              name={name}
              color={color}
              {...otherProps}
            />
          )}
        </>
      );
  };
  return (
    <View
      style={[
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: noBackground ? null : backgroundColor,
          justifyContent: "center",
          alignItems: "center",
        },
        style,
      ]}
    >
      {renderImageOrIcon()}
    </View>
  );
}
