import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useAuth } from "@/hooks/context/AuthContext";
import { useSnackbar } from "@/hooks/context/SnackbarContext";
import ProducerService from "@/services/producer.service";
import Table from "@/components/Table";
import Pagination from "@/components/Pagination";
import Button from "@/components/Button";
import FormModal from "@/components/FormModal";
import FormInput from "@/components/Forms/FormInput";
import Layout from "@/components/Layout";
import styles from "./ProducerList.module.scss";
import Form from "@/components/Forms/Form";

const ProducerList = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  const [searchParams, setSearchParams] = useSearchParams();

  const [producers, setProducers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProducer, setEditingProducer] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    country: "",
    description: "",
    founded_year: "",
    logo_url: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get pagination from URL
  const pageSize = 10;
  const currentPage = parseInt(searchParams.get("page") || "0", 10);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    if (!isAdmin) {
      navigate("/");
      return;
    }
    fetchProducers();
  }, [isAdmin, navigate, searchParams]);

  const fetchProducers = async () => {
    try {
      setLoading(true);
      const response = await ProducerService.getAllProducers({
        pageNumber: currentPage,
        pageSize: pageSize,
      });
      if (response.entities) {
        setProducers(response.entities);
        setTotalCount(response.totalCount || 0);
      }
    } catch (error) {
      showSnackbar("Greška pri učitavanju proizvođača", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingProducer(null);
    setFormData({
      name: "",
      country: "",
      description: "",
      founded_year: "",
      logo_url: "",
    });
    setIsModalOpen(true);
  };

  const handleEdit = (producer) => {
    setEditingProducer(producer);
    setFormData({
      name: producer.name,
      country: producer.country,
      description: producer.description || "",
      founded_year: producer.founded_year || "",
      logo_url: producer.logo_url || "",
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (producer) => {
    if (
      !window.confirm(
        `Jeste li sigurni da želite izbrisati proizvođača "${producer.name}"?`
      )
    ) {
      return;
    }

    try {
      await ProducerService.deleteProducer(producer._id);
      showSnackbar("Proizvođač uspješno izbrisan", "success");
      fetchProducers();
    } catch (error) {
      showSnackbar("Greška pri brisanju proizvođača", "error");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const submitData = { ...formData };

      if (submitData.founded_year) {
        submitData.founded_year = Number(submitData.founded_year);
      }

      if (editingProducer) {
        await ProducerService.updateProducer(editingProducer._id, submitData);
        showSnackbar("Proizvođač uspješno ažuriran", "success");
      } else {
        await ProducerService.createProducer(submitData);
        showSnackbar("Proizvođač uspješno kreiran", "success");
      }
      setIsModalOpen(false);
      fetchProducers();
    } catch (error) {
      showSnackbar("Greška pri spremanju proizvođača", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePageChange = (newPage) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", newPage.toString());
    setSearchParams(newParams);
  };

  const columns = [
    { key: "name", label: "Naziv" },
    { key: "country", label: "Država" },
    { key: "founded_year", label: "Godina osnivanja" },
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

  const totalPages = Math.ceil(totalCount / pageSize);

  if (loading && currentPage === 0) {
    return <div className={styles.loading}>Učitavanje...</div>;
  }

  return (
    <Layout>
      <div className={styles.producerList}>
        <main className={styles.main}>
          <div className={styles.container}>
            <div className={styles.header}>
              <h1>Proizvođači</h1>
              <Button variant="primary" onClick={handleCreate}>
                + Novi Proizvođač
              </Button>
            </div>

            <Table
              columns={columns}
              data={producers}
              actions={renderActions}
              emptyMessage="Nema proizvođača"
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

            <FormModal
              title={
                editingProducer ? "Uredi Proizvođača" : "Dodaj Proizvođača"
              }
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              onConfirm={handleSubmit}
              isConfirming={isSubmitting}
              confirmText="Spremi"
              cancelText="Odustani"
            >
              <Form
                id="producer-form"
                onSubmit={handleSubmit}
                defaultValues={formData}
                resetDefaultValues={!!editingProducer}
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
                <FormInput
                  formLabel="Država"
                  name="country"
                  value={formData.country}
                  onChange={(e) =>
                    setFormData({ ...formData, country: e.target.value })
                  }
                  required
                />
                <FormInput
                  formLabel="Opis"
                  name="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
                <FormInput
                  formLabel="Godina osnivanja"
                  name="founded_year"
                  type="number"
                  value={formData.founded_year}
                  onChange={(e) =>
                    setFormData({ ...formData, founded_year: e.target.value })
                  }
                />
                <FormInput
                  formLabel="URL Loga"
                  name="logo_url"
                  type="url"
                  value={formData.logo_url}
                  onChange={(e) =>
                    setFormData({ ...formData, logo_url: e.target.value })
                  }
                />
              </Form>
            </FormModal>
          </div>
        </main>
      </div>
    </Layout>
  );
};

export default ProducerList;
