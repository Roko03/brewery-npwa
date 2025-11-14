import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/hooks/context/AuthContext";
import { useSnackbar } from "@/hooks/context/SnackbarContext";
import UserService from "@/services/user.service";
import Layout from "@/components/Layout";
import Button from "@/components/Button";
import FormInput from "@/components/Forms/FormInput";
import Form from "@/components/Forms/Form";
import styles from "./ChangePassword.module.scss";

const ChangePassword = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("userId");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (!userId) {
      showSnackbar("Korisnik nije pronađen", "error");
      navigate("/admin/users");
      return;
    }
    fetchUser();
  }, [isAdmin, userId, navigate]);

  const fetchUser = async () => {
    try {
      const response = await UserService.getUser(userId);
      if (response._id) {
        setUser(response);
      } else {
        showSnackbar("Korisnik nije pronađen", "error");
        navigate("/admin/users");
      }
    } catch (error) {
      showSnackbar("Greška pri učitavanju korisnika", "error");
      navigate("/admin/users");
    }
  };

  const handleSubmit = async (data) => {
    setIsSubmitting(true);

    try {
      await UserService.changePassword(userId, {
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
      });

      showSnackbar("Lozinka uspješno promijenjena", "success");
      navigate("/admin/users");
    } catch (error) {
      showSnackbar(
        error.message ||
          "Greška pri promjeni lozinke. Provjerite staru lozinku.",
        "error"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <Layout>
        <div className={styles.loading}>Učitavanje...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className={styles.changePassword}>
        <main className={styles.main}>
          <div className={styles.container}>
            <header className={styles.header}>
              <h1>Promjena lozinke za korisnika: {user.username}</h1>
            </header>

            <div className={styles.formContainer}>
              <Form
                onSubmit={handleSubmit}
                defaultValues={{
                  oldPassword: "",
                  newPassword: "",
                  confirmPassword: "",
                }}
                mode="onChange"
              >
                {() => (
                  <>
                    <FormInput
                      formLabel="Stara lozinka"
                      name="oldPassword"
                      type="password"
                      required
                      autoComplete="current-password"
                    />

                    <FormInput
                      formLabel="Nova lozinka"
                      name="newPassword"
                      type="password"
                      required
                      autoComplete="new-password"
                    />

                    <FormInput
                      name="confirmPassword"
                      formLabel="Potvrdi novu lozinku"
                      type="password"
                      required
                      autoComplete="new-password"
                    />

                    <div className={styles.actions}>
                      <Button
                        type="submit"
                        variant="primary"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Spremanje..." : "Promijeni lozinku"}
                      </Button>
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => navigate("/admin/users")}
                      >
                        Odustani
                      </Button>
                    </div>
                  </>
                )}
              </Form>
            </div>
          </div>
        </main>
      </div>
    </Layout>
  );
};

export default ChangePassword;
