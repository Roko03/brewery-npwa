import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useAuth } from "@/hooks/context/AuthContext";
import { useSnackbar } from "@/hooks/context/SnackbarContext";
import BeerService from "@/services/beer.service";
import BeerTypeService from "@/services/beerType.service";
import BeerColorService from "@/services/beerColor.service";
import ProducerService from "@/services/producer.service";
import { WishlistStorage } from "@/services/favorites.service";
import Table from "@/components/Table";
import Layout from "@/components/Layout";
import Pagination from "@/components/Pagination";
import Button from "@/components/Button";
import FormModal from "@/components/FormModal";
import FormInput from "@/components/Forms/FormInput";
import BeerCard from "@/components/BeerCard";
import BeerDetailsModal from "@/components/BeerDetailsModal";
import styles from "./BeerList.module.scss";
import Form from "@/components/Forms/Form";

const BeerList = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  const [searchParams, setSearchParams] = useSearchParams();

  const [beers, setBeers] = useState([]);
  const [producers, setProducers] = useState([]);
  const [beerTypes, setBeerTypes] = useState([]);
  const [beerColors, setBeerColors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBeer, setEditingBeer] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  const [selectedBeer, setSelectedBeer] = useState(null);
  const [isBeerDetailsOpen, setIsBeerDetailsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    producer_id: "",
    beer_type_id: "",
    beer_color_id: "",
    alcohol_percentage: "",
    ibu: "",
    volume_ml: "",
    price: "",
    image_url: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get initial values from URL
  const pageSize = 10;
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
      showSnackbar("Greška pri učitavanju podataka", "error");
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

      // Remove empty filters
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

  const loadWishlist = () => {
    const wishlistData = WishlistStorage.getWishlist();
    setWishlist(wishlistData);
  };

  const handleCreate = () => {
    setEditingBeer(null);
    setFormData({
      name: "",
      description: "",
      producer_id: "",
      beer_type_id: "",
      beer_color_id: "",
      alcohol_percentage: "",
      ibu: "",
      volume_ml: "",
      price: "",
      image_url: "",
    });
    setIsModalOpen(true);
  };

  const handleEdit = (beer) => {
    setEditingBeer(beer);
    setFormData({
      name: beer.name,
      description: beer.description || "",
      producer_id: beer.producer_id || "",
      beer_type_id: beer.beer_type_id || "",
      beer_color_id: beer.beer_color_id || "",
      alcohol_percentage: beer.alcohol_percentage || "",
      ibu: beer.ibu || "",
      volume_ml: beer.volume_ml || "",
      price: beer.price || "",
      image_url: beer.image_url || "",
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (beer) => {
    if (
      !window.confirm(
        `Jeste li sigurni da želite izbrisati pivo "${beer.name}"?`
      )
    ) {
      return;
    }

    try {
      await BeerService.deleteBeer(beer._id);
      showSnackbar("Pivo uspješno izbrisano", "success");
      fetchBeers();
    } catch (error) {
      showSnackbar("Greška pri brisanju piva", "error");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const submitData = { ...formData };

      // Convert numeric fields
      if (submitData.alcohol_percentage)
        submitData.alcohol_percentage = Number(submitData.alcohol_percentage);
      if (submitData.ibu) submitData.ibu = Number(submitData.ibu);
      if (submitData.volume_ml)
        submitData.volume_ml = Number(submitData.volume_ml);
      if (submitData.price) submitData.price = Number(submitData.price);

      if (editingBeer) {
        await BeerService.updateBeer(editingBeer._id, submitData);
        showSnackbar("Pivo uspješno ažurirano", "success");
      } else {
        await BeerService.createBeer(submitData);
        showSnackbar("Pivo uspješno kreirano", "success");
      }
      setIsModalOpen(false);
      fetchBeers();
    } catch (error) {
      showSnackbar("Greška pri spremanju piva", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePageChange = (newPage) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", newPage.toString());
    setSearchParams(newParams);
  };

  const handleFilterChange = (filterName, value) => {
    const newParams = new URLSearchParams(searchParams);

    if (value) {
      newParams.set(filterName, value);
    } else {
      newParams.delete(filterName);
    }

    // Reset to first page when filtering
    newParams.set("page", "0");
    setSearchParams(newParams);
  };

  const toggleWishlist = (beer) => {
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

  const handleCardClick = (beer) => {
    setSelectedBeer(beer);
    setIsBeerDetailsOpen(true);
  };

  const handleCloseBeerDetails = () => {
    setIsBeerDetailsOpen(false);
    setSelectedBeer(null);
  };

  const columns = [
    { key: "name", label: "Naziv" },
    { key: "producer_name", label: "Proizvođač" },
    { key: "beer_type_name", label: "Tip" },
    { key: "alcohol_percentage", label: "Alkohol (%)", align: "center" },
    {
      key: "price",
      label: "Cijena (EUR)",
      align: "right",
      render: (value) => (value ? `€${value.toFixed(2)}` : "-"),
    },
  ];

  const renderActions = (row) => (
    <div className={styles.actions}>
      {!isAdmin && (
        <Button
          variant={
            WishlistStorage.isInWishlist(row._id) ? "primary" : "secondary"
          }
          onClick={() => toggleWishlist(row)}
        >
          {WishlistStorage.isInWishlist(row._id) ? "❤️" : "🤍"}
        </Button>
      )}
      {isAdmin && (
        <>
          <Button variant="primary" onClick={() => handleEdit(row)}>
            Uredi
          </Button>
          <Button variant="secondary" onClick={() => handleDelete(row)}>
            Izbriši
          </Button>
        </>
      )}
    </div>
  );

  const totalPages = Math.ceil(totalCount / pageSize);

  if (loading && currentPage === 0) {
    return <div className={styles.loading}>Učitavanje...</div>;
  }

  return (
    <Layout>
      <div className={styles.beerList}>
        <div className={styles.container}>
          <header className={styles.header}>
            <h1>Piva</h1>
            {!isAdmin && (
              <Button variant="primary" onClick={() => navigate("/favorites")}>
                Lista želja ({wishlist.length})
              </Button>
            )}
            {isAdmin && (
              <Button variant="primary" onClick={handleCreate}>
                Dodaj Pivo
              </Button>
            )}
          </header>
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

        {isAdmin ? (
          <>
            <Table
              columns={columns}
              data={beers}
              actions={renderActions}
              emptyMessage="Nema piva"
            />

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
        ) : (
          <>
            {beers.length === 0 ? (
              <div className={styles.emptyState}>
                <p>Nema pronađenih piva</p>
              </div>
            ) : (
              <>
                <div className={styles.beerGrid}>
                  {beers.map((beer) => (
                    <BeerCard
                      key={beer._id}
                      beer={beer}
                      onCardClick={handleCardClick}
                      onWishlistChange={loadWishlist}
                    />
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
          </>
        )}

        {!isAdmin && (
          <BeerDetailsModal
            beer={selectedBeer}
            isOpen={isBeerDetailsOpen}
            onClose={handleCloseBeerDetails}
            onWishlistChange={loadWishlist}
          />
        )}

        {isAdmin && (
          <FormModal
            title={editingBeer ? "Uredi Pivo" : "Dodaj Pivo"}
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onConfirm={handleSubmit}
            isConfirming={isSubmitting}
            confirmText="Spremi"
            cancelText="Odustani"
            size="large"
          >
            <Form
              id="beer-form"
              onSubmit={handleSubmit}
              defaultValues={formData}
              resetDefaultValues={!!editingBeer}
            >
              <FormInput
                formLabel="Naziv"
                name="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />

              <div className={styles.formGroup}>
                <label htmlFor="producer_id">Proizvođač *</label>
                <select
                  id="producer_id"
                  value={formData.producer_id}
                  onChange={(e) =>
                    setFormData({ ...formData, producer_id: e.target.value })
                  }
                  required
                >
                  <option value="">Odaberi proizvođača</option>
                  {producers.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="beer_type_id">Tip *</label>
                <select
                  id="beer_type_id"
                  value={formData.beer_type_id}
                  onChange={(e) =>
                    setFormData({ ...formData, beer_type_id: e.target.value })
                  }
                  required
                >
                  <option value="">Odaberi tip</option>
                  {beerTypes.map((t) => (
                    <option key={t._id} value={t._id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="beer_color_id">Boja *</label>
                <select
                  id="beer_color_id"
                  value={formData.beer_color_id}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      beer_color_id: e.target.value,
                    })
                  }
                  required
                >
                  <option value="">Odaberi boju</option>
                  {beerColors.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <FormInput
                formLabel="Alkohol (%)"
                name="alcohol_percentage"
                type="number"
                step="0.1"
                value={formData.alcohol_percentage}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    alcohol_percentage: e.target.value,
                  })
                }
                required
              />

              <FormInput
                formLabel="IBU"
                name="ibu"
                type="number"
                value={formData.ibu}
                onChange={(e) =>
                  setFormData({ ...formData, ibu: e.target.value })
                }
              />

              <FormInput
                formLabel="Volumen (ml)"
                name="volume_ml"
                type="number"
                value={formData.volume_ml}
                onChange={(e) =>
                  setFormData({ ...formData, volume_ml: e.target.value })
                }
              />

              <FormInput
                formLabel="Cijena (EUR)"
                name="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                required
              />

              <FormInput
                formLabel="URL Slike"
                name="image_url"
                type="url"
                value={formData.image_url}
                onChange={(e) =>
                  setFormData({ ...formData, image_url: e.target.value })
                }
              />

              <div className={styles.fullWidth}>
                <FormInput
                  formLabel="Opis"
                  name="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>
            </Form>
          </FormModal>
        )}
      </div>
    </Layout>
  );
};

export default BeerList;
