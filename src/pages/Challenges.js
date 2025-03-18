import React, { useState } from 'react';
import '../styles/Challenges.css';

const Challenges = () => {
  const [joinedChallenges, setJoinedChallenges] = useState([]);
  const [allChallenges, setAllChallenges] = useState([
    { id: 1, name: '5km Run', description: 'Trčanje na 5 kilometara' },
    { id: 2, name: '10km Run', description: 'Trčanje na 10 kilometara' },
    { id: 3, name: 'Marathon', description: 'Puno trčanje za pravi maraton' },
    { id: 4, name: 'Half Marathon', description: 'Polumaraton izazov' },
    { id: 5, name: 'Trail Run', description: 'Trčanje po stazi u prirodi' },
    { id: 6, name: 'Sprinting Challenge', description: 'Izazov za sprintere' },
  ]);

  const handleJoinChallenge = (challengeId) => {
    const challenge = allChallenges.find((ch) => ch.id === challengeId);
    setJoinedChallenges([...joinedChallenges, challenge]);
  };

  const handleLeaveChallenge = (challengeId) => {
    const updatedChallenges = joinedChallenges.filter((ch) => ch.id !== challengeId);
    setJoinedChallenges(updatedChallenges);
  };

  return (
    <div className="challenges-container">
      {/* Izazovi - Svi dostupni */}
      <div className="all-challenges">
        <h2>Izazovi</h2>
        <div className="challenge-list">
          {allChallenges.map((challenge) => {
            // Provera da li je izazov već izabran
            const isAlreadyJoined = joinedChallenges.some(joinedChallenge => joinedChallenge.id === challenge.id);
            
            return (
              <div className="challenge-card" key={challenge.id}>
                <h3>{challenge.name}</h3>
                <p>{challenge.description}</p>
                <button
                  onClick={() => handleJoinChallenge(challenge.id)}
                  className={`join-button ${isAlreadyJoined ? 'disabled' : ''}`}
                  disabled={isAlreadyJoined}
                >
                  {isAlreadyJoined ? 'Pridružen' : 'Pridruži se'}
                </button>
              </div>
            );
          })}
        </div>
      </div>
     
      {/* Izazovi na koje je korisnik prijavljen */}
      <div className="joined-challenges">
        <h2>Pridruženi izazovi</h2>
        <ul>
          {joinedChallenges.map((challenge, index) => (
            <li key={index}>
              {challenge.name}
              <button
                onClick={() => handleLeaveChallenge(challenge.id)}
                className="leave-button"
              >
                Napusti izazov
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Challenges;