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
          className="mb-2.25 block text-[13px] font-bold text-[#292638]"
        >
          {label}
        </label>
        {labelAction}
      </div>

      <div className="relative">
        {leadingIcon && (
          <span className="pointer-events-none absolute top-1/2 left-4 size-[19px] -translate-y-1/2 text-[#8b8898] [&_svg]:size-full [&_svg]:fill-none [&_svg]:stroke-current [&_svg]:stroke-[1.7] [&_svg]:[stroke-linecap:round] [&_svg]:[stroke-linejoin:round]">
            {leadingIcon}
          </span>
        )}

        <input
          id={id}
          className={`h-[53px] w-full rounded-[11px] border border-[#dedde6] bg-white pr-12 ${leadingIcon ? "pl-[46px]" : "pl-4"} text-[#19172c] outline-none transition placeholder:text-[#aaa8b3] hover:border-[#cac8d5] focus:border-[#6d50e8] focus:shadow-[0_0_0_4px_rgba(91,63,209,.18)] ${className}`}
          {...inputProps}
        />

        {trailingContent}
      </div>
    </div>
  );
};
