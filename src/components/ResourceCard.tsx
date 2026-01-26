'use client';

import React from 'react';
import './ResourceCard.css';
import { useRouter, usePathname } from 'next/navigation';

interface ResourceCardProps {
  title: string;
  description: string;
  image: string;
  isWorkInProgress?: boolean;
  link?: string;
}

const ResourceCard = ({ title, description, image, isWorkInProgress = false, link }: ResourceCardProps) => {
  const router = useRouter();
  const pathname = usePathname();
  
  const handleClick = () => {
    // Extrai o locale da URL atual (ex: /pt/technologies -> pt)
    const locale = pathname.split('/')[1];
    // Redireciona para a página principal com hash para a seção de contato
    router.push(`/${locale}#contact`);
  };

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
        <div className="resource-card-button">
          <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
          <span>Saiba Mais</span>
        </div>
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
    <div className="resource-card-wrapper" onClick={handleClick} style={{ cursor: 'pointer' }}>
      <CardContent />
    </div>
  );
};

export default ResourceCard;
