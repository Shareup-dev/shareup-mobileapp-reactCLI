import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  FlatList,
} from "react-native";
import { useSelector } from "react-redux";

import AppButton from "../components/buttons/Button";
import FeedTop from "../components/FeedTop";
import Icon from "../components/Icon";
import Card from "../components/lists/Card";
import Screen from "../components/Screen";
import WritePost from "../components/WritePost";
import colors from "../config/colors";
import GroupService from "../services/GroupService";
import routes from "../navigation/routes";
import { groupPostsActions } from "../redux/groupPosts";
import store from "../redux/store";

import { HeaderWithBackArrow } from "../components/headers";
import Tab from "../components/buttons/Tab";

const GroupFeedScreen = ({ navigation, route }) => {
  const posts = useSelector((state) => state.groupPosts);

  useEffect(() => {
    console.log("Group: ", route.params);
    GroupService.getGroupsPostsById(route.params.groupId).then((resp) => {
      store.dispatch(groupPostsActions.setPosts(resp.data));
    });
    return () => {
      store.dispatch(groupPostsActions.setPosts(null));
    };
  }, [route.params.groupId]);

  return (
    <Screen style={styles.feedContainer}>
      <HeaderWithBackArrow
        title={route.params.title}
        onBackButton={() => navigation.goBack()}
      />
      <FlatList
        data={posts}
        ListHeaderComponent={() => {
          return (
            <View>
              <Image
                style={styles.groupCoverImage}
                // resizeMode={route.params.image ? "contain" : "cover"}
                // resizeMode={"contain"}
                source={
                  route.params.image
                    ? { uri: route.params.image }
                    : require("../assets/images/group-texture.png")
                }
              />
              <View style={styles.detailContainer}>
                <View style={{ marginHorizontal: 20 }}>
                  <Text style={styles.title}>{route.params.title}</Text>
                  <Text style={styles.subTitle}>
                    {route.params.privacy} Group
                  </Text>
                  <Text style={styles.subTitle}>{route.params.subTitle}</Text>

                  <Tab
                    iconName="add-circle"
                    iconType="Ionicons"
                    title={"invite"}
                    fontColor={colors.dark}
                    style={styles.inviteButton}
                    onPress={() => {
                      navigation.navigate(routes.INVITE_GROUP_MEMBERS, {
                        groupId: route.params.groupId,
                        newGroup: false,
                      });
                    }}
                  />

                  {/* <AppButton
                    icon={
                      <Icon
                        style={styles.inviteIcon}
                        size={40}
                        type={"Ionicons"}
                        name={"add-circle"}
                      />
                    }
                    title={"invite"}
                    fontColor={colors.dark}
                    style={styles.inviteButton}
                    onPress={() => {
                      navigation.navigate(routes.INVITE_GROUP_MEMBERS, {
                        groupId: route.params.groupId,
                        newGroup: false,
                      });
                    }}
                  /> */}
                </View>
                <WritePost
                  groupPost={true}
                  groupId={route.params.groupId}
                  navigation={navigation}
                />
                {posts?.length === 0 && (
                  <View>
                    <Text style={styles.noPostsLabel}>No posts found !</Text>
                  </View>
                )}
              </View>
            </View>
          );
        }}
        keyExtractor={(post) => {
          return post.id.toString();
        }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <Card
            postId={item.id}
            userId={item.user.id}
            firstName={item.user.firstName}
            lastName={item.user.lastName}
            profileImage={item.user.profilePicturePath}
            date={item.lastEdited}
            postText={item.content}
            imageURL={item.imagePath}
            reactions={item.reactions}
            comments={item.comments}
            navigation={navigation}
          />
        )}
      />
    </Screen>
  );
};

const styles = StyleSheet.create({
  feedContainer: {
    display: "flex",
    flex: 1,
    justifyContent: "center",
  },
  container: {
    backgroundColor: colors.white,
    // flex: 1,
  },
  groupCoverImage: {
    width: "100%",
    height: 300,
    resizeMode: "cover",
  },
  detailContainer: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    // backgroundColor: "crimson",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  subTitle: {
    fontSize: 14,
    color: colors.mediumGray,
  },
  inviteIcon: {
    fontSize: 30,
    marginHorizontal: 10,
    backgroundColor: colors.lighterGray,
  },
  inviteButton: {
    backgroundColor: colors.lighterGray,
    color: colors.dark,
    elevation: 0,
    height: 40,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 10,
  },
  noPostsLabel: {
    fontSize: 24,
    color: colors.LightGray,
    textAlign: "center",
    marginTop: 80,
  },
});

export default GroupFeedScreen;
