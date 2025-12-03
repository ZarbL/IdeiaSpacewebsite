'use client';

import React from 'react';
import styles from './TechnologyCard.module.css';

interface TechnologyCardProps {
  title: string;
  description: string;
  image: string;
}

export default function TechnologyCard({ title, description, image }: TechnologyCardProps) {
  return (
    <div className={styles.card} style={{ backgroundImage: `url(${image})` }}>
      <p className={styles.cardTitle}>{title}</p>
      <div className={styles.cardContent}>
        <p>{description}</p>
      </div>
    </div>
  );
}
