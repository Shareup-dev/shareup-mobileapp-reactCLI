import AuthContext from "./context";
import JwtDecode from "jwt-decode";
import authStorage from "./storage";
import { useContext } from "react";
import * as SecureStore from "expo-secure-store";

export default useAuth = () => {
  const { user, setUser } = useContext(AuthContext);

  const logIn = (authToken) => {
    const user = JwtDecode(authToken);
    setUser(user);
    authStorage.storeToken(authToken);
  };

  const logOut = () => {
    setUser(null);
    authStorage.removeToken();
    console.log("logged out in useAuth");
    SecureStore.deleteItemAsync("user");
  };

  return { user, logIn, logOut };
};
