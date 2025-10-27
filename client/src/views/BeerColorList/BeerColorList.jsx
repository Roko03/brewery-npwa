import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "@/hooks/context/AuthContext";
import { useSnackbar } from "@/hooks/context/SnackbarContext";
import BeerColorService from "@/services/beerColor.service";
import Table from "@/components/Table";
import Button from "@/components/Button";
import FormModal from "@/components/FormModal";
import FormInput from "@/components/Forms/FormInput";
import Layout from "@/components/Layout";
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
  const [formData, setFormData] = useState({ name: "" });
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
    setFormData({ name: "" });
    setIsModalOpen(true);
  };

  const handleEdit = (color) => {
    setEditingColor(color);
    setFormData({ name: color.name });
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

  const columns = [{ key: "name", label: "Naziv" }];

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
    <Layout>
      <div className={styles.beerColorList}>
        <main className={styles.main}>
          <div className={styles.container}>
            <header className={styles.header}>
              <h1>Boje Piva</h1>
              <Button variant="primary" onClick={handleCreate}>
                + Nova Boja
              </Button>
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
              <Form
                id="beer-color-form"
                onSubmit={handleSubmit}
                defaultValues={formData}
                resetDefaultValues={!!editingColor}
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
              </Form>
            </FormModal>
          </div>
        </main>
      </div>
    </Layout>
  );
};

export default BeerColorList;
