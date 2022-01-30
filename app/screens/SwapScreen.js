import React, { useState } from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import * as ImagePicker from "expo-image-picker";

import { Header, HeaderTitle, HeaderCloseIcon } from "../components/headers";
import Tab from "../components/buttons/Tab";
import Separator from "../components/Separator";
import LinkButton from "../components/buttons/LinkButton";
import colors from "../config/colors";
import routes from "../navigation/routes";
import Screen from "../components/Screen";

export default function SwapScreen({ navigation, route }) {
  const [imageUri, setImageUri] = useState("");
  const [file, setFile] = useState({});
  const imagePickHandler = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.5,
      });
      setImageUri(result.uri);
      setFile(result);
      if (!result.uri) {
        return;
      }
      navigation.navigate(routes.SWAP_DISPLAY, {
        swapImage: result.uri,
        returnSwap: route.params?.returnSwap ? route.params.returnSwap : false,
        swapPostId: route.params?.swapPostId,
      });
    } catch (error) {
      console.log("Error reading an image", error);
    }
  };
  return (
    <Screen>
      {/** Header */}
      <Header
        left={<HeaderCloseIcon onPress={() => navigation.goBack()} />}
        middle={<HeaderTitle>Let's Swap</HeaderTitle>}
      />
      {/** Contact */}
      <View style={styles.content}>
        <View style={styles.upperContainer}>
          <Text style={styles.text}>
            To swap you will have to provide clear image of the object you want
            swap
          </Text>

          <Image
            source={require("../assets/icons/swap-square-dashed.png")}
            style={styles.image}
          />
        </View>

        <View style={styles.lowerContainer}>
          <Tab
            title="Let's take picture"
            color={colors.iondigoDye}
            style={styles.button}
            titleStyle={styles.buttonTitleStyle}
            onPress={imagePickHandler}
          />
          <Separator text="or" style={styles.separator} />
          <LinkButton
            title="Already have image?"
            fontSize={14}
            style={styles.linkButton}
          />
          <Tab
            title="Continue"
            color={colors.iondigoDye}
            style={styles.button}
            titleStyle={styles.buttonTitleStyle}
            onPress={imagePickHandler}
          />
        </View>
        {/* <Tab
          title="Proceed"
          color={colors.iondigoDye}
          style={styles.button}
          titleStyle={styles.buttonTitleStyle}
          onPress={() => {
            navigation.navigate(routes.SWAP_DISPLAY, { image: file.uri });
          }}
        /> */}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: 50,
    justifyContent: "space-between",
  },
  text: {
    fontSize: 18,
    textAlign: "center",
  },
  image: {
    width: 100,
    height: 100,
    alignSelf: "center",
    marginTop: 40,
  },
  lowerContainer: {
    paddingBottom: 50,
    paddingHorizontal: 20,
  },
  button: {
    height: 40,
  },
  buttonTitleStyle: {
    fontWeight: "bold",
    color: colors.white,
  },
  linkButton: {
    alignSelf: "center",
    marginBottom: 20,
  },
  separator: {
    marginVertical: 20,
  },
});
