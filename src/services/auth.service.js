import {
  POST_REQUEST_PARAMETERS,
  authHeaders,
} from "@/config/constants.config";

export default class AuthServices {
  static register = async (data) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_WS_API_URL}/auth/register`,
        {
          ...POST_REQUEST_PARAMETERS,
          body: JSON.stringify(data),
        }
      );
      console.log(response);
      return await response.json();
    } catch (error) {
      return error;
    }
  };

  static login = async (data) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_WS_API_URL}/auth/login`,
        {
          ...POST_REQUEST_PARAMETERS,
          credentials: "include",
          body: JSON.stringify(data),
        }
      );
      return await response.json();
    } catch (error) {
      return error;
    }
  };

  static logout = async (data) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_WS_API_URL}/auth/logout`,
        {
          ...POST_REQUEST_PARAMETERS,
          credentials: "include",
          body: JSON.stringify(data),
        }
      );
      return await response.json();
    } catch (error) {
      return error;
    }
  };
}
