import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../store/authStore";
import "../../styles/auth/login.css";

const LoginSchema = Yup.object({
  email: Yup.string().email("E-mail inválido").required("Obrigatório"),
  password: Yup.string().min(8, "Mínimo 8 caracteres").required("Obrigatório"),
});

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      // Exemplo de integração futura com backend:
      // const res = await fetch('/api/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(values),
      // });
      // if (!res.ok) throw new Error('Credenciais inválidas');
      // const data = await res.json();
      // login(data.user);

      // Mock atual para testes:
      const users = {
        "admin@nexum.com": { name: "Admin", role: "Admin" },
        "rh@nexum.com": { name: "RH", role: "RH" },
        "gestor@nexum.com": { name: "Gestor", role: "Gestor" },
        "candidato@nexum.com": { name: "Candidato", role: "Candidato" },
      };

      const user = users[values.email];
      if (!user) {
        alert("Credenciais inválidas");
        setSubmitting(false);
        return;
      }

      login(user);
      navigate("/dashboard");
    } catch (err) {
      alert(err.message || "Erro no login");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-brand">
          <div className="login-logo">
            {/* Trocar por <img src="/logo.svg" /> quando tiver a logo */}
            <span>N</span>
          </div>
          <h1>NEXUM</h1>
          <span>Plataforma inteligente de recrutamento</span>
        </div>

        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={LoginSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, values, setFieldValue }) => (
            <Form>
              <div className="login-field">
                <label>E-mail</label>
                <Field type="email" name="email" />
                <ErrorMessage name="email" component="div" className="error" />
              </div>

              <div className="login-field password-field">
                <label>Senha</label>
                <div className="password-wrapper">
                  <Field
                    type={values.showPassword ? "text" : "password"}
                    name="password"
                  />
                  <button
                    type="button"
                    className="show-password-btn"
                    onClick={() =>
                      setFieldValue("showPassword", !values.showPassword)
                    }
                  >
                    {values.showPassword ? "🙈" : "👁️"}
                  </button>
                </div>
                <ErrorMessage
                  name="password"
                  component="div"
                  className="error"
                />
              </div>

              <button
                type="submit"
                className="login-button"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Entrando..." : "Entrar"}
              </button>
            </Form>
          )}
        </Formik>

        <div className="login-footer">
          © {new Date().getFullYear()} Nexum • Todos os direitos reservados
        </div>
      </div>
    </div>
  );
}
