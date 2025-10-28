// Local storage for wishlist management
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
