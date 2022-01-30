import React, { useRef, useEffect } from "react";
import { View, StyleSheet, ScrollView, Image } from "react-native";
import Icon from "./Icon";
import ImageInput from "./ImageInput";

export default function ImageInputList({
  imageUris = [],
  onAddImage,
  onRemoveImage,
  isSwap,
}) {
  const scrollView = useRef();

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollView}
        // horizontal
        onContentSizeChange={() => scrollView.current.scrollToEnd()}
      >
        {imageUris.map((uri) => (
          <View key={uri} style={isSwap ? null : styles.imagePadding}>
            <ImageInput
              imageUri={uri}
              onChangeImage={() => onRemoveImage(uri)}
            />
            {isSwap &&
              imageUris.indexOf(uri) == 0 &&
              imageUris.length === 2 && (
                <Icon
                  image={require("../assets/icons/swap-icon.png")}
                  style={styles.swapIcon}
                />
              )}
          </View>
        ))}

        {isSwap && imageUris.length < 2 && (
          <ImageInput
            onChangeImage={(uri) => onAddImage(uri)}
            isSwap={isSwap}
          />
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
  },
  imagePadding: {
    marginBottom: 10,
  },
  swapIcon: {
    alignSelf: "center",
  },
});
