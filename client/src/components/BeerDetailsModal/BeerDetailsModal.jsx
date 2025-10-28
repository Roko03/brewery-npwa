import { useState } from "react";
import { useAuth } from "@/hooks/context/AuthContext";
import { useCart } from "@/hooks/context/CartContext";
import { useSnackbar } from "@/hooks/context/SnackbarContext";
import { useNavigate } from "react-router";
import { WishlistStorage } from "@/services/favorites.service";
import Close from "@/components/SvgIcons/Close";
import Modal from "@/components/Modal";
import Button from "@/components/Button";
import styles from "./BeerDetailsModal.module.scss";

const BeerDetailsModal = ({ beer, isOpen, onClose, onWishlistChange }) => {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { showSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [addingToCart, setAddingToCart] = useState(false);

  if (!beer) return null;

  const handleAddToCart = () => {
    if (!user) {
      navigate("/login");
      onClose();
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

  const handleToggleFavorite = () => {
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
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className={styles.modalContent}>
        <div className={styles.header}>
          <h2>{beer.name}</h2>
          <button
            type="button"
            onClick={onClose}
            className={styles.closeButton}
            aria-label="Zatvori"
          >
            <Close />
          </button>
        </div>
        <div className={styles.content}>
          {beer.image_url && (
            <div className={styles.imageSection}>
              <img src={beer.image_url} alt={beer.name} />
            </div>
          )}

          <div className={styles.detailsSection}>
            <div className={styles.infoRow}>
              <span className={styles.label}>Proizvođač:</span>
              <span className={styles.value}>{beer.producer_name}</span>
            </div>

            <div className={styles.infoRow}>
              <span className={styles.label}>Država:</span>
              <span className={styles.value}>
                {beer.producer_country || "N/A"}
              </span>
            </div>

            <div className={styles.infoRow}>
              <span className={styles.label}>Tip:</span>
              <span className={styles.value}>{beer.beer_type_name}</span>
            </div>

            <div className={styles.infoRow}>
              <span className={styles.label}>Boja:</span>
              <span className={styles.value}>{beer.beer_color_name}</span>
            </div>

            <div className={styles.infoRow}>
              <span className={styles.label}>Alkohol:</span>
              <span className={styles.value}>{beer.alcohol_percentage}%</span>
            </div>

            {beer.ibu && (
              <div className={styles.infoRow}>
                <span className={styles.label}>IBU:</span>
                <span className={styles.value}>{beer.ibu}</span>
              </div>
            )}

            {beer.volume_ml && (
              <div className={styles.infoRow}>
                <span className={styles.label}>Volumen:</span>
                <span className={styles.value}>{beer.volume_ml} ml</span>
              </div>
            )}

            {beer.description && (
              <div className={styles.description}>
                <span className={styles.label}>Opis:</span>
                <p>{beer.description}</p>
              </div>
            )}

            <div className={styles.priceSection}>
              <span className={styles.price}>
                {beer.price ? `€${beer.price.toFixed(2)}` : "N/A"}
              </span>
            </div>

            <div className={styles.actions}>
              <Button
                variant={isInWishlist ? "primary" : "secondary"}
                onClick={handleToggleFavorite}
              >
                {isInWishlist ? "❤️ U favoritima" : "🤍 Dodaj u favorite"}
              </Button>
              {user ? (
                <Button
                  variant="primary"
                  onClick={handleAddToCart}
                  disabled={addingToCart}
                >
                  {addingToCart ? "Dodavanje..." : "Dodaj u košaricu"}
                </Button>
              ) : (
                <Button
                  variant="secondary"
                  onClick={() => {
                    navigate("/login");
                    onClose();
                  }}
                >
                  Prijavi se za kupnju
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default BeerDetailsModal;
