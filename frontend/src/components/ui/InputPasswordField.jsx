import { useState } from "react";
import { InputField } from "./InputField";

const EyeIcon = ({ hidden }) => hidden ? (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="m3 3 18 18M10.6 10.7a2 2 0 0 0 2.7 2.7M9.9 4.2A10.7 10.7 0 0 1 12 4c5.5 0 9 5.3 9 5.3a12.6 12.6 0 0 1-2.2 2.8M6.6 6.6A15.2 15.2 0 0 0 3 9.3s3.5 5.3 9 5.3c.9 0 1.8-.1 2.6-.4" />
  </svg>
) : (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M3 12s3.5-5.3 9-5.3S21 12 21 12s-3.5 5.3-9 5.3S3 12 3 12Z" />
    <circle cx="12" cy="12" r="2.3" />
  </svg>
);

const LockIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <rect x="5" y="10" width="14" height="11" rx="3" />
    <path d="M8 10V7a4 4 0 0 1 8 0v3" />
  </svg>
);

export const InputPasswordField = ({
  id = "password",
  label = "Senha",
  forgotPasswordHref = "#recuperar",
  forgotPasswordLabel = "Esqueceu a senha?",
  ...inputProps
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <InputField
      id={id}
      label={label}
      type={showPassword ? "text" : "password"}
      labelAction={forgotPasswordHref && (
        <a
          href={forgotPasswordHref}
          className="mb-2.25 text-[11px] font-bold text-brand-700 hover:text-brand-900 hover:underline"
        >
          {forgotPasswordLabel}
        </a>
      )}
      leadingIcon={<LockIcon />}
      trailingContent={
        <button
          type="button"
          onClick={() => setShowPassword((value) => !value)}
          aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
          aria-pressed={showPassword}
          className="absolute top-1/2 right-2.5 grid size-8.5 -translate-y-1/2 cursor-pointer place-items-center rounded-lg border-0 bg-transparent text-icon-muted hover:bg-brand-100 hover:text-brand-700 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand-700"
        >
          <span className="block size-4.75 [&_svg]:size-full [&_svg]:fill-none [&_svg]:stroke-current [&_svg]:stroke-[1.7] [&_svg]:[stroke-linecap:round] [&_svg]:[stroke-linejoin:round]">
            <EyeIcon hidden={showPassword} />
          </span>
        </button>
      }
      {...inputProps}
    />
  );
};
