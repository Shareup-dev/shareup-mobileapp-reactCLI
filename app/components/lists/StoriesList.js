import React from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { useSelector } from "react-redux";
import CreateStoryCard from "./CreateStoryCard";
import StoryCard from "./StoryCard";

export default function StoriesList({ navigation, style }) {
  let stories = useSelector((state) => state.stories);
  return (
    <View style={[styles.container, style]}>
      <CreateStoryCard navigation={navigation} />
      <FlatList
        data={stories}
        horizontal={true}
        keyExtractor={(item) => item.id.toString()}
        style={styles.list}
        renderItem={(item) => {
          return (
            <StoryCard
              image={item.item.storiesImagePath}
              navigation={navigation}
              userName={
                item.item.user.firstName + " " + item.item.user.lastName
              }
            />
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginLeft: 10,
    marginBottom: 15,
  },
});
