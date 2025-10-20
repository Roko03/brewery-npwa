import { POST_REQUEST_PARAMETERS, PUT_REQUEST_PARAMETERS, DELETE_REQUEST_PARAMETERS } from "@/config/constants.config";

export default class BeerTypeService {
  static getAllBeerTypes = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_WS_API_URL}/beer-type`,
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

  static getBeerType = async (id) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_WS_API_URL}/beer-type/${id}`,
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

  static createBeerType = async (data) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_WS_API_URL}/beer-type`,
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

  static updateBeerType = async (id, data) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_WS_API_URL}/beer-type/${id}`,
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

  static deleteBeerType = async (id) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_WS_API_URL}/beer-type/${id}`,
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
