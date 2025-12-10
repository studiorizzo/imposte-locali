export function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="text-center text-sm text-gray-500">
          <p>
            Calcolatore IMU basato sulla{' '}
            <a
              href="https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:legge:2019-12-27;160"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-600 hover:underline"
            >
              L. 160/2019
            </a>
          </p>
          <p className="mt-2">
            Questo strumento è fornito a scopo informativo. Verificare sempre con il proprio Comune
            le aliquote applicabili.
          </p>
        </div>
      </div>
    </footer>
  );
}
