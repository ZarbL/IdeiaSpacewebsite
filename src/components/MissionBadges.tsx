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
              <p className="mission-description">{selectedMission.missionDescription}</p>
            </div>
            <div className="mission-image-wrapper">
              <Image
                src={selectedMission.missionImage}
                alt={selectedMission.studentName}
                fill
                className="mission-image"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
