import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import Form from "@/components/Forms/Form";
import FormInput from "@/components/Forms/FormInput";
import styles from "./Register.module.scss";
import { useSnackbar } from "@/hooks/context/SnackbarContext";
import { useAuth } from "@/hooks/context/AuthContext";
import Logo from "@/components/SvgIcons/Logo";
import Button from "@/components/Button";

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { showSnackbar } = useSnackbar();
  const { register } = useAuth();

  const handleRegister = async (data, methods) => {
    try {
      setLoading(true);

      const response = await register({
        username: data.username,
        email: data.email,
        password: data.password,
      });

      if (!response.success) {
        showSnackbar("error", response.error || "Greška pri registraciji");
        return;
      }

      showSnackbar("success", "Uspješna registracija!");

      // Role-based redirect
      if (response.user.role === "ADMIN") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (error) {
      showSnackbar("error", "Greška pri registraciji");
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
          <h1 className={styles.title}>Kreiraj račun</h1>
          <p className={styles.description}>Registrirajte se</p>
        </div>
        <div className={styles.content}>
          <Form
            onSubmit={handleRegister}
            defaultValues={{
              firstName: "",
              lastName: "",
              email: "",
              password: "",
              confirmPassword: "",
            }}
            mode="onChange"
            className={styles.form}
          >
            {() => (
              <>
                <FormInput
                  name="username"
                  formLabel="Username"
                  type="text"
                  placeholder="Username"
                  validate={{
                    required: "Username je obavezan",
                  }}
                />
                <FormInput
                  name="email"
                  formLabel="Email"
                  type="email"
                  placeholder="vas@email.com"
                  validate={{
                    required: "Email je obavezan",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Neispravna email adresa",
                    },
                  }}
                />
                <FormInput
                  name="password"
                  formLabel="Lozinka"
                  type="password"
                  placeholder="••••••••"
                  validate={{
                    required: "Lozinka je obavezna",
                    minLength: {
                      value: 6,
                      message: "Lozinka mora imati minimalno 6 znakova",
                    },
                  }}
                />
                <FormInput
                  name="confirmPassword"
                  formLabel="Potvrdi lozinku"
                  type="password"
                  placeholder="••••••••"
                  validate={{
                    required: "Potvrda lozinke je obavezna",
                    minLength: {
                      value: 6,
                      message: "Lozinka mora imati minimalno 6 znakova",
                    },
                    validate: (value, allValues) =>
                      value === allValues.password ||
                      "Lozinke se ne podudaraju",
                  }}
                />
                <Button type="submit" fullWidth disabled={loading}>
                  {loading ? "Registriranje..." : "Registrirajte se"}
                </Button>
              </>
            )}
          </Form>
          <div className={styles.footer}>
            Već imate račun? <Link to="/login">Prijavite se</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
