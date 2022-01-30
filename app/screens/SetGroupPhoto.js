import React, { useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  TouchableWithoutFeedback,
} from "react-native";

import Screen from "../components/Screen";
import Icon from "../components/Icon";
import AppButton from "../components/buttons/Button";
import useImagePicker from "../hooks/useImagePicker";
import GroupService from "../services/GroupService";
import UserContext from "../UserContext";
import routes from "../navigation/routes";
import defautlStyles from "../config/styles";
import fileStorage from "../config/fileStorage";
import colors from "../config/colors";
import { Header, HeaderTitle } from "../components/headers";
import Toast from "react-native-toast-message";
import store from "../redux/store";
import { userGroupActions } from "../redux/userGroups";

const SetGroupPhoto = ({ navigation, route }) => {
  const {
    user: loggedInUser,
    setloadingIndicator,
    loadingIndicator,
  } = useContext(UserContext);
  const { file, pickImage, clearFile } = useImagePicker();
  console.log("Params received: ", route.params);

  const proceedHandler = () => {
    if (loadingIndicator) {
      return;
    }
    setloadingIndicator(true);
    const groupFormData = new FormData();
    groupFormData.append("group", JSON.stringify({ ...route.params }));
    if (file.uri) {
      groupFormData.append("groupCover", {
        name: "groupCover",
        type: "image/jpg",
        uri: file.uri,
      });
    }
    GroupService.createGroup(loggedInUser.id, groupFormData)
      .then((resp) => {
        console.log("Group create resp: ", resp.data);
        setloadingIndicator(false);
        Toast.show({
          position: "bottom",
          visibilityTime: 5000,
          type: "success",
          text1: "Success",
          text2: "Group created successfully 👋",
        });
        let allGroups = store.getState().userGroups;
        store.dispatch(userGroupActions.setGroups([...allGroups, resp.data]));
        navigation.navigate(routes.INVITE_GROUP_MEMBERS, {
          groupAdminId: loggedInUser.id,
          groupId: resp.data.id,
          groupInfo: route.params,
          newGroup: true,
          groupCoverPath: resp.data.groupCoverPath
            ? `${fileStorage.baseUrl}${resp.data.groupCoverPath}`
            : null,
        });
      })
      .catch((error) => {
        Toast.show({
          position: "bottom",
          visibilityTime: 5000,
          type: "error",
          text1: "Error",
          text2: "Error occurred while creating the group 😒",
        });
      });
  };
  return (
    <Screen>
      <Header
        backgroundColor={colors.white}
        left={
          <TouchableWithoutFeedback onPress={() => navigation.goBack()}>
            <Icon
              name="chevron-back"
              type="Ionicons"
              size={25}
              backgroundSizeRatio={1}
            />
          </TouchableWithoutFeedback>
        }
        middle={<HeaderTitle>Add Group Photo</HeaderTitle>}
      />
      <Text style={styles.title}>Add Group Cover photo</Text>
      <Text style={styles.subTitle}>
        Give people an idea of what your group is about with a photo
      </Text>
      <View style={styles.photoContainer}>
        {!file.uri && (
          <TouchableOpacity
            style={[defautlStyles.row, styles.uploadButton]}
            onPress={pickImage}
          >
            <Icon
              type={"FontAwesome"}
              size={50}
              name={"photo"}
              style={{ marginRight: 10 }}
            />
            <Text>Upload cover photo</Text>
          </TouchableOpacity>
        )}
        {file.uri && (
          <View onTouchEnd={pickImage}>
            <Image style={styles.groupPhoto} source={file} />
          </View>
        )}
      </View>
      {file.uri && (
        <Text style={styles.subTitle}>
          Touch on the image to change if needed
        </Text>
      )}
      <View
        style={[defautlStyles.row, { justifyContent: "center", padding: 30 }]}
      >
        <AppButton
          disabled={loadingIndicator ? true : false}
          title={"Proceed"}
          width={"50%"}
          style={{ alignSelf: "center", marginTop: 20 }}
          onPress={proceedHandler}
        />
        {/* <AppButton onPress={pickImage} title={'Clear'} width={'30%'} style={{ alignSelf: 'center', marginTop: 20 }} /> */}
      </View>
    </Screen>
  );
};

export default SetGroupPhoto;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  title: {
    marginTop: 50,
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
  uploadButton: {
    backgroundColor: colors.lighterGray,
    padding: 10,
    borderRadius: 7,
  },
  photoContainer: {
    margin: 25,
    borderWidth: 1,
    borderColor: colors.grayX11Gray,
    height: 200,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    // backgroundColor:'coral'
  },
  groupPhoto: {
    // width: 250,
    height: 200,
    width: Dimensions.get("screen").width - 40,
  },
});
