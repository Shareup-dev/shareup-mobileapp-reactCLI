import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, Text, View, FlatList, Image } from "react-native";

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
import store from "../redux/store";
import { sentRequestsActions } from "../redux/sentRequests";
import { useSelector } from "react-redux";
import Toast from "react-native-toast-message";

export default function ActivityScreen({ navigation }) {
  const [users, setusers] = useState([]);
  const [sentto, setSentto] = useState([]);
  const { user: loggedInUser } = useContext(UserContext);
  let alreadySentTo = useSelector((state) => state.sentRequests);

  useEffect(() => {
    UserService.getUsers().then((resp) => {
      let allUsers = resp.data.filter(
        (person) => person.id !== loggedInUser.id
      );

      UserService.getFriendRequestSent(loggedInUser.email).then((resp) => {
        let sentRequests = resp.data;
        store.dispatch(sentRequestsActions.setList(sentRequests));
        let differedReqs = allUsers.filter(
          ({ id: id1 }) => !sentRequests.some(({ id: id2 }) => id2 === id1)
        );

        differedReqs.forEach((user) => {});
        setusers(differedReqs);
      });
    });
  }, []);
  const onSendRequest = (recievedUser) => {
    console.log("user received in ActivityScreen: ", recievedUser.firstName);
    if (!recievedUser.firstName) {
      return;
    }
    if (sentto.filter((user) => user.email === recievedUser.email)[0]) {
      console.log("already sent to this user");
      Toast.show({
        position: "bottom",
        visibilityTime: 5000,
        type: "error",
        text1: "Error",
        text2: "Already sent to this user",
      });
      return;
    }
    setSentto((previousState) => {
      return [...previousState, recievedUser];
    });
    store.dispatch(
      sentRequestsActions.setList([...alreadySentTo, recievedUser])
    );
    FriendService.sendRequest(loggedInUser.id, recievedUser.id).then((resp) => {
      console.log("Sent");
    });
  };

  return (
    <Screen>
      <HeaderWithBackArrow
        onBackButton={() => navigation.navigate(routes.FEED)}
        title="Activity"
        rightComponent={<UserProfilePicture size={35} />}
      />
      <View style={styles.searchContainer}>
        <TextField
          placeholder="Search Friends"
          iconName="search1"
          iconType="AntDesign"
          style={styles.searchbar}
        />

        <View style={styles.tabs}>
          <Tab
            title="Requests"
            onPress={() => {
              navigation.navigate(routes.RECEIVED_REQUESTS);
            }}
            style={styles.tab}
            sizeRatio={0.8}
          />
          <Tab
            title="All Friends"
            style={styles.tab}
            sizeRatio={0.8}
            onPress={() => {
              navigation.navigate(routes.ALL_FRIENDS);
            }}
          />
          <Tab
            title="Sent Requests"
            style={styles.tab}
            sizeRatio={0.8}
            onPress={() => {
              navigation.navigate(routes.SENT_REQUESTS);
            }}
          />
        </View>
      </View>

      <Separator style={styles.separator} />

      <FlatList
        contentContainerStyle={styles.groupsList}
        ListHeaderComponent={() => (
          <ListHeader
            title="There no activity yet !"
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
              sentto.filter((user) => user.email === item.email)[0]
                ? "Sent"
                : "Send Request"
            }
            color={
              sentto.filter((user) => user.email === item.email)[0]
                ? colors.iondigoDye
                : colors.lighterGray
            }
            fontColor={
              sentto.filter((user) => user.email === item.email)[0]
                ? colors.white
                : colors.dark
            }
            subTitle="Recommended"
            onPress={onSendRequest}
            style={[defaultStyles.listItemStyle, defaultStyles.lightShadow]}
            displayLeft={true}
          />
        )}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
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
