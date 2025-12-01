'use client';

export default function EcosystemCard() {
  return (
    <>
      <div className="ecosystem-card">
        <div className="card-main-content">
          <ul className="card-list">
            <li>6 horas de Treinamento para Mentores e Professores</li>
            <li>40 Planos de Aula e Guias do Professor</li>
            <li>550 acessos à Plataforma de Conteúdos</li>
            <li>110 Kits de Satélite de Treinamento (SMT)</li>
            <li>1 Kit de Construção de Satélite Orbital (PocketQube)</li>
            <li>1 Lançamento de um satélite PocketQube</li>
            <li>40 horas de suporte online para Professores</li>
          </ul>
        </div>
      </div>

      <style jsx>{`
        .ecosystem-card {
          width: 280px;
          min-height: 300px;
          padding: 18px;
          color: white;
          background: linear-gradient(#212121, #212121) padding-box,
                      linear-gradient(145deg, transparent 35%, #e81cff, #40c9ff) border-box;
          border: 2px solid transparent;
          border-radius: 12px;
          display: flex;
          flex-direction: column;
          cursor: pointer;
          transform-origin: right bottom;
          transition: all 0.6s cubic-bezier(0.23, 1, 0.320, 1);
        }

        .card-main-content {
          flex: 1;
        }

        .card-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .card-list li {
          font-size: 13px;
          font-weight: 500;
          padding-left: 20px;
          position: relative;
          line-height: 1.4;
        }

        .card-list li::before {
          content: "✓";
          position: absolute;
          left: 0;
          color: #40c9ff;
          font-weight: 700;
          font-size: 16px;
        }

        .ecosystem-card:hover {
          rotate: 8deg;
        }

        @media (max-width: 768px) {
          .ecosystem-card {
            width: 260px;
          }
          
          .card-list li {
            font-size: 12px;
          }
        }
      `}</style>
    </>
  );
}
