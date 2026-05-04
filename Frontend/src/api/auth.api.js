import {api} from './axios';
// Login API
export const loginAPI = async(data) => {
  const res = await api.post("/login", data);
  return res.data;
};
export const signupAPI = async(data) => {
  const res = await api.post("/signup", data);
  return res.data;
}
export const logoutAPI = async() => {
  const res = await api.post("/logout");
  return res.data;
}