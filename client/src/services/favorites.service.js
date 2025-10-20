import { POST_REQUEST_PARAMETERS, DELETE_REQUEST_PARAMETERS } from "@/config/constants.config";

export default class FavoritesService {
  static getUserFavorites = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_WS_API_URL}/favorites`,
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

  static addFavorite = async (beerId) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_WS_API_URL}/favorites`,
        {
          ...POST_REQUEST_PARAMETERS,
          credentials: "include",
          body: JSON.stringify({ beer_id: beerId }),
        }
      );
      return await response.json();
    } catch (error) {
      return { success: false, error };
    }
  };

  static removeFavorite = async (favoriteId) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_WS_API_URL}/favorites/${favoriteId}`,
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

  static removeFavoriteByBeerId = async (beerId) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_WS_API_URL}/favorites/beer/${beerId}`,
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

  static checkFavorite = async (beerId) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_WS_API_URL}/favorites/check/${beerId}`,
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
}

// Local storage helpers for wishlist (client-side only backup)
export class WishlistStorage {
  static KEY = "brewery_wishlist";

  static getWishlist = () => {
    try {
      const wishlist = localStorage.getItem(WishlistStorage.KEY);
      return wishlist ? JSON.parse(wishlist) : [];
    } catch (error) {
      return [];
    }
  };

  static addToWishlist = (beer) => {
    try {
      const wishlist = WishlistStorage.getWishlist();
      const exists = wishlist.some((item) => item._id === beer._id);
      if (!exists) {
        wishlist.push(beer);
        localStorage.setItem(WishlistStorage.KEY, JSON.stringify(wishlist));
      }
      return wishlist;
    } catch (error) {
      return [];
    }
  };

  static removeFromWishlist = (beerId) => {
    try {
      const wishlist = WishlistStorage.getWishlist();
      const filtered = wishlist.filter((item) => item._id !== beerId);
      localStorage.setItem(WishlistStorage.KEY, JSON.stringify(filtered));
      return filtered;
    } catch (error) {
      return [];
    }
  };

  static isInWishlist = (beerId) => {
    try {
      const wishlist = WishlistStorage.getWishlist();
      return wishlist.some((item) => item._id === beerId);
    } catch (error) {
      return false;
    }
  };

  static clearWishlist = () => {
    localStorage.removeItem(WishlistStorage.KEY);
  };
}
