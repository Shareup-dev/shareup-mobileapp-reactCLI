import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  ScrollView,
  Dimensions,
} from "react-native";
import moment from "moment";

import colors from "../../config/colors";
import Separator from "../Separator";
import UserProfilePicture from "../UserProfilePicture";
import Icon from "../Icon";
import LinkButton from "../buttons/LinkButton";
import CommentText from "./CommentText";

export default function CommentItem({
  commentId,
  username,
  comment,
  reactionsLength,
  publishedDate,
}) {
  const [time, setTime] = useState(
    moment(publishedDate, "DD MMMM YYYY hh:mm:ss").fromNow()
  );

  return (
    <>
      <View style={styles.container}>
        {/** Left */}
        <View>
          <UserProfilePicture size={40} />
        </View>

        {/** Medial */}
        <View style={styles.medialContainer}>
          <Text style={styles.userName}>{username}</Text>

          {/* <Text style={styles.comment}>{comment}</Text> */}
          <View style={styles.commentBody}>
            <CommentText
              text={comment}
              textStyle={styles.comment}
              readMoreStyle={styles.readMore}
            />
          </View>

          <View style={styles.commentDetailsContainer}>
            <Text style={styles.time}>{time}</Text>
            <Text style={styles.stars}>
              {reactionsLength} {reactionsLength < 2 ? "Star" : "Stars"}
            </Text>
            <LinkButton title="Reply" style={styles.reply} />
          </View>
        </View>

        {/** Right */}
        <View style={styles.reactionContainer}>
          <TouchableWithoutFeedback>
            <Icon
              name="staro"
              type="AntDesign"
              color={colors.iondigoDye}
              size={20}
              backgroundSizeRatio={1}
            />
          </TouchableWithoutFeedback>
        </View>
      </View>

      <Separator style={styles.separator} />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    width: "100%",
    paddingHorizontal: 50,
    paddingTop: 25,
    paddingBottom: 6,
    justifyContent: "flex-start",
  },

  medialContainer: {
    marginLeft: 10,
    paddingTop: 5,
    justifyContent: "space-between",
  },
  userName: {
    fontWeight: "bold",
  },
  commentDetailsContainer: {
    width: "65%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  comment: {
    color: colors.mediumGray,
    width: Dimensions.get("window").width / 1.7,
    fontSize: 13,
  },
  commentBody: {
    marginVertical: 6,
  },
  time: {
    fontSize: 9,
  },
  stars: {
    fontSize: 10,
    color: colors.iondigoDye,
  },
  reply: {
    fontSize: 10,
    color: colors.iondigoDye,
    fontWeight: "bold",
  },
  reactionContainer: {
    paddingTop: 5,
  },
  separator: {
    marginHorizontal: 15,
  },
  commentTextContainer: {
    marginVertical: 5,
  },
  readMore: {
    fontSize: 10,
    fontWeight: "bold",
    color: colors.iondigoDye,
  },
});
