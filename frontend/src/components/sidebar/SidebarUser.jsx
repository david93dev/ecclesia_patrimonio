export const SidebarUser = ({ collapsed }) => (
  <div className="border-t border-white/7 p-3">
    <div className={`flex h-14 items-center rounded-xl border border-white/7 bg-white/4 ${collapsed ? "justify-center" : "gap-3 px-2.5"}`}>
      <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-linear-to-br from-[#8063e8] to-[#4931a8] text-xs font-bold text-white shadow-[0_7px_18px_rgba(91,63,209,.3)]">DS</span>
      {!collapsed && <><span className="min-w-0 flex-1"><strong className="block truncate text-xs font-semibold text-white">David Silva</strong><small className="block truncate text-[9px] tracking-wide text-[#81799e] uppercase">Administrador</small></span><button type="button" aria-label="Sair" title="Sair" className="grid size-8 cursor-pointer place-items-center rounded-lg text-[#81799e] hover:bg-white/6 hover:text-white"><svg viewBox="0 0 24 24" className="size-4 fill-none stroke-current stroke-[1.8] [stroke-linecap:round] [stroke-linejoin:round]"><path d="M10 17l5-5-5-5m5 5H3m11-9h5a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-5"/></svg></button></>}
    </div>
  </div>
);
