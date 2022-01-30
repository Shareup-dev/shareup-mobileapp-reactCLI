import React, { useContext, useState, useCallback, useEffect } from "react";
import {
  StyleSheet,
  FlatList,
  Dimensions,
  ActivityIndicator,
  View,
} from "react-native";
import { useSelector } from "react-redux";

import PostService from "../services/PostService";
import UserContext from "../UserContext";
import Screen from "../components/Screen";
import Card from "../components/lists/Card";
import FeedTop from "../components/FeedTop";
import colors from "../config/colors";
import SwapCard from "../components/lists/SwapCard";
import StoryService from "../services/StoryService";
import store from "../redux/store";
import { storiesAction } from "../redux/stories";
import { feedPostsAction } from "../redux/feedPostsSlice";
import TrendingComponent from "../components/trending/TrendingComponent";

export default function NewsFeedScreen({ navigation, route }) {
  const { user, setloadingIndicator, loadingIndicator } =
    useContext(UserContext);
  const [posts, setPosts] = useState([]);

  const [activityIndicator, setActivityIndicator] = useState(true);

  const feedPosts = useSelector((state) => state.feedPosts);

  const options = [
    {
      title: "Save post",
      icon: {
        image: require("../assets/post-options-icons/save-post-icon.png"),
      },
      onPress: () => {
        alert("Save post");
      },
    },
    {
      title: "Hide my profile",
      icon: {
        image: require("../assets/post-options-icons/hide-profile-icon.png"),
      },
      onPress: () => {
        alert("Save post");
      },
    },
    {
      title: "Swap",
      icon: { image: require("../assets/post-options-icons/swap-icon.png") },
      onPress: () => {
        alert("Swap");
      },
    },
    {
      title: "Share friends",
      icon: {
        image: require("../assets/post-options-icons/share-friends-icon.png"),
      },
      onPress: () => {
        alert("Share friends");
      },
    },
    {
      title: "Unfollow",
      icon: {
        image: require("../assets/post-options-icons/unfollow-icon.png"),
      },
      onPress: () => {
        alert("Unfollow");
      },
    },
    {
      title: "Report",
      icon: {
        image: require("../assets/post-options-icons/report-icon.png"),
      },
      onPress: () => {
        alert("Report");
      },
    },
    {
      title: "Delete Post",
      icon: {
        image: require("../assets/post-options-icons/delete-red-icon.png"),
      },
      onPress: () => {
        showDeleteAlert();
      },
    },
  ];

  useEffect(() => {
    loadNews();
    loadStories();

    // return setActivityIndicator(false);
  }, []);

  const loadStories = () => {
    StoryService.getStories().then((resp) => {
      store.dispatch(storiesAction.setStories(resp.data));
    });
  };

  const loadNews = async () => {
    // setloadingIndicator(true);
    // setActivityIndicator(true);

    PostService.getNewsFeed(user.email)
      .then((res) => {
        // console.log("response>>", res);
        store.dispatch(feedPostsAction.setFeedPosts(res.data));
        if (feedPosts.length === 0) hideActivityIndicator();
      })
      .catch((err) => console.log(err));

    // setActivityIndicator(false);
    // console.log("posts", response.data);
    // setloadingIndicator(false);
    // if (!response.ok) setPosts(response.data.sort((a, b) => b.id - a.id));
    // else if (response.ok) console.log("Failed to load posts");
  };

  // const getItem =  (data, index) => ({

  // })

  const renderItem = ({ item }) => {
    return item.hasOwnProperty("swaped") ? (
      /**
       * The Swap Should from backend as instance of post
       */
      // ToDO: Refactor to use one component for posts and swap.
      <SwapCard
        navigation={navigation}
        route={route}
        item={item}
        userId={item.user.id}
      />
    ) : (
      <Card
        user={item.user}
        postId={item.id}
        userId={item.user.id}
        userEmail={item.user.email}
        firstName={item.user.firstName}
        lastName={item.user.lastName}
        profileImage={item.user.profilePicturePath}
        date={item.lastEdited}
        postText={item.content}
        postImages={item.media}
        reactions={item.reactions}
        comments={item.comments}
        navigation={navigation}
        reloadPosts={loadNews}
        postType={item.hasOwnProperty("swaped") ? "swap" : "regularPost"}
      />
    );
  };

  const hideActivityIndicator = () => {
    setActivityIndicator(false);
  };

  const ActivityIndicatorComponent = () => (
    <View style={styles.listFooter}>
      {activityIndicator && (
        <ActivityIndicator size="large" color={colors.iondigoDye} />
      )}
    </View>
  );

  const ListHeader = () => {
    return (
      <>
        <FeedTop navigation={navigation} />
        <TrendingComponent />
      </>
    );
  };

  return (
    <Screen style={styles.container} statusPadding={false}>
      <FlatList
        initialNumToRender={10}
        data={feedPosts}
        ListHeaderComponent={ListHeader}
        ListFooterComponent={ActivityIndicatorComponent}
        keyExtractor={(post) => post.id.toString()}
        showsVerticalScrollIndicator={false}
        renderItem={renderItem}
        onEndReached={hideActivityIndicator}
        // ListEmptyComponent={() => (
        //   <Text style={{ alignSelf: "center" }}>No posts Available</Text>
        // )}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flex: 1,
    justifyContent: "center",
  },
  profilePicture: {
    borderRadius: 15,
    marginRight: 10,
    width: 50,
    height: 50,
  },
  username: {
    fontWeight: "bold",
    marginHorizontal: 10,
  },
  postedBy: {
    flexDirection: "row",
    alignItems: "center",
  },
  postedDate: {
    marginHorizontal: 10,
    color: colors.grayX11Gray,
  },
  swapDescription: {
    marginHorizontal: 50,
    marginVertical: 15,
  },
  swapButton: {
    backgroundColor: colors.primaryGreen,
    marginHorizontal: "10%",
    borderRadius: 10,
  },
  swapContainer: {
    borderWidth: 1,
    borderColor: colors.lighterGray,
    marginVertical: 10,
    paddingVertical: 10,
    width: Dimensions.get("screen").width - 30,
    marginHorizontal: 15,
    borderRadius: 5,
  },
  menuButton: {
    padding: 3,
    alignSelf: "flex-end",
    width: 60,
    marginTop: -5,
  },
  optionsIcon: {
    alignSelf: "flex-end",
    top: 8,
  },
  card: {
    backgroundColor: colors.white,
    marginHorizontal: 15,
    marginTop: 10,
    overflow: "hidden",
    padding: 7,
    paddingHorizontal: 6,
  },
  image: {
    width: "100%",
    height: 250,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
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
    // width: "42%",
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
  listFooter: {
    height: 60,
  },
});
