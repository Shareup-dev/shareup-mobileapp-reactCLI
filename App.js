import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  ActivityIndicator,
  Text,
  View,
  Dimensions,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import store from "./app/redux/store";
import { Provider, useDispatch } from "react-redux";
import AppLoading from "expo-app-loading";
import { AppNavigator, AuthNavigator } from "./app/navigation";
import UserContext from "./app/UserContext";
import colors from "./app/config/colors";
import * as SecureStore from "expo-secure-store";
import { loggedInUserActions } from "./app/redux/loggedInUser";
import OfflineNotice from "./app/components/OfflineNotice";
import Toast from "react-native-toast-message";
import TestScreen from "./app/screens/TestScreen";
import HomeNavigator from "./app/navigation/HomeNavigator";

export default function App() {
  const [authChecking, setauthChecking] = useState(true);
  const [loadingIndicator, setloadingIndicator] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    SecureStore.getItemAsync("user").then((user) => {
      if (user) {
        setUser(JSON.parse(user));
        store.dispatch(loggedInUserActions.setUser(JSON.parse(user)));
      }
      setauthChecking(false);
    });
  }, []);

  if (authChecking) {
    return <AppLoading />;
  } else {
    return (
      // <TestScreen />
      <UserContext.Provider
        value={{ user, setUser, setloadingIndicator, loadingIndicator }}
      >
        <Provider store={store}>
          <OfflineNotice />
          <NavigationContainer>
            {loadingIndicator && (
              <View style={styles.loadingOverlay}>
                <ActivityIndicator
                  style={styles.gobalLoadingIndicator}
                  size="large"
                  color="#044566"
                />
              </View>
            )}
            {user ? <HomeNavigator /> : <AuthNavigator />}
          </NavigationContainer>
          <Toast ref={(ref) => Toast.setRef(ref)} />
        </Provider>
      </UserContext.Provider>
    );
  }
}

const styles = StyleSheet.create({
  loadingOverlay: {
    flex: 1,
    position: "absolute",
    zIndex: 1,
    elevation: 1,
    // backgroundColor: 'coral',
    opacity: 1,
    height: Dimensions.get("screen").height,
    width: Dimensions.get("screen").width,
    alignContent: "center",
    justifyContent: "center",
  },
  listItem: {
    borderRadius: 10,
    backgroundColor: colors.white,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 6,
  },
});

// Testing branch protections
