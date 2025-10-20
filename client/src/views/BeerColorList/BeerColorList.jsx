import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "@/hooks/context/AuthContext";
import { useSnackbar } from "@/hooks/context/SnackbarContext";
import BeerColorService from "@/services/beerColor.service";
import Table from "@/components/Table";
import Button from "@/components/Button";
import FormModal from "@/components/FormModal";
import FormInput from "@/components/Forms/FormInput";
import styles from "./BeerColorList.module.scss";
import Form from "@/components/Forms/Form";

const BeerColorList = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();

  const [beerColors, setBeerColors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingColor, setEditingColor] = useState(null);
  const [formData, setFormData] = useState({ name: "", hex_code: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isAdmin) {
      navigate("/");
      return;
    }
    fetchBeerColors();
  }, [isAdmin, navigate]);

  const fetchBeerColors = async () => {
    try {
      setLoading(true);
      const response = await BeerColorService.getAllBeerColors();
      if (response.entities) {
        setBeerColors(response.entities);
      }
    } catch (error) {
      showSnackbar("Greška pri učitavanju boja piva", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingColor(null);
    setFormData({ name: "", hex_code: "" });
    setIsModalOpen(true);
  };

  const handleEdit = (color) => {
    setEditingColor(color);
    setFormData({ name: color.name, hex_code: color.hex_code || "" });
    setIsModalOpen(true);
  };

  const handleDelete = async (color) => {
    if (
      !window.confirm(
        `Jeste li sigurni da želite izbrisati boju "${color.name}"?`
      )
    ) {
      return;
    }

    try {
      await BeerColorService.deleteBeerColor(color._id);
      showSnackbar("Boja piva uspješno izbrisana", "success");
      fetchBeerColors();
    } catch (error) {
      showSnackbar("Greška pri brisanju boje piva", "error");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (editingColor) {
        await BeerColorService.updateBeerColor(editingColor._id, formData);
        showSnackbar("Boja piva uspješno ažurirana", "success");
      } else {
        await BeerColorService.createBeerColor(formData);
        showSnackbar("Boja piva uspješno kreirana", "success");
      }
      setIsModalOpen(false);
      fetchBeerColors();
    } catch (error) {
      showSnackbar("Greška pri spremanju boje piva", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns = [
    { key: "name", label: "Naziv" },
    {
      key: "hex_code",
      label: "Boja",
      render: (value) =>
        value ? (
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <div
              style={{
                width: "24px",
                height: "24px",
                backgroundColor: value,
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            />
            <span>{value}</span>
          </div>
        ) : (
          "-"
        ),
    },
  ];

  const renderActions = (row) => (
    <div className={styles.actions}>
      <Button variant="primary" onClick={() => handleEdit(row)}>
        Uredi
      </Button>
      <Button variant="secondary" onClick={() => handleDelete(row)}>
        Izbriši
      </Button>
    </div>
  );

  if (loading) {
    return <div className={styles.loading}>Učitavanje...</div>;
  }

  return (
    <div className={styles.beerColorList}>
      <div className={styles.container}>
        <header className={styles.header}>
          <div>
            <h1>Boje Piva</h1>
            <p>Upravljanje bojama piva</p>
          </div>
          <div className={styles.headerActions}>
            <Button variant="secondary" onClick={() => navigate("/admin")}>
              Natrag
            </Button>
            <Button variant="primary" onClick={handleCreate}>
              Dodaj Boju
            </Button>
          </div>
        </header>

        <Table
          columns={columns}
          data={beerColors}
          actions={renderActions}
          emptyMessage="Nema boja piva"
        />

        <FormModal
          title={editingColor ? "Uredi Boju Piva" : "Dodaj Boju Piva"}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleSubmit}
          isConfirming={isSubmitting}
          confirmText="Spremi"
          cancelText="Odustani"
        >
          <Form id="beer-color-form" onSubmit={handleSubmit}>
            <FormInput
              label="Naziv"
              name="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
            <FormInput
              label="Hex Kod Boje"
              name="hex_code"
              type="color"
              value={formData.hex_code}
              onChange={(e) =>
                setFormData({ ...formData, hex_code: e.target.value })
              }
            />
          </Form>
        </FormModal>
      </div>
    </div>
  );
};

export default BeerColorList;
