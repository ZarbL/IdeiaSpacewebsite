'use client';

import React from 'react';
import './ResourceCard.css';

interface ResourceCardProps {
  title: string;
  description: string;
  image: string;
  isWorkInProgress?: boolean;
  link?: string;
}

const ResourceCard = ({ title, description, image, isWorkInProgress = false, link }: ResourceCardProps) => {
  const CardContent = () => (
    <div className={`resource-card ${isWorkInProgress ? 'work-in-progress' : ''}`}>
      <div className="resource-card-image">
        <img src={image} alt={title} />
        {isWorkInProgress && (
          <div className="wip-badge">Work in Progress</div>
        )}
      </div>
      <div className="resource-card-content">
        <h3 className="resource-card-title">{title}</h3>
        <p className="resource-card-description">{description}</p>
        {!isWorkInProgress && (
          <span className="resource-card-link">Learn more →</span>
        )}
      </div>
    </div>
  );

  if (link && !isWorkInProgress) {
    return (
      <a href={link} target="_blank" rel="noopener noreferrer" className="resource-card-wrapper">
        <CardContent />
      </a>
    );
  }

  return (
    <div className="resource-card-wrapper">
      <CardContent />
    </div>
  );
};

export default ResourceCard;
