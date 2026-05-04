import { useState } from "react";
import StateContext from "./StateContext";

export const ContextProvider = ({ children }) => {
  const [user, setUser] = useState({});
  const [token, _setToken] = useState(
    localStorage.getItem("ACCESS_TOKEN") || null
  );
  const setToken = (token) => {
    if (token) {
      _setToken(token);
      localStorage.setItem("ACCESS_TOKEN", token);
    } else {
      _setToken(null);
      localStorage.removeItem("ACCESS_TOKEN");
    }
  };

  return (
    <StateContext.Provider value={{ user, token, setUser, setToken }}>
      {children}
    </StateContext.Provider>
  );
};

export default ContextProvider;