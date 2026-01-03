interface SidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onCreateContribuente: () => void;
}

export function Sidebar({ currentView, onNavigate, onCreateContribuente }: SidebarProps) {
  return (
    <aside className="w-64 bg-[#00a086] rounded-tr-3xl flex flex-col relative">
      {/* Create Button - bordi tratteggiati */}
      <div className="px-4 pt-6 pb-4">
        <button
          onClick={onCreateContribuente}
          className="w-full flex items-center gap-2 bg-[#00a086] border-2 border-dashed border-white/60 hover:bg-[#00856f] text-white font-semibold text-sm py-3 px-4 rounded-lg transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          CREA CONTRIBUENTE
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4">
        <ul className="space-y-1">
          <li className="relative">
            {/* Indicatore laterale se selezionato - sul margine della sidebar */}
            {currentView === 'dashboard' && (
              <span className="absolute -left-4 top-0 w-1 h-full bg-white" />
            )}
            <button
              onClick={() => onNavigate('dashboard')}
              className="w-full flex items-center gap-2 py-3 px-4 rounded-lg transition-colors text-white text-sm hover:bg-[#00856f]"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              DASHBOARD
            </button>
          </li>
          <li className="relative">
            {/* Indicatore laterale se selezionato - sul margine della sidebar */}
            {currentView === 'contribuenti' && (
              <span className="absolute -left-4 top-0 w-1 h-full bg-white" />
            )}
            <button
              onClick={() => onNavigate('contribuenti')}
              className="w-full flex items-center gap-2 py-3 px-4 rounded-lg transition-colors text-white text-sm hover:bg-[#00856f]"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              CONTRIBUENTI
            </button>
          </li>
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 text-white/60 text-sm">
        v1.0
      </div>
    </aside>
  );
}
