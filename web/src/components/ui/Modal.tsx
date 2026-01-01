import { useEffect } from 'react';

interface ModalProps {
  aperto: boolean;
  onChiudi: () => void;
  titolo?: string;
  children: React.ReactNode;
}

export function Modal({ aperto, onChiudi, titolo, children }: ModalProps) {
  // Chiudi con ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onChiudi();
    };
    if (aperto) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [aperto, onChiudi]);

  if (!aperto) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onChiudi}
      />

      {/* Contenuto */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
        {titolo && (
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{titolo}</h3>
        )}

        <div className="text-gray-700">
          {children}
        </div>
      </div>
    </div>
  );
}
