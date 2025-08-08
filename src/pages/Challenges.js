import React, { useState, useEffect } from 'react';
import '../styles/Challenges.css';

const Challenges = () => {
  const [joinedChallenges, setJoinedChallenges] = useState([]);
  const [allChallenges, setAllChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Dohvati korisnika iz localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('auth_token');

  // Dohvati sve izazove iz API-ja
  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:8000/api/challenges', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });

        if (response.ok) {
          const challengesData = await response.json();
          setAllChallenges(challengesData);
          
          // Filtriraj izazove u koje je korisnik već pridružen (koristi backend podatke)
          const userJoinedChallenges = challengesData.filter(challenge => challenge.is_user_joined);
          setJoinedChallenges(userJoinedChallenges);
        } else {
          console.error('Greška pri dohvatanju izazova:', response.status);
          setError('Greška pri učitavanju izazova.');
        }
      } catch (error) {
        console.error('Greška:', error);
        setError('Došlo je do greške prilikom učitavanja izazova.');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchChallenges();
    } else {
      setError('Niste prijavljeni.');
      setLoading(false);
    }
  }, [token]);

  const handleJoinChallenge = async (challengeId) => {
    try {
      const response = await fetch(`http://localhost:8000/api/challenges/${challengeId}/join`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      const responseData = await response.json();

      if (response.ok) {
        // Osvežи sve izazove da dobijеš ažurirane podatke
        const updatedResponse = await fetch('http://localhost:8000/api/challenges', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });

        if (updatedResponse.ok) {
          const updatedChallengesData = await updatedResponse.json();
          setAllChallenges(updatedChallengesData);
          
          // Ažuriraj pridružene izazove
          const userJoinedChallenges = updatedChallengesData.filter(challenge => challenge.is_user_joined);
          setJoinedChallenges(userJoinedChallenges);
        }

        alert('Uspešno ste se pridružili izazovu!');
      } else {
        alert(responseData.message || 'Greška pri pridruživanju izazovu.');
      }
    } catch (error) {
      console.error('Greška pri pridruživanju izazovu:', error);
      alert('Došlo je do greške.');
    }
  };

  const handleLeaveChallenge = async (challengeId) => {
    try {
      const response = await fetch(`http://localhost:8000/api/challenges/${challengeId}/leave`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      const responseData = await response.json();

      if (response.ok) {
        // Osvežи sve izazove
        const updatedResponse = await fetch('http://localhost:8000/api/challenges', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });

        if (updatedResponse.ok) {
          const updatedChallengesData = await updatedResponse.json();
          setAllChallenges(updatedChallengesData);
          
          // Ažuriraj pridružene izazove
          const userJoinedChallenges = updatedChallengesData.filter(challenge => challenge.is_user_joined);
          setJoinedChallenges(userJoinedChallenges);
        }

        alert('Uspešno ste napustili izazov.');
      } else {
        alert(responseData.message || 'Greška pri napuštanju izazova.');
      }
    } catch (error) {
      console.error('Greška pri napuštanju izazova:', error);
      alert('Došlo je do greške.');
    }
  };

  // Formatiranje datuma
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('sr-RS', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (error) {
      return 'N/A';
    }
  };

  // Proveri da li je izazov aktivan
  const isChallengeActive = (challenge) => {
    return challenge.is_active || false;
  };

  // Check if challenge is already joined - koristi backend podatke
  const isChallengeJoined = (challenge) => {
    return challenge.is_user_joined || false;
  };

  if (loading) {
    return (
      <div className="challenges-container">
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <h2>Učitavam izazove...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="challenges-container">
        <div style={{ textAlign: 'center', padding: '40px', color: 'red' }}>
          <h2>Greška</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="challenges-container">
      {/* Izazovi - Svi dostupni */}
      <div className="all-challenges">
        <h2>Izazovi</h2>
        {allChallenges.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
            <p>Trenutno nema dostupnih izazova.</p>
            <p><em>Administratori mogu kreirati nove izazove.</em></p>
          </div>
        ) : (
          <div className="challenge-list">
            {allChallenges.map((challenge) => (
              <div className="challenge-card" key={challenge.id}>
                <h3>{challenge.name}</h3>
                <p>{challenge.description}</p>
                
                {/* Dodatne informacije o izazovu */}
                <div className="challenge-details" style={{ fontSize: '0.9em', color: '#666', margin: '10px 0' }}>
                  <div><strong>Početak:</strong> {formatDate(challenge.start_date)}</div>
                  <div><strong>Kraj:</strong> {formatDate(challenge.end_date)}</div>
                  <div><strong>Ciljna distanca:</strong> {challenge.target_distance} km</div>
                  <div><strong>Trajanje:</strong> {challenge.duration_days} dana</div>
                  {challenge.prize && (
                    <div><strong>Nagrada:</strong> {challenge.prize}</div>
                  )}
                  <div><strong>Učesnici:</strong> {challenge.participants_count || 0}</div>
                </div>

                {/* Status izazova */}
                <div className="challenge-status" style={{ fontSize: '0.85em', marginBottom: '10px' }}>
                  {isChallengeActive(challenge) ? (
                    <span style={{ color: '#28a745', fontWeight: 'bold' }}>🟢 AKTIVAN</span>
                  ) : (
                    <span style={{ color: '#dc3545', fontWeight: 'bold' }}>🔴 ZAVRŠEN</span>
                  )}
                </div>

                {/* Dugmad */}
                {isChallengeJoined(challenge) ? (
                  <button className="join-button disabled" disabled>
                    Pridružen
                  </button>
                ) : isChallengeActive(challenge) ? (
                  <button
                    onClick={() => handleJoinChallenge(challenge.id)}
                    className="join-button"
                  >
                    Pridruži se
                  </button>
                ) : (
                  <button className="join-button disabled" disabled>
                    Završen
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
     
      {/* Izazovi na koje je korisnik prijavljen */}
      <div className="joined-challenges">
        <h2>Pridruženi izazovi</h2>
        {joinedChallenges.length === 0 ? (
          <p style={{ color: '#666', fontStyle: 'italic' }}>
            Niste se pridružili nijednom izazovu.
          </p>
        ) : (
          <ul>
            {joinedChallenges.map((challenge) => (
              <li key={challenge.id} style={{ marginBottom: '15px', padding: '15px', background: '#f8f9fa', borderRadius: '8px' }}>
                <div>
                  <strong>{challenge.name}</strong>
                  <div style={{ fontSize: '0.9em', color: '#666', margin: '8px 0' }}>
                    <div>Početak: {formatDate(challenge.start_date)} | Kraj: {formatDate(challenge.end_date)}</div>
                    <div>Cilj: {challenge.target_distance} km | Trajanje: {challenge.duration_days} dana</div>
                    {challenge.prize && <div>Nagrada: {challenge.prize}</div>}
                    <div style={{ 
                      marginTop: '5px',
                      color: isChallengeActive(challenge) ? '#28a745' : '#dc3545',
                      fontWeight: 'bold'
                    }}>
                      Status: {isChallengeActive(challenge) ? 'AKTIVAN' : 'ZAVRŠEN'}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleLeaveChallenge(challenge.id)}
                  className="leave-button"
                  style={{ marginTop: '8px' }}
                >
                  Napusti izazov
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Challenges;