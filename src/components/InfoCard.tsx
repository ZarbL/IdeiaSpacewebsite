'use client';

import React from 'react';

interface InfoCardProps {
  title: string;
  description: string;
  image?: string;
}

const InfoCard = ({ title, description, image }: InfoCardProps) => {
  return (
    <div className="group relative block max-w-md mx-auto h-80 lg:h-96">
      <span className="absolute inset-0 border-2 border-dashed border-white/30" />
      <div className="relative flex h-full w-full transform items-end border-2 border-white bg-gradient-to-br from-purple-900 to-blue-900 transition-transform group-hover:scale-105 overflow-hidden">
        {/* Background Image */}
        {image && (
          <div className="absolute inset-0 opacity-30">
            <img src={image} alt={title} className="w-full h-full object-cover" />
          </div>
        )}
        
        {/* Front Content */}
        <div className="relative z-10 p-6 !pt-0 transition-opacity group-hover:absolute group-hover:opacity-0 sm:p-8">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="mt-4 text-2xl font-bold text-white sm:text-3xl">{title}</h2>
        </div>
        
        {/* Back Content */}
        <div className="absolute p-6 opacity-0 transition-opacity group-hover:relative group-hover:opacity-100 sm:p-8 z-10">
          <h3 className="mt-4 text-2xl font-bold text-white sm:text-3xl">{title}</h3>
          <p className="mt-4 text-sm sm:text-base text-white leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}

export default InfoCard;
