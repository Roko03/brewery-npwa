import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "@/hooks/context/AuthContext";
import { useSnackbar } from "@/hooks/context/SnackbarContext";
import BeerTypeService from "@/services/beerType.service";
import Table from "@/components/Table";
import Button from "@/components/Button";
import FormModal from "@/components/FormModal";
import FormInput from "@/components/Forms/FormInput";
import AdminHeader from "@/components/AdminHeader";
import styles from "./BeerTypeList.module.scss";
import Form from "@/components/Forms/Form";

const BeerTypeList = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();

  const [beerTypes, setBeerTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingType, setEditingType] = useState(null);
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isAdmin) {
      navigate("/");
      return;
    }
    fetchBeerTypes();
  }, [isAdmin, navigate]);

  const fetchBeerTypes = async () => {
    try {
      setLoading(true);
      const response = await BeerTypeService.getAllBeerTypes();
      if (response.entities) {
        setBeerTypes(response.entities);
      }
    } catch (error) {
      showSnackbar("Greška pri učitavanju tipova piva", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingType(null);
    setFormData({ name: "", description: "" });
    setIsModalOpen(true);
  };

  const handleEdit = (type) => {
    setEditingType(type);
    setFormData({ name: type.name, description: type.description || "" });
    setIsModalOpen(true);
  };

  const handleDelete = async (type) => {
    if (
      !window.confirm(
        `Jeste li sigurni da želite izbrisati tip "${type.name}"?`
      )
    ) {
      return;
    }

    try {
      await BeerTypeService.deleteBeerType(type._id);
      showSnackbar("Tip piva uspješno izbrisan", "success");
      fetchBeerTypes();
    } catch (error) {
      showSnackbar("Greška pri brisanju tipa piva", "error");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (editingType) {
        await BeerTypeService.updateBeerType(editingType._id, formData);
        showSnackbar("Tip piva uspješno ažuriran", "success");
      } else {
        await BeerTypeService.createBeerType(formData);
        showSnackbar("Tip piva uspješno kreiran", "success");
      }
      setIsModalOpen(false);
      fetchBeerTypes();
    } catch (error) {
      showSnackbar("Greška pri spremanju tipa piva", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns = [
    { key: "name", label: "Naziv" },
    { key: "description", label: "Opis" },
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
    <div className={styles.beerTypeList}>
      <AdminHeader />

      <main className={styles.main}>
        <div className={styles.container}>
          <header className={styles.header}>
            <h1>Tipovi Piva</h1>
            <Button variant="primary" onClick={handleCreate}>
              + Novi Tip
            </Button>
          </header>

        <Table
          columns={columns}
          data={beerTypes}
          actions={renderActions}
          emptyMessage="Nema tipova piva"
        />

        <FormModal
          title={editingType ? "Uredi Tip Piva" : "Dodaj Tip Piva"}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleSubmit}
          isConfirming={isSubmitting}
          confirmText="Spremi"
          cancelText="Odustani"
        >
          <Form onSubmit={handleSubmit}>
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
              label="Opis"
              name="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </Form>
        </FormModal>
        </div>
      </main>
    </div>
  );
};

export default BeerTypeList;
