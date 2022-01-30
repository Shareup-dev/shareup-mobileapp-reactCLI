import React, { useContext, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Image,
} from "react-native";

import Screen from "../components/Screen";
import Icon from "../components/Icon";
import TextField from "../components/TextField";
import Tab from "../components/buttons/Tab";
import Text from "../components/Text";
import colors from "../config/colors";
import LongCard from "../components/lists/LongCard";
import defaultStyles from "../config/styles";
import ListHeader from "../components/lists/ListHeader";
import { HeaderWithBackArrow } from "../components/headers";
import routes from "../navigation/routes";
import GroupService from "../services/GroupService";
import fileStorage from "../config/fileStorage";
import UserContext from "../UserContext";
import { useSelector } from "react-redux";

export default function GroupsScreen({ navigation }) {
  // const [allGroups, setallGroups] = useState([]);
  const [userGroups, setuserGroups] = useState([]);
  const { user: loggedInUser } = useContext(UserContext);
  let allGroups = useSelector((state) => state.userGroups);
  // useEffect(() => {
  //   let unmounted = false;
  //   GroupService.getAllGroups().then((resp) => {
  //     if (!unmounted) {
  //       setallGroups(resp.data);
  //     }
  //   });
  //   GroupService.getUserGroups(loggedInUser.email).then((resp) => {
  //     setuserGroups(resp.data);
  //   });
  //   return () => {
  //     unmounted = true;
  //   };
  // }, []);
  return (
    <Screen style={styles.container}>
      <HeaderWithBackArrow
        onBackButton={() => navigation.navigate(routes.FEED)}
        component={
          <TextField
            placeholder="Search Groups"
            iconName="search1"
            iconType="AntDesign"
            style={styles.searchbar}
          />
        }
      />

      <View style={styles.optionsBar}>
        <Tab
          title="Create New"
          style={styles.tab}
          iconName="pluscircle"
          iconType="AntDesign"
          iconColor="black"
          iconSize={17}
          titleStyle={styles.tabTitle}
          onPress={() => {
            navigation.navigate(routes.CREATE_NEW_GROUP);
          }}
        />
        <Tab
          title="Your groups"
          style={styles.tab}
          iconImage={require("../assets/icons/foundation_social-skillshare.png")}
          iconSize={22}
          titleStyle={styles.tabTitle}
        />
        <Tab
          title="Categories"
          style={styles.tab}
          iconName="list"
          iconType="Feather"
          iconSize={18}
          titleStyle={styles.tabTitle}
        />
      </View>

      <View style={styles.separator} />

      <FlatList
        contentContainerStyle={defaultStyles.listContentContainerStyle}
        ListHeaderComponent={() => (
          <ListHeader
            containerStyle={{ width: Dimensions.get("screen").width }}
            title="There no activity yet !"
            subtitle="Join new Groups to know more about them"
          />
        )}
        data={allGroups}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => {
              navigation.navigate(routes.GROUP_FEED, {
                title: item.name,
                subTitle: item.description,
                image: item.groupCoverPath
                  ? fileStorage.baseUrl + item.groupCoverPath
                  : null,
                privacy: item.privacySetting,
                groupId: item.id,
              });
            }}
          >
            <LongCard
              style={defaultStyles.longCard}
              title={item.name}
              subTitle={item.privacySetting}
              image={
                item.groupCoverPath
                  ? fileStorage.baseUrl + item.groupCoverPath
                  : null
              }
              navigation={navigation}
            />
          </TouchableOpacity>
        )}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
  },
  searchbar: {
    width: "90%",
    marginLeft: 10,
  },
  searchText: {
    width: "75%",
  },
  optionsBar: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  tab: {
    width: "31%",
    height: 30,
    marginHorizontal: 2.5,
    marginTop: 5,
  },
  tabTitle: {
    fontSize: 12,
  },
  addGroupsContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
  fancyAddButton: {
    margin: 5,
  },
  smallerFont: {
    marginLeft: 20,
    fontSize: 15,
  },
  separator: {
    backgroundColor: colors.LightGray,
    width: "100%",
    height: 10,
    marginTop: 15,
  },
  groupsContainer: {
    paddingTop: 30,
    justifyContent: "center",
  },
  yourGroupsTitle: {
    fontSize: 20,
    marginBottom: 10,
  },
  joinGroupThumbnail: {
    width: 65,
    height: 65,
    marginRight: 10,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: colors.lighterGray,
  },
});
