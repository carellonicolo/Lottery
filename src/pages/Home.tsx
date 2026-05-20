import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center px-4 py-12 relative"
      style={{
        background: 'radial-gradient(ellipse at 50% 0%, hsl(220 25% 14%) 0%, hsl(220 20% 7%) 70%)',
        fontFamily: "'Space Grotesk', 'DM Sans', system-ui, sans-serif",
      }}
    >
      {/* GitHub Link */}
      <a
        href="https://github.com/carellonicolo/giocodellotto"
        target="_blank"
        rel="noopener noreferrer"
        className="absolute top-6 right-6 sm:top-8 sm:right-8 inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors"
        aria-label="Vedi codice sorgente su GitHub"
      >
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
          <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
        </svg>
        <span className="text-sm font-semibold hidden sm:inline">GitHub</span>
      </a>

      <h1
        className="text-3xl sm:text-5xl font-bold text-center mb-3 tracking-tight"
        style={{ color: 'hsl(0 0% 95%)' }}
      >
        Simulatori Lotto Italia
      </h1>
      <p
        className="text-sm sm:text-base text-center mb-10 max-w-lg"
        style={{ color: 'hsl(220 15% 55%)' }}
      >
        Strumenti didattici per lo studio della probabilità e della statistica.
        Nessun denaro reale coinvolto.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 w-full max-w-6xl">
        {/* Gioco del Lotto */}
        <Link
          to="/giocodellotto"
          className="group relative rounded-2xl p-6 sm:p-8 border transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl"
          style={{
            background: 'linear-gradient(135deg, hsl(15 85% 55% / 0.12), hsl(45 80% 55% / 0.08))',
            borderColor: 'hsl(15 85% 55% / 0.3)',
          }}
        >
          <div className="text-4xl sm:text-5xl mb-4">🎱</div>
          <h2
            className="text-xl sm:text-2xl font-bold mb-2"
            style={{ color: 'hsl(15 85% 65%)' }}
          >
            Gioco del Lotto
          </h2>
          <p className="text-sm" style={{ color: 'hsl(220 15% 60%)' }}>
            Simulatore completo con ruote, sorti, statistiche e grafici.
            Scopri le probabilità del gioco più classico d'Italia.
          </p>
          <div
            className="mt-4 inline-flex items-center text-sm font-semibold gap-1 transition-colors"
            style={{ color: 'hsl(15 80% 60%)' }}
          >
            Gioca ora
            <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
          </div>
        </Link>

        {/* SuperEnalotto */}
        <Link
          to="/superenalotto"
          className="group relative rounded-2xl p-6 sm:p-8 border transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl"
          style={{
            background: 'linear-gradient(135deg, hsl(45 100% 51% / 0.1), hsl(145 60% 42% / 0.06))',
            borderColor: 'hsl(45 100% 51% / 0.25)',
          }}
        >
          <div className="text-4xl sm:text-5xl mb-4">🎰</div>
          <h2
            className="text-xl sm:text-2xl font-bold mb-2"
            style={{ color: 'hsl(45 100% 60%)' }}
          >
            SuperEnalotto
          </h2>
          <p className="text-sm" style={{ color: 'hsl(220 15% 60%)' }}>
            Schedina, simulazione Monte Carlo, formule combinatorie
            e probabilità del jackpot.
          </p>
          <div
            className="mt-4 inline-flex items-center text-sm font-semibold gap-1 transition-colors"
            style={{ color: 'hsl(45 90% 55%)' }}
          >
            Gioca ora
            <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
          </div>
        </Link>

        {/* MillionDAY */}
        <Link
          to="/millionday"
          className="group relative rounded-2xl p-6 sm:p-8 border transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl"
          style={{
            background: 'linear-gradient(135deg, hsl(210 100% 50% / 0.1), hsl(45 100% 51% / 0.08))',
            borderColor: 'hsl(210 100% 50% / 0.3)',
          }}
        >
          <div className="text-4xl sm:text-5xl mb-4">⭐</div>
          <h2
            className="text-xl sm:text-2xl font-bold mb-2"
            style={{ color: 'hsl(45 100% 60%)' }}
          >
            MillionDAY
          </h2>
          <p className="text-sm" style={{ color: 'hsl(220 15% 60%)' }}>
            Simulatore con estrazione Base ed Extra, 
            calcolo combinatorio e probabilità su 55 numeri.
          </p>
          <div
            className="mt-4 inline-flex items-center text-sm font-semibold gap-1 transition-colors"
            style={{ color: 'hsl(45 90% 55%)' }}
          >
            Gioca ora
            <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
          </div>
        </Link>

        {/* Win for Life */}
        <Link
          to="/winforlife"
          className="group relative rounded-2xl p-6 sm:p-8 border transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl"
          style={{
            background: 'linear-gradient(135deg, hsl(140 70% 40% / 0.12), hsl(350 80% 50% / 0.06))',
            borderColor: 'hsl(140 70% 40% / 0.3)',
          }}
        >
          <div className="text-4xl sm:text-5xl mb-4">🏠</div>
          <h2
            className="text-xl sm:text-2xl font-bold mb-2"
            style={{ color: 'hsl(140 70% 55%)' }}
          >
            Win for Life
          </h2>
          <p className="text-sm" style={{ color: 'hsl(220 15% 60%)' }}>
            10 numeri su 20 + Numerone. Scopri la perfetta
            simmetria della curva a campana.
          </p>
          <div
            className="mt-4 inline-flex items-center text-sm font-semibold gap-1 transition-colors"
            style={{ color: 'hsl(140 70% 55%)' }}
          >
            Gioca ora
            <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
          </div>
        </Link>
      </div>

      {/* Footer */}
      <footer className="mt-16 text-center text-xs space-y-1" style={{ color: 'hsl(220 15% 40%)' }}>
        <p>Simulatori a scopo didattico · Non sono siti di gioco d'azzardo</p>
        <p>
          ⚠️ Il gioco d'azzardo può creare dipendenza · Telefono Verde:{' '}
          <a href="tel:800558822" className="underline hover:opacity-80">800 558 822</a>
        </p>
      </footer>
    </main>
  );
};

export default Home;
