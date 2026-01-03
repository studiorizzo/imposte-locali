interface SidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onCreateContribuente: () => void;
}

export function Sidebar({ currentView, onNavigate, onCreateContribuente }: SidebarProps) {
  return (
    <aside className="w-64 bg-teal-600 min-h-screen flex flex-col">
      {/* Logo / Title */}
      <div className="p-6">
        <h1 className="text-2xl font-bold text-white tracking-wide">CalcIMU</h1>
      </div>

      {/* Create Button */}
      <div className="px-4 mb-6">
        <button
          onClick={onCreateContribuente}
          className="w-full flex items-center justify-center gap-2 bg-white/20 hover:bg-white/30 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          CREA CONTRIBUENTE
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4">
        <ul className="space-y-2">
          <li>
            <button
              onClick={() => onNavigate('dashboard')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                currentView === 'dashboard'
                  ? 'bg-white/20 text-white'
                  : 'text-white/80 hover:bg-white/10 hover:text-white'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              DASHBOARD
            </button>
          </li>
          <li>
            <button
              onClick={() => onNavigate('contribuenti')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                currentView === 'contribuenti'
                  ? 'bg-white/20 text-white'
                  : 'text-white/80 hover:bg-white/10 hover:text-white'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              CONTRIBUENTI
            </button>
          </li>
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 text-white/60 text-sm">
        v1.0.0
      </div>
    </aside>
  );
}
