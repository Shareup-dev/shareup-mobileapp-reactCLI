import { createSlice } from "@reduxjs/toolkit";

const groupPostsSlice = createSlice({
  name: "groupPostsSlice",
  initialState: [],
  reducers: {
    setPosts: (oldPosts, newPost) => {
      // console.log('Setting posts to: ',newPost);
      return (oldPosts = newPost.payload);
    },
    removePost: () => {
      console.log("Removing group post");
    },
    getPosts: (state) => {
      return state;
    },
  },
});
export const groupPostsActions = groupPostsSlice.actions;
export default groupPostsSlice.reducer;
