'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import './MissionBadges.css';

interface Mission {
  id: number;
  badgeImage: string;
  badgeName: string;
  studentName: string;
  missionDescription: string;
  missionImage: string;
}

interface MissionBadgesProps {
  missions: Mission[];
}

export default function MissionBadges({ missions }: MissionBadgesProps) {
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);

  // Convert markdown-style formatting to HTML
  const formatDescription = (text: string) => {
    return text
      .replace(/\n\n/g, '<br/><br/>')
      .replace(/\*\*(.*?)\*\*/g, '<strong class="mission-objective">$1</strong>');
  };

  return (
    <div className="mission-badges-container">
      {/* Badges Grid */}
      <div className="badges-grid">
        {missions.map((mission) => (
          <button
            key={mission.id}
            className={`badge-button ${selectedMission?.id === mission.id ? 'active' : ''}`}
            onClick={() => setSelectedMission(mission)}
          >
            <div className="badge-image-wrapper">
              <Image
                src={mission.badgeImage}
                alt={mission.badgeName}
                fill
                sizes="(max-width: 768px) 150px, 200px"
                className="badge-image"
              />
            </div>
            <p className="badge-name">{mission.badgeName}</p>
          </button>
        ))}
      </div>

      {/* Mission Details */}
      {selectedMission && (
        <div className="mission-details">
          <div className="mission-details-content">
            <div className="mission-text">
              <h3 className="mission-student-name">{selectedMission.studentName}</h3>
              <p className="mission-description" dangerouslySetInnerHTML={{ __html: formatDescription(selectedMission.missionDescription) }} />
            </div>
            <div className="mission-image-wrapper">
              <Image
                src={selectedMission.missionImage}
                alt={selectedMission.studentName}
                fill
                sizes="(max-width: 768px) 100vw, 600px"
                className="mission-image"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
