import { POST_REQUEST_PARAMETERS, PUT_REQUEST_PARAMETERS, DELETE_REQUEST_PARAMETERS } from "@/config/constants.config";

export default class BeerService {
  static getAllBeers = async (params = {}) => {
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await fetch(
        `${import.meta.env.VITE_WS_API_URL}/beer${queryString ? `?${queryString}` : ""}`,
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

  static getBeer = async (id) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_WS_API_URL}/beer/${id}`,
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

  static createBeer = async (data) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_WS_API_URL}/beer`,
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

  static updateBeer = async (id, data) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_WS_API_URL}/beer/${id}`,
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

  static deleteBeer = async (id) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_WS_API_URL}/beer/${id}`,
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
}
