import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import Form from "@/components/Forms/Form";
import FormInput from "@/components/Forms/FormInput";
import AuthService from "@/services/auth.service";
import styles from "./Login.module.scss";
import { useSnackbar } from "@/hooks/context/SnackbarContext";
import Logo from "@/components/SvgIcons/Logo";
import Button from "@/components/Button";

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { showSnackbar } = useSnackbar();

  const handleLogin = async (data, methods) => {
    try {
      setLoading(true);
      const response = await AuthService.login({
        email: data.email,
        password: data.password,
      });

      if (response.error) {
        showSnackbar("error", response.error || "Greška pri prijavi");
        return;
      }

      if (!response.success) {
        showSnackbar("error", "Pogrešna email adresa ili lozinka");
        return;
      }

      showSnackbar("success", "Uspješna prijava!");
      navigate("/");
    } catch (error) {
      showSnackbar("error", "Greška pri prijavi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.iconWrapper}>
            <Logo />
          </div>
          <h1 className={styles.title}>Dobrodošli natrag</h1>
          <p className={styles.description}>Prijavite se u svoj račun</p>
        </div>
        <div className={styles.content}>
          <Form
            onSubmit={handleLogin}
            defaultValues={{
              email: "",
              password: "",
            }}
            mode="onChange"
            className={styles.form}
          >
            {() => (
              <>
                <FormInput
                  name="email"
                  formLabel="Email"
                  type="email"
                  placeholder="example@email.com"
                  validate={{
                    required: "Email je obavezan",
                  }}
                />
                <FormInput
                  name="password"
                  formLabel="Lozinka"
                  type="password"
                  placeholder="••••••••"
                  validate={{
                    required: "Lozinka je obavezna",
                  }}
                />
                <Button type="submit" fullWidth disabled={loading}>
                  {loading ? "Prijavljivanje..." : "Prijavite se"}
                </Button>
              </>
            )}
          </Form>
          <div className={styles.footer}>
            Nemate račun? <Link to="/register">Registrirajte se</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
