'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import './ScrollIndicator.css';

const ScrollIndicator = () => {
  const t = useTranslations('common');
  
  return (
    <div className="scroll-indicator-wrapper">
      <p className="scroll-text">{t('scrollForMore')}</p>
      <button className="mouse">
        <div className="scroll" />
      </button>
    </div>
  );
}

export default ScrollIndicator;
