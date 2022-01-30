import React from "react";
import { StyleSheet, View } from "react-native";
import { useFormikContext } from "formik";

import Button from "../buttons/Button";

export default function SubmitButton({ title, style }) {
  const { handleSubmit } = useFormikContext();
  return (
    <View style={style}>
      <Button title={title} onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({});
