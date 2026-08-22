export const InputField = ({
  id,
  label,
  labelAction,
  leadingIcon,
  trailingContent,
  className = "",
  containerClassName = "",
  ...inputProps
}) => {
  return (
    <div className={`mb-5.5 ${containerClassName}`}>
      <div className="flex items-center justify-between">
        <label
          htmlFor={id}
          className="mb-2.25 block text-xs font-bold text-label"
        >
          {label}
        </label>
        {labelAction}
      </div>

      <div className="relative">
        {leadingIcon && (
          <span className="pointer-events-none absolute top-1/2 left-4 size-[19px] -translate-y-1/2 text-muted-soft [&_svg]:size-full [&_svg]:fill-none [&_svg]:stroke-current [&_svg]:stroke-[1.7] [&_svg]:[stroke-linecap:round] [&_svg]:[stroke-linejoin:round]">
            {leadingIcon}
          </span>
        )}

        <input
          id={id}
          className={`h-[53px] w-full rounded-[11px] border border-border-input bg-surface pr-12 ${leadingIcon ? "pl-[46px]" : "pl-4"} text-sm text-foreground outline-none transition placeholder:text-placeholder hover:border-border-hover focus:border-brand-600 focus:shadow-focus ${className}`}
          {...inputProps}
        />

        {trailingContent}
      </div>
    </div>
  );
};
