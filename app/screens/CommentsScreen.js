import React, { useState, useRef } from "react";
import { View, StyleSheet, FlatList, Keyboard } from "react-native";

import { Header, HeaderCloseIcon, HeaderTitle } from "../components/headers";
import Screen from "../components/Screen";
import CommentItem from "../components/comments/CommentItem";
import CommentTextField from "../components/comments/CommentTextField";
import EmojiesBar from "../components/comments/EmojiesBar";
import PostService from "../services/PostService";

export default function CommentsScreen({ navigation, route }) {
  const commentsListRef = useRef();
  const commentTextFieldRef = useRef();

  const { comments, userId, postId, setNumberOfComments, postType, swapId } =
    route.params;
  const [commentsList, setCommentsList] = useState(comments);
  const [commentContent, setCommentContent] = useState("");
  // needed to setup list refreshing
  const [refreshing, setRefreshing] = useState(false);
  console.log("Post type: ", postType);
  console.log("swapId: ", swapId);
  console.log("swapId: ", swapId);
  const handleCancel = () => {
    navigation.goBack();
  };
  const handleAddComment = async () => {
    if (postType === "swapPost") {
      console.log("it is Swap");
      const comment = { content: commentContent };
      PostService.addSwapComment(userId, swapId, comment.content).then(
        (resp) => {
          console.log("added swap comment success: ", resp.data);
          refreshComments();
          setCommentContent("");
          commentTextFieldRef.current.clear();
          Keyboard.dismiss();
          // scrollToListBottom();
        }
      );
    } else {
      const comment = { content: commentContent };
      console.log("Making comment: ", userId, postId, comment);
      if (commentContent !== "") {
        const response = await PostService.addComment(userId, postId, comment);
        refreshComments();
        setCommentContent("");
        commentTextFieldRef.current.clear();
        Keyboard.dismiss();
        // scrollToListBottom();
      }
    }
  };

  const refreshComments = async () => {
    setRefreshing(true);
    if (postType !== "swapPost") {
      console.log("if NOT swapPost");
      const response = await PostService.getPostById(postId);
      setCommentsList(response.data.comments);
    } else {
      console.log("if swapPost");
      const response = await PostService.getSwapById(swapId);
      setCommentsList(response.data.comments);
    }

    setRefreshing(false);
  };

  const handleOnChangeText = (text) => {
    setCommentContent(text);
  };

  const scrollToListBottom = () => {
    commentsListRef.current.scrollToEnd({ animated: true });
  };

  return (
    <Screen style={styles.container}>
      <Header
        left={<HeaderCloseIcon onPress={handleCancel} />}
        middle={<HeaderTitle>Comments</HeaderTitle>}
      />

      <FlatList
        data={commentsList}
        keyExtractor={(comment) => comment.id.toString()}
        ref={commentsListRef}
        onContentSizeChange={scrollToListBottom}
        refreshing={refreshing}
        onRefresh={refreshComments}
        renderItem={({ item }) => (
          <CommentItem
            commentId={item.id}
            username={item.user.firstName}
            comment={item.content}
            publishedDate={item.published}
            reactionsLength={
              item?.reactions?.length ? item?.reactions?.length : 0
            }
          />
        )}
      />

      <View style={styles.bottomContent}>
        <EmojiesBar />
        <View style={styles.textFieldContainer}>
          <CommentTextField
            onForwardPress={handleAddComment}
            onChangeText={handleOnChangeText}
            ref={commentTextFieldRef}
          />
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {},
  textFieldContainer: {
    marginHorizontal: 15,
    marginBottom: 25,
    marginTop: 15,
  },
});
