export const SystemHeader = ({
  eyebrow = "Painel administrativo",
  title = "Visão geral",
  organization = "Paróquia São José",
  location = "Fortaleza, CE",
  onSearch,
  onNotifications,
}) => {
  return (
    <header className="sticky top-0 z-20 flex h-18 items-center justify-between border-b border-[#e5e3eb]/90 bg-[#f7f7fa]/90 px-5 backdrop-blur-xl sm:px-8 lg:px-10">
      <div className="ml-12 lg:ml-0">
        <p className="text-[10px] font-bold tracking-[.14em] text-[#8b8797] uppercase">
          {eyebrow}
        </p>
        <h1 className="font-[Manrope] text-lg font-bold tracking-[-.4px]">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onSearch}
          aria-label="Pesquisar"
          className="grid size-9 cursor-pointer place-items-center rounded-xl border border-[#e2e0e8] bg-white text-[#777486] transition hover:border-[#cfc9e8] hover:text-[#5b3fd1]"
        >
          <FiSearch size={18} aria-hidden="true" />
        </button>

        <button
          type="button"
          onClick={onNotifications}
          aria-label="Notificações"
          className="relative grid size-9 cursor-pointer place-items-center rounded-xl border border-[#e2e0e8] bg-white text-[#777486] transition hover:border-[#cfc9e8] hover:text-[#5b3fd1]"
        >
          <FiBell size={18} aria-hidden="true" />
          <i className="absolute top-2 right-2 size-1.5 rounded-full bg-[#e7ad46] ring-2 ring-white" />
        </button>

        <span className="ml-1 hidden text-right sm:block">
          <strong className="block text-[11px]">{organization}</strong>
          <small className="block text-[9px] text-[#8b8797]">{location}</small>
        </span>
      </div>
    </header>
  );
};
import { FiBell, FiSearch } from "react-icons/fi";
