import { useEffect, useState } from "react";
import StateContext from "./StateContext";
import AuthService from "../services/authService";

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

  useEffect(() => {
    const syncUserProfile = async () => {
      if (!token) {
        return;
      }

      try {
        const me = await AuthService.getUserProfile();
        const currentUser = me.user || {};

        if (me.profile) {
          currentUser.phone = me.profile.phone ?? currentUser.phone;
          currentUser.bio = me.profile.bio ?? currentUser.bio;
          currentUser.profile_picture = me.profile.profile_pic
            ? `${import.meta.env.VITE_APP_API_BASE_URL}/storage/${me.profile.profile_pic}`
            : currentUser.profile_picture;
        }

        setUser(currentUser);
      } catch {
        setUser({});
      }
    };

    syncUserProfile();
  }, [token]);

  return (
    <StateContext.Provider value={{ user, token, setUser, setToken }}>
      {children}
    </StateContext.Provider>
  );
};

export default ContextProvider;