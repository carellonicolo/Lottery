import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center px-4 py-12"
      style={{
        background: 'radial-gradient(ellipse at 50% 0%, hsl(220 25% 14%) 0%, hsl(220 20% 7%) 70%)',
        fontFamily: "'Space Grotesk', 'DM Sans', system-ui, sans-serif",
      }}
    >
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 w-full max-w-5xl">
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
