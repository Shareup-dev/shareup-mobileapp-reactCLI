import React from "react";
import { View, StyleSheet } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";

import GroupsScreen from "../screens/GroupsScreen";
import CreateNewGroup from "../screens/CreateNewGroup";
import InviteGroupMembers from "../screens/InviteGroupMembers";
import GroupFeed from "../screens/GroupFeedScreen";
import SetGroupPhoto from "../screens/SetGroupPhoto";
import routes from "./routes";

export default function GroupNavigator(props) {
  const Stack = createStackNavigator();

  return (
    <Stack.Navigator>
      <Stack.Screen
        name={routes.GROUPS}
        component={GroupsScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name={routes.GROUP_FEED}
        component={GroupFeed}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name={routes.CREATE_NEW_GROUP}
        component={CreateNewGroup}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name={routes.SET_GROUP_PHOTO}
        component={SetGroupPhoto}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name={routes.INVITE_GROUP_MEMBERS}
        component={InviteGroupMembers}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {},
});
