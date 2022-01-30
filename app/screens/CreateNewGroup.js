import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, Dimensions } from "react-native";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";

import Screen from "../components/Screen";
import AppButton from "../components/buttons/Button";
import Icon from "../components/Icon";
import Separator from "../components/Separator";
import AppTextInput from "../components/TextInput";
import colors from "../config/colors";
import defaultStyles from "../config/styles";
import routes from "../navigation/routes";
import ChoosePrivacyDrawer from "../components/drawers/ChoosePrivacyDrawer";
import { Header, HeaderCloseIcon, HeaderTitle } from "../components/headers";

export default function CreateNewGroup({ navigation }) {
  const [privacySheet, setPrivacySheet] = useState(false);
  const [privacy, setPrivacy] = useState("Public");
  const [groupDetail, setGroupDetail] = useState({});
  const [isPrivacyDrawerVisible, setIsPrivacyDrawerVisible] = useState(false);

  return (
    <Screen>
      <Header
        left={<HeaderCloseIcon onPress={() => navigation.goBack()} />}
        middle={<HeaderTitle>Create Group</HeaderTitle>}
      />
      <View style={styles.container}>
        <ScrollView>
          <View style={styles.input}>
            <Text style={styles.title}>Name</Text>
            <Text style={styles.subTitle}>
              Type useful name so that it can be searched easily
            </Text>
            <AppTextInput
              style={styles.inputField}
              backgroundColor={"white"}
              onChangeText={(name) => {
                setGroupDetail({ ...groupDetail, name });
              }}
            />
          </View>
          <View style={styles.input}>
            <Text style={styles.title}>Description</Text>
            <Text style={styles.subTitle}>
              Describe your group so people know what it’s about.
            </Text>
            <TextInput
              multiline={true}
              numberOfLines={10}
              onChangeText={(description) => {
                setGroupDetail({ ...groupDetail, description });
              }}
              style={[styles.inputField, styles.groupDescription]}
            />
          </View>

          <View
            onTouchEnd={() => {
              console.log("Touchable");
              setIsPrivacyDrawerVisible(!isPrivacyDrawerVisible);
            }}
            style={styles.input}
          >
            <Text style={styles.title}>Privacy</Text>
            <Text style={styles.subTitle}>
              Choose the privay setting of group
            </Text>
            <View
              style={[
                styles.privacySelector,
                { width: "88%", marginHorizontal: 30 },
              ]}
            >
              <View style={defaultStyles.row}>
                <Icon
                  type={"Ionicons"}
                  name={"lock-closed"}
                  type={privacy === "Public" ? "Entypo" : "Ionicons"}
                  name={privacy === "Public" ? "globe" : "lock-closed"}
                />
                <Text>{privacy}</Text>
              </View>
              <Icon type={"AntDesign"} size={35} name={"caretdown"} />
            </View>
          </View>
          <AppButton
            title={"Next"}
            width={"50%"}
            style={{ alignSelf: "center", marginTop: 20 }}
            onPress={() => {
              // console.log("Privacy going to be: ", privacy);
              groupDetail.privacySetting = privacy;
              setGroupDetail({ ...groupDetail, privacySetting: privacy });
              // console.log("Group details: ", groupDetail);
              navigation.navigate(routes.SET_GROUP_PHOTO, groupDetail);
            }}
          />
        </ScrollView>
      </View>

      <ChoosePrivacyDrawer
        setPrivacy={setPrivacy}
        isVisible={isPrivacyDrawerVisible}
        setIsVisible={setIsPrivacyDrawerVisible}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "white",
  },
  inputField: {
    borderWidth: 1,
    width: "100%",
    height: 50,
    borderRadius: 8,
    color: "black",
    paddingHorizontal: 15,
    fontSize: 18,
    borderColor: colors.grayX11Gray,
  },
  input: {
    marginVertical: 10,
  },
  icon: {
    marginRight: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
    paddingHorizontal: 30,
  },
  subTitle: {
    paddingHorizontal: 30,
    color: colors.mediumGray,
    fontSize: 18,
    marginBottom: 15,
  },
  groupDescription: {
    width: "88%",
    marginHorizontal: 30,
    textAlignVertical: "top",
    height: 150,
    paddingTop: 10,
  },
  privacySelector: {
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    borderRadius: 8,
    borderColor: colors.grayX11Gray,
  },
  privacySheet: {
    // backgroundColor: colors.lighterGray,
    position: "absolute",
    bottom: 0,
    elevation: 3,
    zIndex: 1,
    width: "100%",
    padding: 15,
    paddingHorizontal: 30,
    height: 120,
    justifyContent: "space-between",
    // elevation:1
  },
});
