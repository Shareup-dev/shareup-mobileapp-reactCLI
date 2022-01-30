import React from "react";
import {
  View,
  TouchableWithoutFeedback,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

import colors from "../config/colors";
import Text from "../components/Text";
import Tab from "../components/buttons/Tab";
import Icon from "../components/Icon";
import routes from "../navigation/routes";
import fileStorage from "../config/fileStorage";

const PostActions = ({
  postId,
  userId,
  userEmail,
  firstName,
  postText,
  profileImage,
  comments,
  navigation,
  isUserLiked,
  numberOfReactions,
  numberOfComments,
  setIsOptionsVisible,
  postType,
  swapId,
  onInteraction,
}) => {
  const actionsTabSizeRatio = 0.5;

  return (
    <View style={styles.content}>
      <View style={styles.userInfo}>
        <Image
          source={{ uri: fileStorage.baseUrl + profileImage }}
          style={styles.profilePicture}
        />

        <View style={styles.userNameContainer}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate(routes.USER_PROFILE, { userEmail })
            }
          >
            <Text style={styles.userName}>{firstName}</Text>
          </TouchableOpacity>

          <Text style={styles.postDate}>on October 12 2016</Text>
        </View>

        <View style={styles.actionsContainer}>
          <Tab
            title={numberOfReactions}
            iconName="star"
            iconType="FontAwesome5"
            sizeRatio={actionsTabSizeRatio}
            style={styles.actionTab}
            color={colors.mediumGray}
            fontColor={colors.white}
          />

          <Tab
            title={numberOfComments}
            iconName="comment"
            iconType="Octicons"
            sizeRatio={actionsTabSizeRatio}
            style={styles.actionTab}
            color={colors.mediumGray}
            fontColor={colors.white}
          />

          <Tab
            title={"0"}
            iconImage={require("../assets/icons/share-icon.png")}
            sizeRatio={actionsTabSizeRatio}
            style={styles.actionTab}
            color={colors.mediumGray}
            fontColor={colors.white}
            iconSize={10}
          />
        </View>
      </View>

      <View style={styles.actionsBar}>
        <View style={styles.likes}>
          {isUserLiked ? (
            <TouchableWithoutFeedback onPress={onInteraction}>
              <Icon
                name="star"
                type="FontAwesome"
                size={17}
                color="#FFC107"
                backgroundSizeRatio={1}
                style={styles.star}
              />
            </TouchableWithoutFeedback>
          ) : (
            <TouchableWithoutFeedback onPress={onInteraction}>
              <Icon
                name="star-o"
                type="FontAwesome"
                size={17}
                color="#FFC107"
                backgroundSizeRatio={1}
                style={styles.star}
              />
            </TouchableWithoutFeedback>
          )}

          <Text style={styles.actionsText}>{numberOfReactions}</Text>
        </View>

        <View style={styles.commentsShares}>
          <TouchableWithoutFeedback
            onPress={() =>
              navigation.navigate(routes.COMMENTS, {
                postId,
                userId,
                comments,
                postType,
                swapId,
              })
            }
          >
            <Text style={[styles.actionsText, styles.comments]}>
              {numberOfComments} Comments
            </Text>
          </TouchableWithoutFeedback>

          <Text style={styles.actionsText}>0 Shares</Text>
        </View>
      </View>

      {postText !== "" && <Text style={styles.postText}>{postText}</Text>}

      <TouchableOpacity
        style={styles.menuButton}
        onPress={() => {
          setIsOptionsVisible(true);
        }}
      >
        <Icon
          name="options"
          type="SimpleLineIcons"
          style={styles.optionsIcon}
          size={20}
          backgroundSizeRatio={1}
        />
      </TouchableOpacity>
    </View>
  );
};

const borderRadius = 10;
const styles = StyleSheet.create({
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

export default PostActions;
