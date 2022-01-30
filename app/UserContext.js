import { createContext } from "react";

const UserContext = createContext({
  user: null,
  setUser: (user) => {
    console.log('storinguser in userCtx: ',user);
  },
});

export default UserContext;
