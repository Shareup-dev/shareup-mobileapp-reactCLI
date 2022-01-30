import React, { useContext } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Alert,
  TouchableWithoutFeedback,
} from "react-native";
import { useSelector } from "react-redux";

import Screen from "../components/Screen";
import { Header, HeaderTitle } from "../components/headers";
import Icon from "../components/Icon";
import UserContext from "../UserContext";
import ListItem from "../components/lists/ListItem";
import FriendService from "../services/FriendService";
import store from "../redux/store";
import { sentRequestsActions } from "../redux/sentRequests";
import colors from "../config/colors";
import defaultStyles from "../config/styles";

export default function SentRequests({ navigation }) {
  const { user: loggedInUser } = useContext(UserContext);
  let sentto = useSelector((state) => state.sentRequests);

  const onCancelRequest = (friend) => {
    return Alert.alert(
      "Confirm",
      `Are you sure you want to cancel the friend request sent to ${friend.firstName} ?`,
      [
        {
          text: "Yes",
          onPress: () => {
            sentto = sentto.filter((dost) => dost.email !== friend.email);
            store.dispatch(sentRequestsActions.setList(sentto));

            FriendService.unsendRequest(loggedInUser.id, friend.id).then(
              (resp) => {
                console.log("unsend resp: ", resp.data);
              }
            );
          },
        },
        { text: "No" },
      ]
    );
  };

  const renderSentRequestsList = () => {
    if (sentto.length === 0) {
      return (
        <View style={styles.container}>
          <Text style={styles.emptyText}>
            You dont't have any sent requests
          </Text>
        </View>
      );
    } else {
      return (
        <View style={styles.container}>
          <FlatList
            contentContainerStyle={styles.groupsList}
            data={sentto}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <ListItem
                user={item}
                image={item.profilePicturePath}
                title={item.firstName}
                tabTitle={
                  sentto.filter((user) => user.email === item.email)[0]
                    ? "Request Sent"
                    : "Cancelled"
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
                subTitle="Sent"
                onPress={onCancelRequest}
                style={[defaultStyles.listItemStyle, defaultStyles.lightShadow]}
                displayLeft={true}
              />
            )}
          />
        </View>
      );
    }
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
        middle={<HeaderTitle>Pending Requests</HeaderTitle>}
      />
      {renderSentRequestsList()}
    </Screen>
  );
}

const styles = StyleSheet.create({
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
    paddingTop: 30,
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
});
