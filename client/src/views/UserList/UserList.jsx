import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useAuth } from "@/hooks/context/AuthContext";
import { useSnackbar } from "@/hooks/context/SnackbarContext";
import UserService from "@/services/user.service";
import Table from "@/components/Table";
import Pagination from "@/components/Pagination";
import Button from "@/components/Button";
import FormModal from "@/components/FormModal";
import FormInput from "@/components/Forms/FormInput";
import FormSelect from "@/components/Forms/FormSelect";
import Layout from "@/components/Layout";
import Form from "@/components/Forms/Form";
import styles from "./UserList.module.scss";

const UserList = () => {
  const { isAdmin, user: currentUser } = useAuth();
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  const [searchParams, setSearchParams] = useSearchParams();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    bio: "",
    role: "USER",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const pageSize = 10;
  const currentPage = parseInt(searchParams.get("page") || "0", 10);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    if (!isAdmin) {
      navigate("/");
      return;
    }
    fetchUsers();
  }, [isAdmin, navigate, searchParams]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await UserService.getAllUsers({
        pageNumber: currentPage,
        pageSize: pageSize,
      });
      if (response.entities) {
        setUsers(response.entities);
        setTotalCount(response.totalCount || 0);
      }
    } catch (error) {
      showSnackbar("Greška pri učitavanju korisnika", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingUser(null);
    setFormData({
      username: "",
      email: "",
      password: "",
      bio: "",
      role: "USER",
    });
    setIsModalOpen(true);
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      email: user.email,
      password: "",
      bio: user.bio || "",
      role: user.role,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (user) => {
    if (currentUser?._id === user._id) {
      showSnackbar("Ne možete izbrisati vlastiti račun", "error");
      return;
    }

    if (
      !window.confirm(
        `Jeste li sigurni da želite izbrisati korisnika "${user.username}"?`
      )
    ) {
      return;
    }

    try {
      await UserService.deleteUser(user._id);
      showSnackbar("Korisnik uspješno izbrisan", "success");
      fetchUsers();
    } catch (error) {
      showSnackbar("Greška pri brisanju korisnika", "error");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (editingUser) {
        const updateData = {
          username: formData.username,
          email: formData.email,
          bio: formData.bio,
          role: formData.role,
        };

        if (formData.password && formData.password.trim() !== "") {
          updateData.password = formData.password;
        }

        await UserService.updateUser(editingUser._id, updateData);
        showSnackbar("Korisnik uspješno ažuriran", "success");
      } else {
        await UserService.createUser(formData);
        showSnackbar("Korisnik uspješno kreiran", "success");
      }
      setIsModalOpen(false);
      fetchUsers();
    } catch (error) {
      showSnackbar("Greška pri spremanju korisnika", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePageChange = (newPage) => {
    setSearchParams({ page: newPage.toString() });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  if (loading && currentPage === 0) {
    return <div className={styles.loading}>Učitavanje...</div>;
  }

  const columns = [
    { key: "username", label: "Korisničko ime" },
    { key: "email", label: "Email" },
    { key: "role", label: "Uloga" },
    {
      key: "createdAt",
      label: "Kreirano",
      render: (value) =>
        new Date(value).toLocaleDateString("hr-HR", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }),
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

  return (
    <Layout>
      <div className={styles.userList}>
        <main className={styles.main}>
          <div className={styles.container}>
            <header className={styles.header}>
              <h1>Korisnici</h1>
              <Button variant="primary" onClick={handleCreate}>
                + Novi Korisnik
              </Button>
            </header>

            <Table
              columns={columns}
              data={users}
              actions={renderActions}
              emptyMessage="Nema korisnika"
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
              title={editingUser ? "Uredi Korisnika" : "Dodaj Korisnika"}
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              onConfirm={handleSubmit}
              isConfirming={isSubmitting}
              confirmText="Spremi"
              cancelText="Odustani"
            >
              <Form
                id="user-form"
                onSubmit={handleSubmit}
                defaultValues={formData}
                resetDefaultValues={!!editingUser}
              >
                <FormInput
                  formLabel="Korisničko ime"
                  name="username"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                  required
                  disabled
                />

                <FormInput
                  formLabel="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                  disabled
                />
                <FormSelect
                  label="Uloga"
                  name="role"
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                  options={[
                    { value: "USER", label: "USER" },
                    { value: "ADMIN", label: "ADMIN" },
                  ]}
                  placeholder="Odaberi ulogu"
                  required
                />
                {editingUser && (
                  <div style={{ marginTop: "1rem" }}>
                    <a
                      href={`/admin/change-password?userId=${editingUser._id}`}
                      style={{
                        color: "#007bff",
                        textDecoration: "underline",
                        cursor: "pointer",
                      }}
                    >
                      Promijeni lozinku
                    </a>
                  </div>
                )}
              </Form>
            </FormModal>
          </div>
        </main>
      </div>
    </Layout>
  );
};

export default UserList;
