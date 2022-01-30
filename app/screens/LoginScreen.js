import * as Yup from "yup";
import React, { useContext, useState } from "react";
import { StyleSheet, View, PixelRatio } from "react-native";
import Toast from "react-native-toast-message";

import {
  ErrorMessage,
  Form,
  FormField,
  SubmitButton,
} from "../components/forms";
import AlternativeRegistrationContainer from "../components/AlternativeRegistrationContainer";
import AuthService from "../services/auth.services";
import LinkButton from "../components/buttons/LinkButton";
import Separator from "../components/Separator";
import UserContext from "../UserContext";
import UserService from "../services/UserService";
import colors from "../config/colors";
import routes from "../navigation/routes";
import * as SecureStore from "expo-secure-store";
import useIsReachable from "../hooks/useIsReachable";
import settings from "../config/settings";
import defaultStyles from "../config/styles";
import LoginContainer from "../components/forms/LoginContainer";

// determine all the rules for validating our form
const validationSchema = Yup.object().shape({
  email: Yup.string().required().email().label("Email"),
  password: Yup.string().required().min(3).label("Password"),
});

export default function LoginScreen({ navigation }) {
  const [loginFailed, setLoginFailed] = useState(false);
  const [error, setError] = useState("");
  const { isReachable, checkIfReachable } = useIsReachable();

  console.log("Is Reachable: ", isReachable);

  const { user, setUser, setloadingIndicator } = useContext(UserContext);

  const handleSubmit = async ({ email, password }) => {
    setloadingIndicator(true);

    const isReachable = await checkIfReachable(settings.apiUrl);

    if (isReachable === false) {
      setloadingIndicator(false);
      setError("Can't reach server please try later");
      return setLoginFailed(true);
    }

    const result = await AuthService.login(email, password);

    if (result.status !== 200) {
      setloadingIndicator(false);
      setError("Invalid email and/or password.");
      return setLoginFailed(true);
    }

    setloadingIndicator(false);
    Toast.show({
      position: "bottom",
      visibilityTime: 5000,
      type: "success",
      text1: "Success",
      text2: "Logged in Successfully 👋",
    });
    if (result.ok) return setLoginFailed(true);
    setLoginFailed(false);
    getUser(result.data.username);
    setloadingIndicator(false);
  };

  const getUser = async (email) => {
    await UserService.getUserByEmail(email).then(async (res) => {
      setUser(res.data);
      await SecureStore.setItemAsync("user", JSON.stringify(res.data));
    });
    // console.log("end getUser")
  };

  // ToDO: Fix the layout
  return (
    <LoginContainer>
      <Form
        initialValues={{ email: "", password: "" }}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
      >
        <ErrorMessage error={error} visible={loginFailed} />
        <FormField
          autoCapitalize="none"
          autoCorrect={false}
          icon="email"
          keyboardType="email-address"
          name="email"
          placeholder="Email Address"
          textContentType="emailAddress" // Only for ios
          style={defaultStyles.formField}
        />

        <FormField
          autoCapitalize="none"
          autoCorrect={false}
          icon="lock"
          name="password"
          placeholder="Password"
          secureTextEntry
          textContentType="password" // Only for ios
          style={defaultStyles.formField}
        />

        <SubmitButton title="Share in" style={styles.submitButton} />
        <AlternativeRegistrationContainer />

        <Separator text="or" style={styles.separator} />
        {/* added a comment here */}
        <View style={styles.thirdContainer}>
          <LinkButton
            title="Create new account?"
            style={styles.linkedButton}
            onPress={() => {
              navigation.navigate(routes.SIGNUP);
            }}
          />
        </View>
      </Form>
    </LoginContainer>
  );
}

const styles = StyleSheet.create({
  thirdContainer: {
    padding: PixelRatio.get() < 2.5 ? 0 : 20,
    alignItems: "center",
  },
  text: {
    fontWeight: "bold",
    color: colors.dimGray,
  },
  linkedButton: {
    margin: 10,
  },
  secondContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignContent: "center",
  },
  iconButton: {
    margin: 20,
  },
  separator: {
    paddingHorizontal: 20,
  },
  formField: {
    width: "90%",
    marginBottom: 5,
  },
  submitButton: {
    width: "60%",
    marginTop: PixelRatio.get() < 2.5 ? 7 : 20,
  },
});
