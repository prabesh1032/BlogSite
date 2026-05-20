import { createContext } from "react";

const StateContext = createContext({
  user: null,
  token: null,
  setUser: () => {},
  setToken: () => {},
});

export default StateContext;
