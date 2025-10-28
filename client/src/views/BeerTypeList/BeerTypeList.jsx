import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "@/hooks/context/AuthContext";
import { useSnackbar } from "@/hooks/context/SnackbarContext";
import BeerTypeService from "@/services/beerType.service";
import BeerColorService from "@/services/beerColor.service";
import Table from "@/components/Table";
import Button from "@/components/Button";
import FormModal from "@/components/FormModal";
import FormInput from "@/components/Forms/FormInput";
import FormSelect from "@/components/Forms/FormSelect";
import Layout from "@/components/Layout";
import styles from "./BeerTypeList.module.scss";
import Form from "@/components/Forms/Form";

const BeerTypeList = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();

  const [beerTypes, setBeerTypes] = useState([]);
  const [beerColors, setBeerColors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingType, setEditingType] = useState(null);
  const [formData, setFormData] = useState({ name: "", beer_color_id: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isAdmin) {
      navigate("/");
      return;
    }
    fetchBeerTypes();
    fetchBeerColors();
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

  const fetchBeerColors = async () => {
    try {
      const response = await BeerColorService.getAllBeerColors();
      if (response.entities) {
        setBeerColors(response.entities);
      }
    } catch (error) {
      showSnackbar("Greška pri učitavanju boja piva", "error");
    }
  };

  const handleCreate = () => {
    setEditingType(null);
    setFormData({ name: "", beer_color_id: "" });
    setIsModalOpen(true);
  };

  const handleEdit = (type) => {
    setEditingType(type);
    setFormData({
      name: type.name,
      beer_color_id: type.beer_color_id || ""
    });
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
    {
      key: "beer_color_id",
      label: "Boja",
      render: (value) => {
        const color = beerColors.find((c) => c._id === value);
        return color ? color.name : "-";
      },
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
    <Layout>
      <div className={styles.beerTypeList}>
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
              <Form
                onSubmit={handleSubmit}
                defaultValues={formData}
                resetDefaultValues={!!editingType}
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

                <FormSelect
                  label="Boja"
                  name="beer_color_id"
                  value={formData.beer_color_id}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      beer_color_id: e.target.value,
                    })
                  }
                  options={beerColors.map((color) => ({
                    value: color._id,
                    label: color.name,
                  }))}
                  placeholder="Odaberi boju"
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

export default BeerTypeList;
