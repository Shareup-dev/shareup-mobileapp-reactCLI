import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  Alert,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { SliderBox } from "react-native-image-slider-box";
// import { Image } from "react-native-expo-image-cache"; // an image component that can be cached

import colors from "../../config/colors";
import defaultStyles from "../../config/styles";
import UserService from "../../services/UserService";
import PostService from "../../services/PostService";
import PostOptionDrawer from "../drawers/PostOptionsDrawer";
import fileStorage from "../../config/fileStorage";
import ImageView from "react-native-image-viewing";
import PostActions from "../PostActions";
export default function Card({
  postId,
  userId,
  firstName,
  lastName,
  userEmail,
  date,
  postText,
  postImages,
  profileImage,
  reactions,
  comments,
  post,
  reloadPosts,
  onPress,
  style,
  navigation,
  postType,
}) {
  const options = [
    {
      title: "Save post",
      icon: {
        image: require("../../assets/post-options-icons/save-post-icon.png"),
      },
      onPress: () => {
        alert("Save post");
      },
    },
    {
      title: "Hide my profile",
      icon: {
        image: require("../../assets/post-options-icons/hide-profile-icon.png"),
      },
      onPress: () => {
        alert("Save post");
      },
    },
    {
      title: "Swap",
      icon: { image: require("../../assets/post-options-icons/swap-icon.png") },
      onPress: () => {
        alert("Swap");
      },
    },
    {
      title: "Share friends",
      icon: {
        image: require("../../assets/post-options-icons/share-friends-icon.png"),
      },
      onPress: () => {
        alert("Share friends");
      },
    },
    {
      title: "Unfollow",
      icon: {
        image: require("../../assets/post-options-icons/unfollow-icon.png"),
      },
      onPress: () => {
        alert("Unfollow");
      },
    },
    {
      title: "Report",
      icon: {
        image: require("../../assets/post-options-icons/report-icon.png"),
      },
      onPress: () => {
        alert("Report");
      },
    },
    {
      title: "Delete Post",
      icon: {
        image: require("../../assets/post-options-icons/delete-red-icon.png"),
      },
      onPress: () => {
        showDeleteAlert();
      },
    },
  ];

  const [formattedDate, setFormattedDate] = useState({
    day: "",
    month: "",
    year: "",
    time: "",
  });
  function randomno() {
    return Math.floor(Math.random() * (100000 - 0 + 1) + 0);
  }
  const formateDate = () => {
    const arrDate = date.split(" ");
    const monthShort = arrDate[1].slice(0, 3);
    setFormattedDate({
      day: arrDate[0],
      month: monthShort,
      year: arrDate[2],
      time: arrDate[3],
    });
  };
  const formateNumber = (number) => {
    if (number > 1000) {
      number = Math.floor(number / 1000);
      return number + "k ";
    } else return number;
  };

  useEffect(() => {
    formateDate();
    checkIfLiked();
    loadImages();
  }, []);

  useFocusEffect(
    useCallback(() => {
      reloadPost();
    }, [postId])
  );

  const [numberOfReactions, setNumberOfReactions] = useState(reactions.length);
  const [numberOfComments, setNumberOfComments] = useState(comments.length);
  const [isUserLiked, setIsUserLiked] = useState(false);
  const [isOptionsVisible, setIsOptionsVisible] = useState(false);
  const [images, setImages] = useState([]);
  const [currentImage, setCurrentImage] = useState();
  const [imageViewerVisible, setImageViewerVisible] = useState(false);
  const [sliderWidth, setSliderWidth] = useState();

  const loadImages = () => {
    if (postImages.length !== 0) {
      setImages(
        postImages.map((image) => fileStorage.baseUrl + image.mediaPath)
      );
    }
  };

  const checkIfLiked = () => {
    const result = reactions.filter((reaction) => reaction.user.id == userId);
    if (result.length > 0) {
      return setIsUserLiked(true);
    }
  };

  const handleReactions = async () => {
    const response = await UserService.likePost(userId, postId);
    setIsUserLiked(!isUserLiked);
    reloadPost();
  };

  // rerenders the post when interaction
  const reloadPost = async () => {
    const response = await PostService.getPostById(postId);
    setNumberOfComments(response.data.comments.length);
    setNumberOfReactions(response.data.reactions.length);
  };

  const showDeleteAlert = () =>
    Alert.alert("Delete", "Are you sure to delete this post", [
      {
        text: "Yes",
        onPress: deletePost,
        style: "cancel",
      },
      {
        text: "No",
        style: "cancel",
      },
    ]);

  const deletePost = async () => {
    console.log("data before delete: " + response.data);
    const response = await PostService.deletePost(postId);
    console.log("data after delete: " + response.data);
    reloadPosts();
  };

  const actionsTabSizeRatio = 0.5;

  const onLayout = (e) => {
    setSliderWidth(e.nativeEvent.layout.width);
  };

  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View
        style={[styles.card, defaultStyles.cardBorder, style]}
        onLayout={onLayout}
      >
        {currentImage && (
          <ImageView
            visible={imageViewerVisible}
            images={[{ uri: currentImage }]}
            imageIndex={0}
            onRequestClose={() => {
              setImageViewerVisible(false);
            }}
          />
        )}

        {/** Post Image */}

        {images.length !== 0 && (
          <SliderBox
            images={images}
            ImageComponentStyle={styles.image}
            imageLoadingColor={colors.iondigoDye}
            // parentWidth={sliderWidth / 1.04}
            onCurrentImagePressed={(index) => {
              setCurrentImage(images[index]);
              setImageViewerVisible(true);
            }}
          />

          // <Image source={{ uri: images[0] }} style={styles.image} />
        )}

        <PostActions
          comments={comments}
          firstName={firstName}
          navigation={navigation}
          postId={postId}
          postText={postText}
          userId={userId}
          userEmail={userEmail}
          numberOfReactions={`${numberOfReactions}`}
          numberOfComments={`${numberOfComments}`}
          profileImage={profileImage}
          isUserLiked={isUserLiked}
          isVisible={isOptionsVisible}
          setIsVisible={setIsOptionsVisible}
          setIsOptionsVisible={setIsOptionsVisible}
          onInteraction={handleReactions}
        />

        <PostOptionDrawer
          source={"card"}
          postId={postId}
          postText={postText}
          options={options}
          isVisible={isOptionsVisible}
          setIsVisible={setIsOptionsVisible}
        />
      </View>
    </TouchableWithoutFeedback>
  );
}

