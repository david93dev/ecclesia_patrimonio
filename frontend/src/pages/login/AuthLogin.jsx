import heroImage from "../../assets/hero.png";
import ecclesiaLogo from "../../assets/ecclesia-logo-v3.png";
import { InputField } from "../../components/ui/inputfield";
import { InputPasswordFiled } from "../../components/ui/inputPasswordFiled";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const Brand = ({ mobile = false }) => (
  <a
    href="/"
    aria-label="Ecclesia Patrimônio — início"
    className={`relative z-10 block w-fit ${mobile ? "rounded-xl bg-[#16103d] px-3 py-1.5 shadow-[0_8px_24px_rgba(22,16,61,.15)]" : ""}`}
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

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    login({ email: data.get("email") });
    navigate(location.state?.from?.pathname || "/dashboard", { replace: true });
  };

  return (
    <main className="grid h-dvh max-h-dvh min-h-0 grid-cols-1 overflow-hidden lg:grid-cols-[minmax(430px,.94fr)_minmax(520px,1.06fr)]">
      <section aria-label="Apresentação do sistema" className="relative hidden h-dvh min-h-0 flex-col overflow-hidden bg-[#16103d] px-[clamp(42px,5vw,76px)] pt-10.5 pb-8.5 text-white lg:flex [@media(max-height:760px)]:pt-7 [@media(max-height:760px)]:pb-6">
        <div className="pointer-events-none absolute inset-0 opacity-[.18] bg-[radial-gradient(rgba(255,255,255,.28)_.7px,transparent_.7px)] bg-size-[18px_18px] mask-[linear-gradient(to_bottom,#000,transparent_72%)]" />
        <div className="absolute top-[29%] -left-57.5 size-140 rounded-full bg-[rgba(106,70,232,.3)] blur-[100px]" />
        <Brand />

        <div className="relative z-1 my-auto pt-10 [@media(max-height:760px)]:pt-4">
          <span className="inline-flex items-center gap-2 text-[10px] font-bold tracking-[1.45px] text-[#c8c2df] uppercase before:h-px before:w-5.5 before:bg-[#e7ad46]">Gestão inteligente de patrimônio</span>
          <h1 className="my-5 max-w-142.5 font-[Manrope] text-[clamp(36px,3.8vw,56px)] leading-[1.1] font-bold tracking-[-2.4px]">
            Cuide do que conta<br />a sua <em className="font-normal text-[#a38eff] not-italic">história.</em>
          </h1>
          <p className="m-0 max-w-117.5 text-sm leading-[1.7] text-[#c5c0d5]">Organize, preserve e acompanhe todo o patrimônio da sua comunidade em um só lugar.</p>

          <div className="relative mt-8.5 h-61.25 [@media(max-height:760px)]:mt-2 [@media(max-height:760px)]:h-42" aria-hidden="true">
            <span className="absolute top-[34%] left-[22%] size-1.25 rounded-full bg-[#e7ad46] shadow-[0_0_22px_rgba(231,173,70,.7)]" />
            <span className="absolute top-[18%] right-[20%] size-0.75 rounded-full bg-[#e7ad46] shadow-[0_0_22px_rgba(231,173,70,.7)]" />
            <span className="absolute bottom-0.75 left-1/2 h-37.5 w-82.5 -translate-x-1/2 bg-[linear-gradient(rgba(128,97,238,.22)_1px,transparent_1px),linear-gradient(90deg,rgba(128,97,238,.22)_1px,transparent_1px)] bg-size-[28px_28px] mask-[radial-gradient(ellipse,#000_20%,transparent_70%)] transform-[translateX(-50%)_perspective(250px)_rotateX(62deg)]" />
            <img src={heroImage} alt="" className="absolute top-[47%] left-1/2 z-2 w-57.5 -translate-x-1/2 -translate-y-1/2 drop-shadow-[0_32px_35px_rgba(0,0,0,.38)]" />
          </div>
        </div>
        <p className="relative z-1 m-0 text-[11px] tracking-[.7px] text-[#827b9b]">Tecnologia a serviço do seu legado.</p>
      </section>

      <section className="relative flex h-dvh min-h-0 items-start justify-center overflow-hidden bg-[radial-gradient(circle_at_100%_0,#eeecf8_0,transparent_35%)] bg-[#f7f7fa] px-7 pt-29 pb-20.5 sm:items-center sm:px-[clamp(40px,7vw,120px)] sm:py-18 [@media(max-height:700px)]:pt-21 [@media(max-height:700px)]:pb-12">
        <div className="absolute top-7 left-7 lg:hidden"><Brand mobile /></div>

        <div className="w-full max-w-107.5">
          <div className="mb-7.5 sm:mb-9.5 [@media(max-height:700px)]:mb-5">
            <h2 className="mt-4.5 mb-2 font-[Manrope] text-[27px] leading-[1.2] font-bold tracking-[-1.2px] text-[#19172c] sm:text-[32px]">Bem-vindo de volta</h2>
            <p className="m-0 text-sm text-[#716f80]">Entre com seus dados para acessar sua conta.</p>
          </div>

          <form onSubmit={handleSubmit}>
            <InputField
              id="email"
              label="E-mail"
              name="email"
              type="email"
              placeholder="seuemail@exemplo.com"
              autoComplete="email"
              required
              leadingIcon={<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="3"/><path d="m4 7 8 6 8-6"/></svg>}
            />

            <InputPasswordFiled
              name="password"
              placeholder="Digite sua senha"
              autoComplete="current-password"
              required
            />

            <button type="submit" className="group mt-2 flex h-13.75 w-full cursor-pointer items-center justify-center gap-2.75 rounded-[11px] border-0 bg-linear-[105deg,#4931a8,#6d50e8] text-sm font-bold text-white shadow-[0_13px_26px_rgba(73,49,168,.25)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_30px_rgba(73,49,168,.32)] active:translate-y-0">
              Entrar na plataforma
              <svg className="w-4.5 fill-none stroke-current stroke-2 transition [stroke-linecap:round] [stroke-linejoin:round] group-hover:translate-x-0.75" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M14 7l5 5-5 5" /></svg>
            </button>
          </form>

          <div className="mt-8 border-t border-[#dedde6] pt-6.25 text-center text-[11px] text-[#716f80] [@media(max-height:700px)]:mt-4 [@media(max-height:700px)]:pt-4">
            <span>Precisa de ajuda?</span>{" "}<a href="mailto:suporte@ecclesia.com.br" className="font-bold text-[#5b3fd1]">Fale com o suporte</a>
          </div>
        </div>

        <footer className="absolute right-7 bottom-7 left-7 flex justify-center text-[10px] text-[#9895a2] sm:right-[clamp(40px,7vw,100px)] sm:left-[clamp(40px,7vw,100px)] sm:justify-between [@media(max-height:700px)]:bottom-3">
          <span>© 2026 Ecclesia Patrimônio</span>
          <nav aria-label="Links legais" className="hidden gap-5.5 sm:flex"><a className="hover:text-[#5b3fd1]" href="#privacidade">Privacidade</a><a className="hover:text-[#5b3fd1]" href="#termos">Termos de uso</a></nav>
        </footer>
      </section>
    </main>
  );
};
