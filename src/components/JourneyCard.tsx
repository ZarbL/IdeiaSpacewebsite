'use client';

import React from 'react';
import './JourneyCard.css';

interface JourneyCardProps {
  title: string;
  months: string;
  description: string;
  color: string;
}

const JourneyCard = ({ title, months, description, color }: JourneyCardProps) => {
  return (
    <div className="journey-card">
      <div className="journey-card-inner">
        <div className="journey-card-front" style={{ backgroundColor: color, borderColor: color }}>
          <div className="journey-card-content">
            <h3>{title}</h3>
            <p className="journey-months">{months}</p>
          </div>
        </div>
        <div className="journey-card-back" style={{ backgroundColor: color, borderColor: color }}>
          <p>{description}</p>
        </div>
      </div>
    </div>
  );
}

export default JourneyCard;
