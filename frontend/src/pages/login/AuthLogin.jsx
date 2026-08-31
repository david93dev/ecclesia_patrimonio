import heroImage from "../../assets/hero.png";
import ecclesiaLogo from "../../assets/ecclesia-logo-v3.png";
import { InputField } from "../../components/ui/inputfield";
import { InputPasswordField } from "../../components/ui/InputPasswordField";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";

const Brand = ({ mobile = false }) => (
  <a
    href="/"
    aria-label="Ecclesia Patrimônio — início"
    className={`relative z-10 block w-fit ${mobile ? "rounded-xl bg-auth-background px-3 py-1.5 shadow-logo" : ""}`}
  >
    <img
      src={ecclesiaLogo}
      alt="Ecclesia Patrimônio"
      className={`${mobile ? "w-42" : "w-47.5"} h-auto object-contain`}
    />
  </a>
);

export const AuthLogin = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setSubmitting(true);
    setError("");
    try {
      await login({ email: data.get("email"), password: data.get("password") });
      navigate(location.state?.from?.pathname || "/dashboard", { replace: true });
    } catch (loginError) {
      setError(loginError.message);
      setSubmitting(false);
    }
  };

  return (
    <main className="grid h-dvh max-h-dvh min-h-0 grid-cols-1 overflow-hidden lg:grid-cols-[minmax(430px,.94fr)_minmax(520px,1.06fr)]">
      <section
        aria-label="Apresentação do sistema"
        className="relative hidden h-dvh min-h-0 flex-col overflow-hidden bg-auth-background px-[clamp(42px,5vw,76px)] pt-10.5 pb-8.5 text-white lg:flex [@media(max-height:760px)]:pt-7 [@media(max-height:760px)]:pb-6"
      >
        <div className="pointer-events-none absolute inset-0 bg-auth-pattern bg-size-[18px_18px] opacity-[.18] mask-[linear-gradient(to_bottom,var(--color-mask),transparent_72%)]" />
        <div className="absolute top-[29%] -left-57.5 size-140 rounded-full bg-brand-600/30 blur-[100px]" />
        <Brand />

        <div className="relative z-1 my-auto pt-10 [@media(max-height:760px)]:pt-4">
          <span className="inline-flex items-center gap-2 text-[10px] font-bold tracking-[1.45px] text-auth-heading-muted uppercase before:h-px before:w-5.5 before:bg-accent">
            Gestão inteligente de patrimônio
          </span>
          <h1 className="my-5 max-w-142.5 font-[Manrope] text-[clamp(36px,3.8vw,56px)] leading-[1.1] font-bold tracking-[-2.4px]">
            Cuide do que conta
            <br />a sua{" "}
            <em className="font-normal text-brand-300 not-italic">história.</em>
          </h1>
          <p className="m-0 max-w-117.5 text-sm leading-[1.7] text-auth-copy">
            Organize, preserve e acompanhe todo o patrimônio da sua comunidade
            em um só lugar.
          </p>

          <div
            className="relative mt-8.5 h-61.25 [@media(max-height:760px)]:mt-2 [@media(max-height:760px)]:h-42"
            aria-hidden="true"
          >
            <span className="absolute top-[34%] left-[22%] size-1.25 rounded-full bg-accent shadow-accent-glow" />
            <span className="absolute top-[18%] right-[20%] size-0.75 rounded-full bg-accent shadow-accent-glow" />
            <span className="absolute bottom-0.75 left-1/2 h-37.5 w-82.5 -translate-x-1/2 bg-auth-grid bg-size-[28px_28px] mask-[radial-gradient(ellipse,var(--color-mask)_20%,transparent_70%)] transform-[translateX(-50%)_perspective(250px)_rotateX(62deg)]" />
            <img
              src={heroImage}
              alt=""
              className="absolute top-[47%] left-1/2 z-2 w-57.5 -translate-x-1/2 -translate-y-1/2 drop-shadow-hero"
            />
          </div>
        </div>
        <p className="relative z-1 m-0 text-[11px] tracking-[.7px] text-auth-footer">
          Tecnologia a serviço do seu legado.
        </p>
      </section>

      <section className="relative flex h-dvh min-h-0 items-start justify-center overflow-hidden bg-auth-surface-glow bg-app-background px-7 pt-29 pb-20.5 sm:items-center sm:px-[clamp(40px,7vw,120px)] sm:py-18 [@media(max-height:700px)]:pt-21 [@media(max-height:700px)]:pb-12">
        <div className="absolute top-7 left-7 lg:hidden">
          <Brand mobile />
        </div>

        <div className="w-full max-w-107.5">
          <div className="mb-7.5 sm:mb-9.5 [@media(max-height:700px)]:mb-5">
            <h2 className="mt-4.5 mb-2 font-[Manrope] text-[27px] leading-[1.2] font-bold tracking-[-1.2px] text-foreground sm:text-[32px]">
              Bem-vindo de volta
            </h2>
            <p className="m-0 text-sm text-muted">
              Entre com seus dados para acessar sua conta.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            {error && <p role="alert" className="mb-4 rounded-xl bg-danger-soft p-3 text-xs font-medium text-danger">{error}</p>}
            <InputField
              id="email"
              label="E-mail"
              name="email"
              type="email"
              placeholder="seuemail@exemplo.com"
              autoComplete="email"
              required
              leadingIcon={
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <rect x="3" y="5" width="18" height="14" rx="3" />
                  <path d="m4 7 8 6 8-6" />
                </svg>
              }
            />

            <InputPasswordField
              name="password"
              placeholder="Digite sua senha"
              autoComplete="current-password"
              required
            />

            <button
              type="submit"
              disabled={submitting}
              className="group mt-2 flex h-13.75 w-full cursor-pointer items-center justify-center gap-2.75 rounded-[11px] border-0 bg-linear-[105deg,var(--color-brand-900),var(--color-brand-600)] text-sm font-bold text-white transition hover:-translate-y-0.5 active:translate-y-0 disabled:cursor-wait disabled:opacity-60"
            >
              {submitting ? "Entrando..." : "Entrar na plataforma"}
              <svg
                className="w-4.5 fill-none stroke-current stroke-2 transition [stroke-linecap:round] [stroke-linejoin:round] group-hover:translate-x-0.75"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M5 12h14M14 7l5 5-5 5" />
              </svg>
            </button>
          </form>

          <div className="mt-8 border-t border-border-input pt-6.25 text-center text-[11px] text-muted [@media(max-height:700px)]:mt-4 [@media(max-height:700px)]:pt-4">
            <span>Precisa de ajuda?</span>{" "}
            <a
              href="mailto:suporte@ecclesia.com.br"
              className="font-bold text-brand-700"
            >
              Fale com o suporte
            </a>
          </div>
        </div>

        <footer className="absolute right-7 bottom-7 left-7 flex justify-center text-[10px] text-muted-faint sm:right-[clamp(40px,7vw,100px)] sm:left-[clamp(40px,7vw,100px)] sm:justify-between [@media(max-height:700px)]:bottom-3">
          <span>© 2026 Ecclesia Patrimônio</span>
          <nav aria-label="Links legais" className="hidden gap-5.5 sm:flex">
            <a className="hover:text-brand-700" href="#privacidade">
              Privacidade
            </a>
            <a className="hover:text-brand-700" href="#termos">
              Termos de uso
            </a>
          </nav>
        </footer>
      </section>
    </main>
  );
};
