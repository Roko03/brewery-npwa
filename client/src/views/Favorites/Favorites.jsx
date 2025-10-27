import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { WishlistStorage } from "@/services/favorites.service";
import { useSnackbar } from "@/hooks/context/SnackbarContext";
import Button from "@/components/Button";
import Layout from "@/components/Layout";
import styles from "./Favorites.module.scss";

const Favorites = () => {
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = () => {
    const wishlist = WishlistStorage.getWishlist();
    setFavorites(wishlist);
  };

  const handleRemove = (beerId) => {
    WishlistStorage.removeFromWishlist(beerId);
    showSnackbar("Uklonjeno iz liste želja", "info");
    loadFavorites();
  };

  const handleClearAll = () => {
    if (window.confirm("Jeste li sigurni da želite isprazniti listu želja?")) {
      WishlistStorage.clearWishlist();
      showSnackbar("Lista želja je ispražnjena", "info");
      loadFavorites();
    }
  };

  if (favorites.length === 0) {
    return (
      <div className={styles.favorites}>
        <div className={styles.container}>
          <header className={styles.header}>
            <h1>Lista Želja</h1>
            <Button variant="secondary" onClick={() => navigate("/beers")}>
              Natrag na piva
            </Button>
          </header>

          <div className={styles.empty}>
            <div className={styles.emptyIcon}>🤍</div>
            <h2>Vaša lista želja je prazna</h2>
            <p>Dodajte piva u listu želja kako biste ih kasnije pregledali</p>
            <Button variant="primary" onClick={() => navigate("/beers")}>
              Pregledaj piva
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Layout>
      <div className={styles.favorites}>
        <div className={styles.container}>
          <header className={styles.header}>
            <div>
              <h1>Lista Želja</h1>
              <p>
                {favorites.length} {favorites.length === 1 ? "pivo" : "piva"}
              </p>
            </div>
            <div className={styles.headerActions}>
              <Button variant="secondary" onClick={() => navigate("/beers")}>
                Natrag
              </Button>
              <Button variant="secondary" onClick={handleClearAll}>
                Isprazni sve
              </Button>
            </div>
          </header>

          <div className={styles.grid}>
            {favorites.map((beer) => (
              <div key={beer._id} className={styles.card}>
                {beer.image_url && (
                  <div className={styles.imageContainer}>
                    <img src={beer.image_url} alt={beer.name} />
                  </div>
                )}
                <div className={styles.content}>
                  <h3>{beer.name}</h3>
                  <div className={styles.details}>
                    <p className={styles.producer}>
                      <strong>Proizvođač:</strong> {beer.producer_name || "-"}
                    </p>
                    <p className={styles.type}>
                      <strong>Tip:</strong> {beer.beer_type_name || "-"}
                    </p>
                    <p className={styles.alcohol}>
                      <strong>Alkohol:</strong> {beer.alcohol_percentage}%
                    </p>
                    {beer.price && (
                      <p className={styles.price}>
                        <strong>Cijena:</strong> €{beer.price.toFixed(2)}
                      </p>
                    )}
                  </div>
                  {beer.description && (
                    <p className={styles.description}>{beer.description}</p>
                  )}
                  <Button
                    variant="secondary"
                    onClick={() => handleRemove(beer._id)}
                    fullWidth
                  >
                    Ukloni iz liste
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Favorites;
