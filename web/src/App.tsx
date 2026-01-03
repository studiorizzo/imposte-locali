import { useState, useEffect } from 'react';
import { Header, Footer } from './components/layout';
import { ImmobiliStep } from './components/forms';
import { Dashboard } from './components/Dashboard';
import { RiepilogoCalcolo } from './components/RiepilogoCalcolo';
import { calcolaRiepilogoIMU, ANNO_RIFERIMENTO } from '@lib';
import type { DatiImmobile, RiepilogoIMU } from '@lib';
import './index.css';

type ViewType = 'dashboard' | 'form' | 'riepilogo';

function App() {
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [immobili, setImmobili] = useState<DatiImmobile[]>([]);
  const [riepilogo, setRiepilogo] = useState<RiepilogoIMU | null>(null);

  // Scroll to top quando cambia la vista
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentView]);

  const handleAddImmobile = (immobile: DatiImmobile) => {
    setImmobili((prev) => [...prev, immobile]);
  };

  const handleRemoveImmobile = (id: string) => {
    setImmobili((prev) => prev.filter((i) => i.id !== id));
  };

  const handleGoToForm = () => {
    setCurrentView('form');
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
  };

  const handleCalcolaIMU = () => {
    const result = calcolaRiepilogoIMU(
      ANNO_RIFERIMENTO,
      '', // Contribuente vuoto per ora
      immobili
    );
    setRiepilogo(result);
    setCurrentView('riepilogo');
  };

  const handleReset = () => {
    setCurrentView('dashboard');
    setImmobili([]);
    setRiepilogo(null);
  };

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <Dashboard
            immobili={immobili}
            onAddImmobile={handleGoToForm}
            onRemoveImmobile={handleRemoveImmobile}
            onCalcolaIMU={handleCalcolaIMU}
          />
        );
      case 'form':
        return (
          <div className="max-w-6xl mx-auto">
            <div className="mb-4">
              <button
                onClick={handleBackToDashboard}
                className="inline-flex items-center text-blue-600 hover:text-blue-800"
              >
                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Torna alla dashboard
              </button>
            </div>
            <ImmobiliStep
              immobili={immobili}
              onAddImmobile={(imm) => {
                handleAddImmobile(imm);
                handleBackToDashboard();
              }}
              onRemoveImmobile={handleRemoveImmobile}
            />
          </div>
        );
      case 'riepilogo':
        return riepilogo ? (
          <div className="max-w-4xl mx-auto">
            <div className="mb-4">
              <button
                onClick={handleBackToDashboard}
                className="inline-flex items-center text-blue-600 hover:text-blue-800"
              >
                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Torna alla dashboard
              </button>
            </div>
            <RiepilogoCalcolo riepilogo={riepilogo} onReset={handleReset} />
          </div>
        ) : null;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1 w-full px-4 py-8">
        {renderContent()}
      </main>

      <Footer />
    </div>
  );
}

export default App;
