import React, { useState } from 'react';
import '../styles/Races.css';

const Races = () => {
  const [joinedRaces, setJoinedRaces] = useState([]);
  const [allRaces, setAllRaces] = useState([
    { id: 1, name: 'Adidas 5km Run', description: 'Virtuelna trka na 5 kilometara sponzorisana od strane Adidasa' },
    { id: 2, name: 'Adidas 10km Run', description: 'Virtuelna trka na 10 kilometara sponzorisana od strane Adidasa' },
    { id: 3, name: 'Nike Half Marathon', description: 'Virtuelni polumaraton sponzorisan od strane Nike-a' },
    { id: 4, name: 'Nike Full Marathon', description: 'Virtuelni maraton sponzorisan od strane Nike-a' },
    { id: 5, name: 'Puma Sprint Challenge', description: 'Izazov za sprintere sponzorisan od strane Pume' },
    { id: 6, name: 'Reebok Trail Race', description: 'Trka kroz prirodu sponzorisana od strane Reeboka' },
  ]);

  const handleJoinRace = (raceId) => {
    const race = allRaces.find((r) => r.id === raceId);
    if (!joinedRaces.some((r) => r.id === raceId)) {
      setJoinedRaces([...joinedRaces, race]);
    }
  };

  const handleLeaveRace = (raceId) => {
    const updatedRaces = joinedRaces.filter((r) => r.id !== raceId);
    setJoinedRaces(updatedRaces);
  };

  // Check if race is already joined
  const isRaceJoined = (raceId) => {
    return joinedRaces.some((race) => race.id === raceId);
  };

  return (
    <div className="races-container">
      {/* Dostupne trke */}
      <div className="races-section">
        <h2>Virtuelne trke</h2>
        <div className="race-list">
          {allRaces.map((race) => (
            <div className="race-card" key={race.id}>
              <h3>{race.name}</h3>
              <p>{race.description}</p>
              {isRaceJoined(race.id) ? (
                <button
                  className="join-button joined"
                  disabled
                >
                  Pridružen
                </button>
              ) : (
                <button
                  onClick={() => handleJoinRace(race.id)}
                  className="join-button"
                >
                  Pridruži se
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
      {/* Pridružene trke */}
      <div className="joined-races-section">
        <h2>Pridružene trke</h2>
        <ul>
          {joinedRaces.map((race) => (
            <li key={race.id}>
              {race.name}
              <button
                onClick={() => handleLeaveRace(race.id)}
                className="leave-button"
              >
                Napusti trku
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Races;