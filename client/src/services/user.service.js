import {
  POST_REQUEST_PARAMETERS,
  PUT_REQUEST_PARAMETERS,
  DELETE_REQUEST_PARAMETERS,
} from "@/config/constants.config";

export default class UserService {
  static getAllUsers = async (params = {}) => {
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await fetch(
        `${import.meta.env.VITE_WS_API_URL}/users${queryString ? `?${queryString}` : ""}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
          credentials: "include",
        }
      );
      return await response.json();
    } catch (error) {
      return { success: false, error };
    }
  };

  static getUser = async (id) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_WS_API_URL}/users/${id}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
          credentials: "include",
        }
      );
      return await response.json();
    } catch (error) {
      return { success: false, error };
    }
  };

  static createUser = async (data) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_WS_API_URL}/users`,
        {
          ...POST_REQUEST_PARAMETERS,
          credentials: "include",
          body: JSON.stringify(data),
        }
      );
      return await response.json();
    } catch (error) {
      return { success: false, error };
    }
  };

  static updateUser = async (id, data) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_WS_API_URL}/users/${id}`,
        {
          ...PUT_REQUEST_PARAMETERS,
          credentials: "include",
          body: JSON.stringify(data),
        }
      );
      return await response.json();
    } catch (error) {
      return { success: false, error };
    }
  };

  static deleteUser = async (id) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_WS_API_URL}/users/${id}`,
        {
          ...DELETE_REQUEST_PARAMETERS,
          credentials: "include",
        }
      );
      return await response.json();
    } catch (error) {
      return { success: false, error };
    }
  };

  static changePassword = async (id, data) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_WS_API_URL}/users/${id}/change-password`,
        {
          ...PUT_REQUEST_PARAMETERS,
          credentials: "include",
          body: JSON.stringify(data),
        }
      );
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Greška pri promjeni lozinke");
      }
      return result;
    } catch (error) {
      throw error;
    }
  };
}
