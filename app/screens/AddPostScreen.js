import React, { useContext, useState, useRef, useEffect, useMemo } from "react";
import { StyleSheet, View, Image, TextInput } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { StackActions } from "@react-navigation/routers";

import { groupPostsActions } from "../redux/groupPosts";
import EnhancedOptionsDrawer from "../components/drawers/EnhancedOptionsDrawer";
import Icon from "../components/Icon";
import IconButton from "../components/buttons/IconButton";
import Text from "../components/Text";
import Screen from "../components/Screen";
import UserContext from "../UserContext";
import PostService from "../services/PostService";
import routes from "../navigation/routes";
import { useImagePicker } from "../hooks";
import Header from "../components/headers/Header";
import constants from "../config/constants";
import defaultStyles from "../config/styles";
import colors from "../config/colors";
import {
  HeaderCloseIcon,
  HeaderTitle,
  HeaderButton,
  SpecialHeaderButton,
} from "../components/headers";
import OptionsDrawer from "../components/drawers/OptionsDrawer";
import store from "../redux/store";
import ImageInputList from "../components/ImageInputList";
import { feedPostsAction } from "../redux/feedPostsSlice";
import RadioOptionDrawer from "../components/drawers/RadioOptionDrawer";
import OptionBox from "../components/posts/OptionBox";

