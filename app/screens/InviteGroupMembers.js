import React, { useContext, useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  FlatList,
  TouchableWithoutFeedback,
} from "react-native";

import Screen from "../components/Screen";
import TextField from "../components/TextField";
import Tab from "../components/buttons/Tab";
import Separator from "../components/Separator";
import ListItem from "../components/lists/ListItem";
import defaultStyles from "../config/styles";
import ListHeader from "../components/lists/ListHeader";
import colors from "../config/colors";
import { HeaderWithBackArrow } from "../components/headers";
import UserProfilePicture from "../components/UserProfilePicture";
import routes from "../navigation/routes";
import UserContext from "../UserContext";
import UserService from "../services/UserService";
import FriendService from "../services/FriendService";
import GroupService from "../services/GroupService";
import Icon from "../components/Icon";
import AppButton from "../components/buttons/Button";
import { Header, HeaderTitle } from "../components/headers";

const InviteGroupMembers = ({ navigation, route }) => {
  const [users, setusers] = useState([]);
  const [invitedTo, setinvitedTo] = useState([]);
  const { user: loggedInUser } = useContext(UserContext);
  useEffect(() => {
    UserService.getUsers().then((resp) => {
      let allUsers = resp.data.filter(
        (person) => person.id !== loggedInUser.id
      );
      setusers(allUsers);
    });
  }, []);
  const onAddMember = (member) => {
    if (
      invitedTo.filter((invitedMember) => member.id === invitedMember.id)[0]
    ) {
      return;
    }
    GroupService.joinGroup(member.id, route.params.groupId).then((resp) => {
    });
    setinvitedTo((previouslyInvited) => {
      return [...previouslyInvited, member];
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
        middle={<HeaderTitle>Add People</HeaderTitle>}
      />
      <FlatList
        contentContainerStyle={styles.groupsList}
        ListHeaderComponent={() => (
          <ListHeader
            containerStyle={{
              // backgroundColor: 'coral',
              justifyContent: "flex-start",
              alignItems: "flex-start",
              paddingHorizontal: 40,
              marginTop: -10,
            }}
            subtitle="Add new friends to know more about them"
          />
        )}
        data={users}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ListItem
            user={item}
            image={item.profilePicturePath}
            title={item.firstName}
            tabTitle={
              invitedTo.filter((user) => user.email === item.email)[0]
                ? "Added"
                : "Add"
            }
            color={
              invitedTo.filter((user) => user.email === item.email)[0]
                ? colors.iondigoDye
                : colors.lighterGray
            }
            fontColor={
              invitedTo.filter((user) => user.email === item.email)[0]
                ? colors.white
                : colors.dark
            }
            subTitle="Recommended"
            onPress={onAddMember}
            style={[styles.listItem, defaultStyles.lightShadow]}
            displayLeft={true}
          />
        )}
      />
      <View style={[defaultStyles.row, { justifyContent: "center" }]}>
        {route.params.newGroup && (
          <AppButton
            onPress={() => {
              navigation.navigate(routes.GROUP_FEED, {
                title: route.params.groupInfo.name,
                privacy: route.params.groupInfo.privacySetting,
                description: route.params.groupInfo.description,
                groupId: route.params.groupId,
                image: route.params.groupCoverPath,
              });
            }}
            title={"Finish"}
            width={"50%"}
          />
        )}
      </View>
    </Screen>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
  },
  searchContainer: {
    paddingHorizontal: 30,
  },
  tabs: {
    marginVertical: 5,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  searchbar: {
    marginBottom: 10,
  },
  tab: {
    marginRight: 10,
    width: "30%",
    height: 30,
  },
  separator: {
    backgroundColor: colors.LightGray,
    marginTop: 20,
  },
  groupsList: { paddingTop: 20 },
  listItem: {
    marginBottom: 13,
    marginHorizontal: 28,
    borderRadius: 10,
    backgroundColor: colors.white,
  },
  noFriendsContainer: {
    marginTop: 125,
    alignItems: "center",
  },
  noFriendsText: {
    fontSize: 25,
    marginBottom: 25,
  },
  addFriendsButton: {
    backgroundColor: colors.LightGray,
    padding: 12,
    paddingHorizontal: 40,
    borderRadius: 7,
  },

  emptyText: {
    textAlign: "center",
    marginTop: 150,
    fontSize: 18,
  },
  shadowBox: {
    backgroundColor: "coral",
    height: 50,
    shadowColor: "red",
  },
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: "white",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
  },
  subTitle: {
    fontSize: 12,
  },
  friendCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
    borderWidth: 0,
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  recommendation: {
    display: "flex",
    flexDirection: "column",
  },
  dp: {
    height: 56,
    width: 56,
    marginRight: 20,
  },
  name: {
    fontSize: 16,
    color: colors.dark,
    fontWeight: "700",
  },
  actions: {
    flexDirection: "row",
    flex: 1,
    alignItems: "center",
    justifyContent: "space-around",
  },
  requestBtn: {
    paddingHorizontal: 1,
    padding: 1,
    borderRadius: 6,
    shadowColor: "red",
    elevation: 0,
    height: 35,
  },
  listItem: {
    marginBottom: 13,
    marginHorizontal: 28,
    borderRadius: 10,
    backgroundColor: colors.white,
  },
});
export default InviteGroupMembers;
