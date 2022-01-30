import React, { useState, useContext } from "react";
import * as Yup from "yup";
import {
  ErrorMessage,
  Form,
  FormField,
  SubmitButton,
} from "../components/forms";
import { useSelector } from "react-redux";
import Toast from "react-native-toast-message";
import * as SecureStore from "expo-secure-store";

import { StyleSheet, TouchableOpacity, View } from "react-native";
import Text from "../components/Text";
import UserService from "../services/UserService";
import AuthServer from "../services/auth.services";
import Icon from "../components/Icon";
import FormRadio from "../components/forms/FormRadio";
import UserContext from "../UserContext";
import settings from "../config/settings";
import useIsReachable from "../hooks/useIsReachable";
import RegistrationContainer from "../components/forms/RegistrationContainer";

const SignupStepTwo = ({ navigation }) => {
  const [agreed, setagreed] = useState(false);
  const [registerFailed, setRegisterFailed] = useState(false);
  const [registerError, setRegisterError] = useState("");

  const { setloadingIndicator, setUser } = useContext(UserContext);

  const { isReachable, checkIfReachable } = useIsReachable();

  let stepOnceFromValues = useSelector((state) => state.registationSlice);

  const validationSchema = Yup.object().shape({
    password: Yup.string().required().min(3).label("Password"),
    gender: Yup.string().required(),
    confirmPassword: Yup.string()
      .required()
      .label("Re-Enter Password")
      .when("password", {
        is: (val) => (val && val.length > 0 ? true : false),
        then: Yup.string().oneOf(
          [Yup.ref("password")],
          "Both password need to be the same"
        ),
      }),
  });

  const handleSubmit = async (values) => {
    setloadingIndicator(true);
    const isReachable = await checkIfReachable(settings.apiUrl);

    if (isReachable === false) {
      setloadingIndicator(false);
      setRegisterError("Can't reach server please try later");
      return setRegisterFailed(true);
    }

    if (!agreed) {
      Toast.show({
        position: "bottom",
        visibilityTime: 5000,
        type: "error",
        text1: "Error",
        text2: "Please agree to the terms 👋",
      });
      setloadingIndicator(false);
      return;
    }

    const userCompleteData = { ...stepOnceFromValues, ...values };

    UserService.createUser(userCompleteData)
      .then((res) => {
        Toast.show({
          position: "bottom",
          visibilityTime: 5000,
          type: "success",
          text1: "Success",
          text2: "Registered Successfully 👋",
        });

        AuthServer.login(
          userCompleteData.email,
          userCompleteData.password
        ).then(async (res) => {
          UserService.getUserByEmail(userCompleteData.email);
          setUser(res.data);
          await SecureStore.setItemAsync("user", JSON.stringify(res.data));
        });
      })
      .catch((error) => {
        console.log("Error occurred while registering: ", error);
        setRegisterFailed(true);
        setRegisterError("User Already Exist");
      });
    setloadingIndicator(false);
  };

  return (
    <RegistrationContainer>
      <View style={styles.registerError}>
        <ErrorMessage error={registerError} visible={registerFailed} />
      </View>

      <Form
        initialValues={{
          password: "",
          confirmPassword: "",
          gender: "",
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        <FormRadio name="gender" style={[styles.formField, styles.formRadio]} />

        <FormField
          autoCorrect={false}
          name="password"
          placeholder="Password"
          secureTextEntry
          textContentType="password" // Only for ios
          style={styles.formField}
        />

        <FormField
          autoCorrect={false}
          name="confirmPassword"
          placeholder="Re-Enter Password"
          secureTextEntry
          textContentType="password" // Only for ios
          style={styles.formField}
        />

        <TouchableOpacity
          style={styles.agree}
          onPress={() => setagreed(!agreed)}
        >
          <Icon
            name={agreed ? "check-box" : "check-box-outline-blank"}
            type={"MaterialIcons"}
            size={30}
            backgroundSizeRatio={0.9}
            style={styles.checkIcon}
          />
          <Text>{"Agree to terms & conditions"}</Text>
        </TouchableOpacity>

        <SubmitButton title="Register" style={styles.submitButton} />
      </Form>
    </RegistrationContainer>
  );
};

const styles = StyleSheet.create({
  submitButton: {
    alignSelf: "center",
    width: "60%",
    justifyContent: "center",
    marginVertical: 20,
  },
  agree: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
  },
  checkIcon: {
    paddingRight: 5,
  },
  registerError: {
    alignItems: "center",
  },
  formField: {
    width: "90%",
    marginBottom: 5,
  },
  formRadio: {
    marginBottom: 20,
  },
});
export default SignupStepTwo;
