import { useState } from "react";
import { useAuth } from "@/hooks/context/AuthContext";
import { useCart } from "@/hooks/context/CartContext";
import { useSnackbar } from "@/hooks/context/SnackbarContext";
import { useNavigate } from "react-router";
import { WishlistStorage } from "@/services/favorites.service";
import Button from "@/components/Button";
import styles from "./BeerCard.module.scss";

const BeerCard = ({ beer, onCardClick, onWishlistChange }) => {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { showSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [addingToCart, setAddingToCart] = useState(false);

  const handleAddToCart = (e) => {
    e.stopPropagation();

    if (!user) {
      navigate("/login");
      return;
    }

    setAddingToCart(true);

    try {
      const result = addToCart(beer, 1);

      if (result.success) {
        showSnackbar(result.message || "Dodano u košaricu", "success");
      } else {
        showSnackbar("Greška pri dodavanju u košaricu", "error");
      }
    } catch (error) {
      showSnackbar("Greška pri dodavanju u košaricu", "error");
    } finally {
      setAddingToCart(false);
    }
  };

  const handleToggleFavorite = (e) => {
    e.stopPropagation();

    const isInWishlist = WishlistStorage.isInWishlist(beer._id);

    if (isInWishlist) {
      WishlistStorage.removeFromWishlist(beer._id);
      showSnackbar("Uklonjeno iz liste želja", "info");
    } else {
      WishlistStorage.addToWishlist(beer);
      showSnackbar("Dodano u listu želja", "success");
    }

    if (onWishlistChange) {
      onWishlistChange();
    }
  };

  const isInWishlist = WishlistStorage.isInWishlist(beer._id);

  return (
    <div className={styles.beerCard} onClick={() => onCardClick(beer)}>
      {beer.image_url && (
        <div className={styles.beerImage}>
          <img src={beer.image_url} alt={beer.name} />
        </div>
      )}
      <div className={styles.beerContent}>
        <div className={styles.header}>
          <h3>{beer.name}</h3>
          <button
            className={`${styles.favoriteBtn} ${isInWishlist ? styles.active : ""}`}
            onClick={handleToggleFavorite}
            aria-label={isInWishlist ? "Ukloni iz favorita" : "Dodaj u favorite"}
          >
            {isInWishlist ? "❤️" : "🤍"}
          </button>
        </div>
        <p className={styles.producer}>{beer.producer_name}</p>
        <div className={styles.beerDetails}>
          <span className={styles.type}>{beer.beer_type_name}</span>
          <span className={styles.alcohol}>{beer.alcohol_percentage}%</span>
        </div>
        {beer.description && (
          <p className={styles.description}>{beer.description}</p>
        )}
        <div className={styles.beerFooter}>
          <span className={styles.price}>
            {beer.price ? `€${beer.price.toFixed(2)}` : "N/A"}
          </span>
          {user ? (
            <Button
              variant="primary"
              onClick={handleAddToCart}
              disabled={addingToCart}
            >
              {addingToCart ? "Dodavanje..." : "U košaricu"}
            </Button>
          ) : (
            <Button variant="secondary" onClick={(e) => {
              e.stopPropagation();
              navigate("/login");
            }}>
              Prijavi se
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BeerCard;
