import axios from "axios";
// import sessionStorage from '../Storage.jsx';
import AsyncStorage from "@react-native-async-storage/async-storage";
import settings from "../config/settings";

const url = `${settings.apiUrl}/api/v1/users`;
let authAxios = null;

// =======================================
// localStorage is now AsyncStorage
// =======================================

class AuthService {
  login = async (username, password) => {
    return await axios
      .post(url + "/authenticate", {
        username,
        password,
      })
      .then(async (response) => {
        if (response.data.jwt) {
          try {
            const user = JSON.stringify(response.data);
            AsyncStorage.setItem("user", user);
          } catch (error) {
            console.log("Error saving data: " + error);
          }
        }
        return response;
      })
      .catch((error) => {
        return error;
      });
  };

  // logout() {
  //     localStorage.removeItem("user");
  // }

  // register(username, email, password){
  //     return axios.post()
  // }

  // getCurrentUser = () => sessionStorage.getItem("user") ? JSON.parse(sessionStorage.getItem("jwtUser")) : null

  getCurrentUser = async () => {
    try {
      const user = await AsyncStorage.getItem("user");
      if (user !== null) {
        // console.log("This is the user: " + user);
        let token = await JSON.parse(user);
        // console.log(token);
        return token;
      } else {
        return null;
      }
    } catch (error) {
      console.log("Error retrieving data");
    }

    // const user = await AsyncStorage.getItem('user')
    // console.log("This is the user: " + user + " + 1")
    // return user != "undefined" ? JSON.parse(user) : '';

    // return "Hello"
    // AsyncStorage.getItem("user") != "undefined" ? JSON.parse(AsyncStorage.getItem("user")) : ""
  };

  // isLoggedIn = () => this.getCurrentUser() ? true : false

  // setCurrentUser(data){
  //     localStorage.setItem("user", JSON.stringify(data));
  // }

  setCurrentUser(data) {
    try {
      const user = JSON.stringify(data);
      AsyncStorage.setItem("user", user);
    } catch (error) {
      console.log("Error saving data: " + error);
    }
  }
}

export default new AuthService();
