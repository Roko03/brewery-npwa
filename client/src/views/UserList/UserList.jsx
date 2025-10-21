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
import Form from "@/components/Forms/Form";
import AdminHeader from "@/components/AdminHeader";
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

  // Get pagination from URL
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
      password: "", // Don't prefill password for security
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

  const handleSubmit = async (data) => {
    setIsSubmitting(true);

    try {
      if (editingUser) {
        // Update user
        const updateData = {
          username: data.username,
          email: data.email,
          bio: data.bio,
          role: data.role,
        };

        // Only include password if it's been changed
        if (data.password && data.password.trim() !== "") {
          updateData.password = data.password;
        }

        const response = await UserService.updateUser(
          editingUser._id,
          updateData
        );

        if (response.user) {
          showSnackbar("Korisnik uspješno ažuriran", "success");
          setIsModalOpen(false);
          fetchUsers();
        } else {
          showSnackbar(response.message || "Greška pri ažuriranju korisnika", "error");
        }
      } else {
        // Create new user
        const response = await UserService.createUser(data);

        if (response.user) {
          showSnackbar("Korisnik uspješno kreiran", "success");
          setIsModalOpen(false);
          fetchUsers();
        } else {
          showSnackbar(response.message || "Greška pri kreiranju korisnika", "error");
        }
      }
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

  return (
    <div className={styles.userList}>
      <AdminHeader />

      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h1>Upravljanje Korisnicima</h1>
            <Button variant="primary" onClick={handleCreate}>
              + Novi Korisnik
            </Button>
          </div>

          {loading ? (
            <div className={styles.loading}>Učitavanje korisnika...</div>
          ) : (
            <>
              <Table
                columns={columns}
                data={users}
                onEdit={handleEdit}
                onDelete={handleDelete}
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
          )}

          <FormModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title={editingUser ? "Uredi Korisnika" : "Novi Korisnik"}
          >
            <Form onSubmit={handleSubmit} defaultValues={formData}>
              {({ register, formState: { errors } }) => (
                <>
                  <FormInput
                    label="Korisničko ime"
                    {...register("username", {
                      required: "Korisničko ime je obavezno",
                    })}
                    error={errors.username?.message}
                  />

                  <FormInput
                    label="Email"
                    type="email"
                    {...register("email", {
                      required: "Email je obavezan",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Neispravna email adresa",
                      },
                    })}
                    error={errors.email?.message}
                  />

                  <FormInput
                    label={editingUser ? "Lozinka (ostavi prazno ako ne mijenjate)" : "Lozinka"}
                    type="password"
                    {...register("password", {
                      required: editingUser ? false : "Lozinka je obavezna",
                      minLength: {
                        value: 6,
                        message: "Lozinka mora imati najmanje 6 znakova",
                      },
                    })}
                    error={errors.password?.message}
                  />

                  <FormInput
                    label="Bio (opciono)"
                    {...register("bio")}
                    error={errors.bio?.message}
                  />

                  <div className={styles.formGroup}>
                    <label htmlFor="role">Uloga</label>
                    <select
                      id="role"
                      {...register("role", { required: "Uloga je obavezna" })}
                      className={styles.select}
                    >
                      <option value="USER">USER</option>
                      <option value="ADMIN">ADMIN</option>
                    </select>
                    {errors.role && (
                      <span className={styles.error}>{errors.role.message}</span>
                    )}
                  </div>

                  <div className={styles.formActions}>
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => setIsModalOpen(false)}
                    >
                      Odustani
                    </Button>
                    <Button
                      type="submit"
                      variant="primary"
                      disabled={isSubmitting}
                    >
                      {isSubmitting
                        ? "Spremam..."
                        : editingUser
                        ? "Ažuriraj"
                        : "Kreiraj"}
                    </Button>
                  </div>
                </>
              )}
            </Form>
          </FormModal>
        </div>
      </main>
    </div>
  );
};

export default UserList;