export default function AddPostScreen({ navigation, route }) {
  const { user, setUser, loadingIndicator, setloadingIndicator } =
    useContext(UserContext);

  const { postTypes } = constants;
  const { postType } = route.params;
  const { groupPost } = route.params;
  const { groupId } = route.params;
  const { swapImage } = route.params;

  const SWAP_DEFAULT_TEXT = "Hi all \nI want to Swap ...";

  const textInputRef = useRef();
  const createPostDrawerRef = useRef(null); // reference for the enhanced drawer.

  const createPostOptions = [
    {
      title: "Photos",
      icon: {
        image: require("../assets/add-post-options-icons/photo-gradient-icon.png"),
      },
      onPress: () => {
        handelPickImage();
      },
    },
    {
      title: "Tag People",
      icon: {
        image: require("../assets/add-post-options-icons/tag-people-gradient-icon.png"),
      },
      onPress: () => {
        alert("Tag People");
      },
    },
    {
      title: "Sell and Share",
      icon: {
        image: require("../assets/add-post-options-icons/sell-and-share-gradient-icon.png"),
      },
      onPress: () => {
        alert("Sell and Share");
      },
    },
    {
      title: "Feeling/Activity",
      icon: {
        image: require("../assets/add-post-options-icons/feeling-gradient-icon.png"),
      },
      onPress: () => {
        alert("Feeling/Activity");
      },
    },
    {
      title: "Location",
      icon: {
        image: require("../assets/add-post-options-icons/location-gradient-icon.png"),
      },
      onPress: () => {
        alert("Location");
      },
    },
    {
      title: "Live",
      icon: {
        image: require("../assets/add-post-options-icons/live-gradient-icon.png"),
      },
      onPress: () => {
        alert("Live");
      },
    },
  ];

  const shareUpOptions = useMemo(
    () => [
      {
        title: "Share Feed",
        icon: { image: require("../assets/icons/gray-feed-icon.png") },
        onPress: () => {
          alert("Share Feed");
        },
      },
      {
        title: "Share time",
        icon: { image: require("../assets/icons/gray-share-time-icon.png") },
        onPress: () => {
          alert("Share time");
        },
      },
      {
        title: "Share Friends",
        icon: { image: require("../assets/icons/gray-share-friends-icon.png") },
        onPress: () => {
          alert("Share Friends");
        },
      },
      {
        title: "Share Point",
        icon: { image: require("../assets/icons/gray-share-point-icon.png") },
        onPress: () => {
          alert("Share Point");
        },
      },
      {
        title: "Share Groups",
        icon: { image: require("../assets/icons/gray-share-groups-icon.png") },
        onPress: () => {
          alert("Share Groups");
        },
      },
      {
        title: "Sell and Share",
        icon: {
          image: require("../assets/icons/gray-sell-and-share-icon.png"),
        },
        onPress: () => {
          alert("Sell and Share");
        },
      },
    ],
    []
  );

  const privacyOptions = useMemo(
    () => [
      {
        icon: require("../assets/post-privacy-options-icons/public-icon.png"),
        label: "Public",
        value: "Public",
        description: "Anyone on or off Shareup",
      },
      {
        icon: require("../assets/post-privacy-options-icons/friends-icon.png"),
        label: "Friends",
        value: "Friends",
        description: "Your friends on Shareup",
      },
      {
        icon: require("../assets/post-privacy-options-icons/friends-except-icon.png"),
        label: "Friends except...",
        value: "Friends except...",
        description: "Don't show to some friends",
      },
      {
        icon: require("../assets/post-privacy-options-icons/specific-friends-icon.png"),
        label: "Specific friends",
        value: "Specific friends",
        description: "Only show to some friends",
      },
    ],
    []
  );

  const [error, setError] = useState("");
  const [text, setText] = useState("");
  const { file, pickImage, clearFile } = useImagePicker();

  const [displayImage, setDisplayImage] = useState(false);
  const [isButtonActive, setIsButtonActive] = useState(false);
  const [isOptionsVisible, setIsOptionsVisible] = useState(false);
  const [isPrivacyOptionsVisible, setIsPrivacyOptionsVisible] = useState(false);
  const [images, setImages] = useState([]);

  const [postPrivacyOption, setPostPrivacyOption] = useState(privacyOptions[0]); // object to present the current privacy option

  useEffect(() => {
    if (postType === postTypes.SWAP) {
      setImages([swapImage]);
      handleButtonActivation(text, [swapImage]);
    } else {
      handleButtonActivation(text, images);
    }

    return () => clearFields();
  }, [swapImage]);

  const handleOnChangeText = (text) => {
    setText(text);
    handleButtonActivation(text, images);
  };

  const handleButtonActivation = (text, images) => {
    if (text !== "" || text !== undefined) setIsButtonActive(true);
    if (images.length > 0) setIsButtonActive(true);
    if (images.length === 0 && text === "") setIsButtonActive(false);
    if (images.length === 0 && text === undefined) setIsButtonActive(false);
  };

  const handelPickImage = async () => {
    try {
      const result = await pickImage();
      console.log("result", result);
      if (!result.cancelled) onAddImage(result.uri);
    } catch (error) {}
  };

  const onAddImage = (uri) => {
    console.log("uri", uri);
    setImages([...images, uri]);
    handleButtonActivation(text, [...images, uri]);
  };

  const onRemoveImage = (uri) => {
    const updatedImages = images.filter((images) => images !== uri);
    setImages(updatedImages);
    handleButtonActivation(text, updatedImages);
  };

  const handleAddPost = async () => {
    setloadingIndicator(true);

    if (groupPost) {
      const postContent = {
        text,
        groupId,
      };

      if (file.uri) {
        postContent.image = file;
      }

      PostService.createPost(user.id, postContent).then((resp) => {
        let existingPosts = store.getState().groupPosts;
        setloadingIndicator(false);
        store.dispatch(
          groupPostsActions.setPosts([resp.data, ...existingPosts])
        );

        store.dispatch(feedPostsAction.addFeedPost(resp.data));
        const popAction = StackActions.pop(1);

        navigation.dispatch(popAction);
      });
    } else {
      if (postType === postTypes.SWAP) {
        const swapContent = {
          text: text === "" ? SWAP_DEFAULT_TEXT : text,
          images: images,
        };

        PostService.createSwapPost(user.id, swapContent).then((resp) => {
          store.dispatch(feedPostsAction.addFeedPost(resp.data));
          setloadingIndicator(false);
          navigation.navigate(routes.FEED);
        });
      } else {
        if (text === "" && Object.keys(file).length === 0) {
          setError("Can't Create empty post");
        } else {
          const postContent = {
            text: text,
            images: images,
          };

          PostService.createPost(user.id, postContent).then((resp) => {
            store.dispatch(feedPostsAction.addFeedPost(resp.data));
            setloadingIndicator(false);
            navigation.navigate(routes.FEED);
          });
        }
      }
    }
    clearFields();
  };

  // used to change the position of the enhanced drawer,
  // when user click on the text input.
  const handleCreatePostDrawerPosition = () => {
    if (postType === postTypes.CREATE_POST)
      createPostDrawerRef.current.snapTo(0);
  };

  const handleCancel = () => {
    clearFields();
    navigation.navigate(routes.FEED);
  };

  const clearFields = () => {
    setText("");
    clearFile();
    setDisplayImage(false);
    setImages([]);
    setIsButtonActive(false);
    textInputRef.current.clear();
  };

  const handelPrivacySetting = (value) => {
    console.log("Value", value);
    const index = privacyOptions.map((item) => item.value).indexOf(value);
    console.log(index);
    const option = privacyOptions[index];
    setPostPrivacyOption(option);
    setIsPrivacyOptionsVisible(!isPrivacyOptionsVisible);
  };

  useEffect(() => {
    console.log("Privacy Options: ", postPrivacyOption);
  }, [postPrivacyOption]);

  const renderHeader = () => {
    if (postType === postTypes.HANG_SHARE)
      return (
        <Header
          left={<HeaderCloseIcon onPress={handleCancel} />}
          middle={
            <Text style={styles.hangShareHeaderTitle}>
              Today to me, tomorrow to you
            </Text>
          }
          right={
            <SpecialHeaderButton
              title="Keep Hang"
              onPress={() => navigation.navigate(routes.KEEP_HANG)}
            />
          }
        />
      );
    if (
      postType === postTypes.CREATE_POST ||
      postType === postTypes.SHARE_UP ||
      postType === postTypes.SWAP
    )
      return (
        <Header
          left={<HeaderCloseIcon onPress={handleCancel} />}
          middle={
            <HeaderTitle>
              {postType === postTypes.SWAP && "Swap"}
              {postType === postTypes.CREATE_POST && postTypes.CREATE_POST}
              {postType === postTypes.SHARE_UP && postTypes.SHARE_UP}
            </HeaderTitle>
          }
          right={
            <HeaderButton
              onPress={handleAddPost}
              title="Post"
              isActive={isButtonActive}
            />
          }
        />
      );
  };
  return (
    <Screen>
      {renderHeader()}

      <View style={[styles.topContainer]}>
        {/** User */}
        <View style={styles.row}>
          <Image
            source={require("../assets/default-profile-picture.png")}
            style={defaultStyles.circledProfilePicture}
          />
          <View style={styles.column}>
            <Text style={styles.userName}>
              {user.firstName} {user.lastName}
            </Text>
            <View style={styles.row}>
              {/**Friends */}
              <OptionBox
                currentOption={postPrivacyOption}
                onPress={() =>
                  setIsPrivacyOptionsVisible(!isPrivacyOptionsVisible)
                }
              />

              {postType === postTypes.CREATE_POST && (
                <View style={[styles.headerTab, styles.row]}>
                  <MaterialCommunityIcons
                    name="plus"
                    size={15}
                    color={colors.dimGray}
                  />
                  <Text style={styles.headerTabText}>Albums</Text>
                  <MaterialIcons
                    name="keyboard-arrow-down"
                    size={15}
                    color={colors.dimGray}
                  />
                </View>
              )}
              {/*** // Todo: Create swap category! */}
            </View>
          </View>

          {(postType === postTypes.HANG_SHARE ||
            postType === postTypes.SHARE_UP) && (
            <IconButton
              onPress={() => setIsOptionsVisible(!isOptionsVisible)}
              IconComponent={
                <Icon
                  image={require("../assets/icons/squared-add-icon.png")}
                  color={colors.iondigoDye}
                  backgroundSizeRatio={0.8}
                />
              }
              style={styles.plusIcon}
            />
          )}
        </View>

        {/**Content */}
        <TextInput
          placeholder={
            postType === postTypes.SWAP
              ? SWAP_DEFAULT_TEXT
              : "We Share, Do you?"
          }
          placeholderTextColor={colors.dimGray}
          style={styles.textInput}
          numberOfLines={10}
          multiline={true}
          onChangeText={handleOnChangeText}
          ref={textInputRef}
          onTouchEnd={handleCreatePostDrawerPosition}
        />

        <ImageInputList
          imageUris={images}
          onAddImage={onAddImage}
          isSwap={postType === postTypes.SWAP ? true : false}
          onRemoveImage={onRemoveImage}
        />
      </View>

      {postType === postTypes.CREATE_POST && (
        <EnhancedOptionsDrawer
          options={createPostOptions}
          forwardedRef={createPostDrawerRef}
        />
      )}

      {postType === postTypes.SHARE_UP && (
        <OptionsDrawer
          options={shareUpOptions}
          isVisible={isOptionsVisible}
          setIsVisible={setIsOptionsVisible}
        />
      )}
      {postType === postTypes.HANG_SHARE && (
        <OptionsDrawer
          title="What's in Hang ?"
          options={[createPostOptions[0]]}
          isVisible={isOptionsVisible}
          setIsVisible={setIsOptionsVisible}
        />
      )}

      <RadioOptionDrawer
        isVisible={isPrivacyOptionsVisible}
        setIsVisible={setIsPrivacyOptionsVisible}
        options={privacyOptions}
        title="Who can see your posts?"
        subTitle="Your post will appear in news feed, on your profile and in search results"
        initialValue={privacyOptions[0].value}
        onSubmit={handelPrivacySetting}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  topContainer: {
    padding: 10,
    paddingHorizontal: 20,
    flex: 1,
  },
  column: {
    display: "flex",
    flexDirection: "column",
    width: "70%",
  },
  row: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  userName: {
    fontWeight: "bold",
  },
  headerTab: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.dimGray,
    margin: 5,
    borderRadius: 5,
    padding: 2,
  },
  headerTabText: {
    fontSize: 14,
    color: colors.dimGray,
    marginHorizontal: 5,
  },
  modal: {
    justifyContent: "flex-end",
    margin: 0,
  },
  modalView: {
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    flex: 0.5,
    borderTopStartRadius: 15,
    borderTopEndRadius: 15,
  },
  tempModal: {
    marginTop: 10,
    flex: 0.4,
    height: "100%",
    backgroundColor: colors.white,
    shadowColor: colors.dark,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.8,
    shadowRadius: 4.65,
    elevation: 24,
  },
  topBorderRadius: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  textInput: { height: "10%", textAlignVertical: "top", marginTop: 10 },
  image: {
    width: "100%",
    height: 250,
    resizeMode: "contain",
  },
  hangShareHeaderTitle: {
    fontWeight: "bold",
    fontSize: 12,
  },
  fancyAddButton: {
    marginLeft: 10,
  },
});
