import React, { useContext, useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  Text,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import Tab from "../buttons/Tab";
import colors from "../../config/colors";
import defaultStyle from "../../config/styles";
import routes from "../../navigation/routes";
import fileStorage from "../../config/fileStorage";
import GroupService from "../../services/GroupService";
import UserContext from "../../UserContext";

const resizeRatio = 0.7;
export default function GroupJoinCard({
  image,
  title,
  subTitle,
  navigation,
  params,
  privacy,
  groupId,
}) {
  // console.log("Navigation in joinGroupCard: ", navigation);
  const [joinBackGroundColor, setJoinBackGroundColor] = useState(
    colors.iondigoDye
  );
  const { user: loggedInUser } = useContext(UserContext);

  const [joinTitle, setJoinTitle] = useState("Join");
  const [joinTitleColor, setJoinTitleColor] = useState(colors.white);

  const handleJoin = () => {
    console.log("Join this group with id: ", groupId);
    GroupService.joinGroup(loggedInUser.id, groupId).then((resp) => {
      console.log("Join group resp: ", resp.data);
    });
    if (joinTitle == "Join") {
      setJoinBackGroundColor(colors.lighterGray);
      setJoinTitle("Leave");
      setJoinTitleColor("#DD482E");
    }
    if (joinTitle == "Leave") {
      setJoinBackGroundColor(colors.iondigoDye);
      setJoinTitle("Join");
      setJoinTitleColor(colors.white);
    }
  };

  return (
    <View style={[styles.container, defaultStyle.cardBorder]}>
      {image ? (
        <Image source={{ uri: image }} style={styles.image} />
      ) : (
        <Image
          source={require("../../assets/images/group-texture.png")}
          style={styles.image}
        />
      )}
      <TouchableOpacity
        onPress={() => {
          console.log('navigating to gropu_feed');
          navigation.navigate(routes.GROUP_FEED, {
            title,
            subTitle,
            image,
            privacy,
            groupId,
          });
        }}
      >
        <Text numberOfLines={1} style={styles.title}>
          {title}
        </Text>
        <Text numberOfLines={1} style={styles.subTitle}>
          {subTitle}
        </Text>
      </TouchableOpacity>
      <View style={styles.tabsContainer}>
        <Tab
          title={joinTitle}
          style={styles.tab}
          height={20}
          sizeRatio={resizeRatio}
          fontColor={joinTitleColor}
          color={joinBackGroundColor}
          width="45%"
          onPress={handleJoin}
        />
        <Tab
          title="View"
          style={styles.tab}
          height={20}
          sizeRatio={resizeRatio}
          color={colors.lighterGray}
          width="45%"
          fontColor={colors.dark}
          onPress={() => {
            navigation.navigate(routes.GROUP_FEED, {
              title,
              subTitle,
              image,
              privacy,
              groupId,
            });
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get("window").width / 3.4,
    height: 190,
    overflow: "hidden",
    marginRight: 7,
    marginTop: 10,
  },
  image: {
    width: "100%",
    height: "55%",
    // borderRadius: 10,
  },
  tabsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    top: 15,
  },
  tab: {
    borderRadius: 4,
    margin: 3,
    height: 17,
  },
  tabTitleStyle: {
    fontSize: 13,
  },
  title: {
    fontSize: 11,
    margin: 5,
  },
  subTitle: {
    fontSize: 10,
    color: colors.mediumGray,
    alignSelf: "flex-end",
    marginHorizontal: 5,
    overflow: "hidden",
  },

});
