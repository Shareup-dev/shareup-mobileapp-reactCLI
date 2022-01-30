import axios from "axios";
import settings from "../config/settings";
import AuthService from "./auth.services";

const baseUrl = `${settings.apiUrl}/api/v1/groups`;
let authAxios = null;

const authenticate = async () => {
  await AuthService.getCurrentUser().then(
    (res) => {
      authAxios = axios.create({
        baseURL: baseUrl,
        headers: {
          Authorization: `Bearer ${res.jwt}`,
          "Access-Control-Allow-Origin": "*",
        },
      });
    },
    (error) => {
      console.log(error);
    }
  );
};
authenticate();

class GroupService {
  createGroup = async (uid, formdata) => {
    try {
      const result = await authAxios.post(`/${uid}/create`, formdata);
      return result;
    } catch (error) {
      console.log("An error occured while creating group: ", error);
    }
  };

  createGroupPost = async (uid, groupDetails) => {
    try {
      const result = await authAxios.post(`/ ${uid} / create`, groupDetails);
      return result;
    } catch (error) {
      console.log("An error occured while creating group: ", error);
      return false;
    }
  };

  getAllGroups = async () => {
    authenticate();
    const result = await authAxios.get("");
    return result;
  };

  getGroupById = async (id) => {
    const result = await authAxios.get(`/ id / ${id}`);
    return result;
  };

  getGroupByCurrentUser = async (email) => {
    const result = await authAxios.get(`/ email / ${email}`);
    return result;
  };

  getGroupsPostsById = async (id) => {
    const result = await authAxios.get(`/posts/${id}`);
    return result;
  };
  getUserGroups = async (email) => {
    console.log(
      "Sending request to: ",
      `${settings.apiUrl}/api/v1/${email}/groups`
    );
    const result = await authAxios.get(
      `${settings.apiUrl}/api/v1/${email}/groups`
    );
    return result;
  };
  joinGroup = async (uid, gid) => {
    const result = await authAxios.post(`/${uid}/join/${gid}`);
    return result;
  };

  leaveGroup = async (uid, gid) => {
    const result = await authAxios.delete(`/ ${uid} / leave / ${gid}`);
    return result;
  };
}

export default new GroupService();

// fetch("https://shareup.digital/backend/api/v1/newsFeed", {
//   method: "GET",
//   headers: {
//     Authorization:
//       "Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhaGhzYW44N0BnbWFpbC5jb20iLCJpYXQiOjE2MzMzNDYxNjl9.IBsBu_7jDyI8_Lgxg8u_XnpmDtt1KlcNpjajkP4RW8w",
//   },
// }).then(async (resp) => {
//   let transformedData = await resp.json();
//   console.log('TransformedData: ',transformedData);
// });