const borderRadius = 10;
const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    marginHorizontal: 15,
    marginTop: 10,
    overflow: "hidden",
    // padding: 7,
    // paddingHorizontal: 6,
  },
  image: {
    width: "100%",
    height: 250,
    borderTopLeftRadius: borderRadius,
    borderTopRightRadius: borderRadius,
    resizeMode: "cover",
  },
  profilePicture: {
    borderRadius: 15,
    marginRight: 10,
    width: 50,
    height: 50,
  },
  userInfo: {
    display: "flex",
    flexDirection: "row",
  },
  content: {
    justifyContent: "center",
    padding: 10,
  },
  postDate: {
    fontSize: 12,
    color: colors.dimGray,
  },
  separator: {
    marginVertical: 10,
  },
  postText: {
    fontSize: 11,
    marginTop: 10,
  },
  userName: {
    fontWeight: "bold",
  },
  userNameContainer: {
    width: "40%",
  },
  actionsContainer: {
    flexDirection: "row",
    width: "42%",
    justifyContent: "flex-end",
    marginRight: 10,
  },
  actionTab: {
    paddingHorizontal: 5,
    marginHorizontal: 5,
  },
  actionsBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
  },
  commentsShares: {
    flexDirection: "row",
  },
  likes: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionsText: {
    fontSize: 12,
    fontWeight: "600",
  },
  star: {
    marginRight: 5,
  },
  comments: {
    marginRight: 10,
  },
  optionsIcon: {
    alignSelf: "flex-end",
    top: 8,
  },
  menuButton: {
    padding: 3,
    alignSelf: "flex-end",
    width: 60,
    marginTop: -5,
  },
});
