import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/hooks/context/AuthContext";
import { useCart } from "@/hooks/context/CartContext";
import { useSnackbar } from "@/hooks/context/SnackbarContext";
import BeerService from "@/services/beer.service";
import BeerTypeService from "@/services/beerType.service";
import BeerColorService from "@/services/beerColor.service";
import ProducerService from "@/services/producer.service";
import { WishlistStorage } from "@/services/wishlist.service";
import Button from "@/components/Button";
import Pagination from "@/components/Pagination";
import Layout from "@/components/Layout";
import styles from "./Home.module.scss";

const Home = () => {
  const { user, loading: authLoading } = useAuth();
  const { addToCart } = useCart();
  const { showSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [beers, setBeers] = useState([]);
  const [producers, setProducers] = useState([]);
  const [beerTypes, setBeerTypes] = useState([]);
  const [beerColors, setBeerColors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState({});
  const [wishlist, setWishlist] = useState([]);

  const pageSize = 12;
  const currentPage = parseInt(searchParams.get("page") || "0", 10);
  const [totalCount, setTotalCount] = useState(0);
  const filters = {
    producer: searchParams.get("producer") || "",
    type: searchParams.get("type") || "",
    color: searchParams.get("color") || "",
  };

  useEffect(() => {
    fetchInitialData();
    loadWishlist();
  }, []);

  useEffect(() => {
    fetchBeers();
  }, [searchParams]);

  const loadWishlist = () => {
    const wishlistData = WishlistStorage.getWishlist();
    setWishlist(wishlistData);
  };

  const fetchInitialData = async () => {
    try {
      const [producersRes, typesRes, colorsRes] = await Promise.all([
        ProducerService.getAllProducers({ pageSize: 1000 }),
        BeerTypeService.getAllBeerTypes(),
        BeerColorService.getAllBeerColors(),
      ]);

      if (producersRes.entities) setProducers(producersRes.entities);
      if (typesRes.entities) setBeerTypes(typesRes.entities);
      if (colorsRes.entities) setBeerColors(colorsRes.entities);
    } catch (error) {
      console.error("Error fetching filter data:", error);
    }
  };

  const fetchBeers = async () => {
    try {
      setLoading(true);
      const params = {
        pageNumber: currentPage,
        pageSize: pageSize,
        ...filters,
      };

      Object.keys(params).forEach((key) => {
        if (params[key] === "") delete params[key];
      });

      const response = await BeerService.getAllBeers(params);
      if (response.entities) {
        setBeers(response.entities);
        setTotalCount(response.totalCount || 0);
      }
    } catch (error) {
      showSnackbar("Greška pri učitavanju piva", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filterName, value) => {
    const newParams = new URLSearchParams(searchParams);

    if (value) {
      newParams.set(filterName, value);
    } else {
      newParams.delete(filterName);
    }

    newParams.set("page", "0");
    setSearchParams(newParams);
  };

  const handlePageChange = (newPage) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", newPage.toString());
    setSearchParams(newParams);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAddToCart = async (beer) => {
    if (!user) {
      navigate("/login");
      return;
    }

    setAddingToCart((prev) => ({ ...prev, [beer._id]: true }));

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
      setAddingToCart((prev) => ({ ...prev, [beer._id]: false }));
    }
  };

  const handleToggleWishlist = (beer, e) => {
    e.stopPropagation();

    const isInWishlist = WishlistStorage.isInWishlist(beer._id);

    if (isInWishlist) {
      WishlistStorage.removeFromWishlist(beer._id);
      showSnackbar("Uklonjeno iz liste želja", "info");
    } else {
      WishlistStorage.addToWishlist(beer);
      showSnackbar("Dodano u listu želja", "success");
    }

    loadWishlist();
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  if (authLoading) {
    return <div className={styles.loading}>Učitavanje...</div>;
  }

  return (
    <Layout>
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.hero}>
            <h1>Dobrodošli u Beer Catalog</h1>
            <p>Otkrijte širok izbor piva iz cijelog svijeta</p>
          </div>

          <div className={styles.filters}>
            <div className={styles.filterGroup}>
              <label>Proizvođač</label>
              <select
                value={filters.producer}
                onChange={(e) => handleFilterChange("producer", e.target.value)}
              >
                <option value="">Svi proizvođači</option>
                {producers.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.filterGroup}>
              <label>Tip</label>
              <select
                value={filters.type}
                onChange={(e) => handleFilterChange("type", e.target.value)}
              >
                <option value="">Svi tipovi</option>
                {beerTypes.map((t) => (
                  <option key={t._id} value={t._id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.filterGroup}>
              <label>Boja</label>
              <select
                value={filters.color}
                onChange={(e) => handleFilterChange("color", e.target.value)}
              >
                <option value="">Sve boje</option>
                {beerColors.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {loading ? (
            <div className={styles.loading}>Učitavanje piva...</div>
          ) : beers.length === 0 ? (
            <div className={styles.emptyState}>
              <p>Nema pronađenih piva</p>
            </div>
          ) : (
            <>
              <div className={styles.beerGrid}>
                {beers.map((beer) => (
                  <div key={beer._id} className={styles.beerCard}>
                    {beer.image_url && (
                      <div className={styles.beerImage}>
                        <img src={beer.image_url} alt={beer.name} />
                      </div>
                    )}
                    <div className={styles.beerContent}>
                      <div className={styles.header}>
                        <h3>{beer.name}</h3>
                        <button
                          className={`${styles.favoriteBtn} ${
                            WishlistStorage.isInWishlist(beer._id)
                              ? styles.active
                              : ""
                          }`}
                          onClick={(e) => handleToggleWishlist(beer, e)}
                          aria-label={
                            WishlistStorage.isInWishlist(beer._id)
                              ? "Ukloni iz liste želja"
                              : "Dodaj u listu želja"
                          }
                        >
                          {WishlistStorage.isInWishlist(beer._id) ? "❤️" : "🤍"}
                        </button>
                      </div>
                      <p className={styles.producer}>{beer.producer_name}</p>
                      <div className={styles.beerDetails}>
                        <span className={styles.type}>
                          {beer.beer_type_name}
                        </span>
                        <span className={styles.alcohol}>
                          {beer.alcohol_percentage}%
                        </span>
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
                            onClick={() => handleAddToCart(beer)}
                            disabled={addingToCart[beer._id]}
                          >
                            {addingToCart[beer._id]
                              ? "Dodavanje..."
                              : "Dodaj u košaricu"}
                          </Button>
                        ) : (
                          <Button
                            variant="secondary"
                            onClick={() => navigate("/login")}
                          >
                            Prijavi se za kupnju
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  pageSize={pageSize}
                  totalCount={totalCount}
                  onPageChange={handlePageChange}
                />
              )}
            </>
          )}
        </div>
      </main>
    </Layout>
  );
};

export default Home;
