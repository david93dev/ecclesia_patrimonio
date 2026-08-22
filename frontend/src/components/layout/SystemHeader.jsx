export const SystemHeader = ({
  eyebrow = "Painel administrativo",
  title = "Visão geral",
  organization = "Paróquia São José",
  location = "Fortaleza, CE",
  onSearch,
  onNotifications,
}) => {
  return (
    <header className="sticky top-0 z-20 flex h-18 items-center justify-between border-b border-border/90 bg-app-background/90 px-5 backdrop-blur-xl sm:px-8 lg:px-10">
      <div className="ml-12 lg:ml-0">
        <p className="text-[10px] font-bold tracking-[.14em] text-muted-soft uppercase">
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
          className="grid size-9 cursor-pointer place-items-center rounded-xl border border-border-control bg-surface text-muted transition hover:border-border-hover-soft hover:text-brand-700"
        >
          <FiSearch size={18} aria-hidden="true" />
        </button>

        <button
          type="button"
          onClick={onNotifications}
          aria-label="Notificações"
          className="relative grid size-9 cursor-pointer place-items-center rounded-xl border border-border-control bg-surface text-muted transition hover:border-border-hover-soft hover:text-brand-700"
        >
          <FiBell size={18} aria-hidden="true" />
          <i className="absolute top-2 right-2 size-1.5 rounded-full bg-accent ring-2 ring-surface" />
        </button>

        <span className="ml-1 hidden text-right sm:block">
          <strong className="block text-[11px]">{organization}</strong>
          <small className="block text-[9px] text-muted-soft">{location}</small>
        </span>
      </div>
    </header>
  );
};
import { FiBell, FiSearch } from "react-icons/fi";
