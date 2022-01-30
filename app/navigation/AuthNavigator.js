import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import routes from "./routes";
import LoginScreen from "../screens/LoginScreen";
import SignUpScreen from "../screens/SignUpScreen";
import SignupStepTwo from "../screens/SignupStepTwo";

export default function App() {
  const Stack = createNativeStackNavigator();

  return (
    
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        gestureDirection: "horizontal",
      }}
      >
      <Stack.Screen name={routes.LOGIN} component={LoginScreen} />
      <Stack.Screen name={routes.SIGNUP} component={SignUpScreen} />
      <Stack.Screen name={routes.SIGNUP_STEP2} component={SignupStepTwo} />
    </Stack.Navigator>
  );
}
