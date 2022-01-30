import React, { useEffect, useState } from "react";
import { View, StyleSheet, FlatList, Text } from "react-native";
import GroupService from "../../services/GroupService";
import fileStorage from "../../config/fileStorage";

import GroupJoinCard from "./GroupJoinCard";
import { userGroupActions } from "../../redux/userGroups";
import store from "../../redux/store";
import colors from "../../config/colors";

export default function JoinGroupList({ props, navigation }) {
  const [allGroups, setallGroups] = useState([]);
  useEffect(() => {
    let unmounted = false;
    GroupService.getAllGroups().then((resp) => {
      if (!unmounted) {
        setallGroups((previousGroups) => {
          return [...resp.data];
        });
        store.dispatch(userGroupActions.setGroups([...resp.data]));
      }
    });
    return () => {
      unmounted = true;
    };
  }, []);
  return (
    <View style={styles.container}>
      {allGroups.length !== 0 && (
        <Text style={styles.suggestedGroupsText}>Suggested Groups</Text>
      )}
      <FlatList
        horizontal
        data={allGroups}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <GroupJoinCard
            title={item.name}
            subTitle={item.description}
            navigation={navigation}
            groupId={item.id}
            privacy={item.privacySetting}
            image={
              item.groupCoverPath
                ? `${fileStorage.baseUrl}${item.groupCoverPath}`
                : null
            }
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  suggestedGroupsText: {
    color: colors.mediumGray,
  },
});
