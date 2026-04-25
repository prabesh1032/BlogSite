import { useState } from "react";
import StateContext from "./StateContext";

export const ContextProvider = ({ children }) => {
  const [user, setUser] = useState({});
  const [token, _setToken] = useState(
    localStorage.getItem("Access_Token") || null
  );

  const setToken = (token) => {
    if (token) {
      _setToken(token);
      localStorage.setItem("Access_Token", token);
    } else {
      _setToken(null);
      localStorage.removeItem("Access_Token");
    }
  };

  return (
    <StateContext.Provider value={{ user, token, setUser, setToken }}>
      {children}
    </StateContext.Provider>
  );
};

export default ContextProvider;