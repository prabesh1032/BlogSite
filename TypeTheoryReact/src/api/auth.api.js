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
export const updateProfileAPI = async(payload) => {
  const res = await api.put('/user/profile', payload);
  return res.data;
}
export const getUserProfileAPI = async() => {
  const res = await api.get('/user/profile');
  return res.data;
}