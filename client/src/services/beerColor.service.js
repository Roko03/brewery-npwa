import { POST_REQUEST_PARAMETERS, PUT_REQUEST_PARAMETERS, DELETE_REQUEST_PARAMETERS } from "@/config/constants.config";

export default class BeerColorService {
  static getAllBeerColors = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_WS_API_URL}/beer-color`,
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

  static getBeerColor = async (id) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_WS_API_URL}/beer-color/${id}`,
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

  static createBeerColor = async (data) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_WS_API_URL}/beer-color`,
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

  static updateBeerColor = async (id, data) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_WS_API_URL}/beer-color/${id}`,
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

  static deleteBeerColor = async (id) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_WS_API_URL}/beer-color/${id}`,
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
