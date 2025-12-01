'use client';

import React from 'react';

export default function ImpactCards() {
  return (
    <>
      {/* Impact Cards Row */}
      <div className="flex gap-4 flex-wrap justify-end">
        <div className="impact-card">
          <div className="impact-number">1000+</div>
          <div className="impact-text">Alunos Impactados</div>
        </div>
        <div className="impact-card">
          <div className="impact-number">50+</div>
          <div className="impact-text">Escolas Participantes</div>
        </div>
        <div className="impact-card">
          <div className="impact-number">10</div>
          <div className="impact-text">Satélites Lançados</div>
        </div>
        <div className="impact-card">
          <div className="impact-number">95%</div>
          <div className="impact-text">Taxa de Satisfação</div>
        </div>
      </div>

      <style jsx>{`
        .impact-card {
          width: 140px;
          height: 140px;
          padding: 16px;
          color: white;
          background: linear-gradient(#212121, #212121) padding-box,
                      linear-gradient(145deg, transparent 35%, #e81cff, #40c9ff) border-box;
          border: 2px solid transparent;
          border-radius: 12px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.23, 1, 0.320, 1);
        }

        .impact-number {
          font-size: 32px;
          font-weight: 700;
          background: linear-gradient(145deg, #e81cff, #40c9ff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 8px;
        }

        .impact-text {
          font-size: 12px;
          font-weight: 500;
          text-align: center;
          line-height: 1.3;
        }

        .impact-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 8px 24px rgba(232, 28, 255, 0.3);
        }

        @media (max-width: 768px) {
          .impact-card {
            width: 120px;
            height: 120px;
          }
          
          .impact-number {
            font-size: 24px;
          }
          
          .impact-text {
            font-size: 11px;
          }
        }
      `}</style>
    </>
  );
}
