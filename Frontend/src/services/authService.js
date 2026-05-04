import { loginAPI, signupAPI, logoutAPI } from '../api/auth.api';

const AuthService = {
  // signup user
  async signup(data) {
    const response = await signupAPI(data);
    return response;
  },

  // Login user
  async login(data) {
    const response = await loginAPI(data);
    return response;
  },
  async logout() {
    const response = await logoutAPI();
    return response;
  },

}

export default AuthService;