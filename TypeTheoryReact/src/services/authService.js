import { loginAPI, signupAPI, logoutAPI, updateProfileAPI, getUserProfileAPI } from '../api/auth.api';

const AuthService = {
  // signup user
  async signup(data) {
    const response = await signupAPI(data);
    console.log(response);
    return response;
  },

  // Login user
  async login(data) {
    const response = await loginAPI(data);
    console.log(response);
    return response;
  },
  
  // Logout user
  async logout() {
    const response = await logoutAPI();
    return response;
  },
  
  // Update user profile
  async updateProfile(data) {
    const response = await updateProfileAPI(data);
    return response;
  },
  async getUserProfile() {
    const response = await getUserProfileAPI();
    return response;
  },

}

export default AuthService;