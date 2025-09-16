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
          
          // DEBUG: Prikaži šta stiže sa backend-a
          console.log('🔍 DEBUG: Podaci sa backend-a:', challengesData);
          if (challengesData.length > 0) {
            console.log('🔍 DEBUG: Prvi izazov:', challengesData[0]);
          }
          
          setAllChallenges(challengesData);
          
          // Filtriraj izazove u koje je korisnik već pridružen
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

  // NOVA LOGIKA - koristi backend status ili napravi svoj
  const getChallengeStatus = (challenge) => {
    // Ako backend šalje status polje, koristi ga
    if (challenge.status) {
      switch (challenge.status) {
        case 'upcoming':
          return { status: 'USKORO', color: '#FFF', icon: '⏳' };
        case 'active':
          return { status: 'AKTIVAN', color: '#28a745', icon: '🟢' };
        case 'finished':
          return { status: 'ZAVRŠEN', color: '#dc3545', icon: '🔴' };
        default:
          return { status: 'NEPOZNATO', color: '#6c757d', icon: '❓' };
      }
    }

    // Fallback logika na osnovu datuma
    if (!challenge.start_date || !challenge.end_date) {
      return { status: 'NEDEFINIRANO', color: '#6c757d', icon: '❓' };
    }

    const now = new Date();
    const startDate = new Date(challenge.start_date);
    const endDate = new Date(challenge.end_date);

    console.log(`🔍 Frontend datum analiza za "${challenge.name}":`, {
      now: now.toISOString(),
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      is_active_from_backend: challenge.is_active
    });

    if (now < startDate) {
      return { status: 'USKORO', color: '#FFF', icon: '⏳' };
    } else if (now >= startDate && now <= endDate) {
      return { status: 'AKTIVAN', color: '#28a745', icon: '🟢' };
    } else {
      return { status: 'ZAVRŠEN', color: '#dc3545', icon: '🔴' };
    }
  };

  // Proveri da li je izazov dostupan za pridruživanje
  const isChallengeJoinable = (challenge) => {
    const statusInfo = getChallengeStatus(challenge);
    // Samo AKTIVAN status dozvoljava pridruživanje
    return statusInfo.status === 'AKTIVAN';
  };

  // Check if challenge is already joined
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
            {allChallenges.map((challenge) => {
              const statusInfo = getChallengeStatus(challenge);
              
              return (
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

                  {/* ISPRAVLJENI STATUS PRIKAZ */}
                  <div className="challenge-status" style={{ fontSize: '0.85em', marginBottom: '10px' }}>
                    <span style={{ color: statusInfo.color, fontWeight: 'bold' }}>
                      {statusInfo.icon} {statusInfo.status}
                    </span>
                  </div>

                  {/* ISPRAVLJENA LOGIKA ZA DUGMAD */}
                  {isChallengeJoined(challenge) ? (
                    <button className="join-button disabled" disabled>
                      Pridružen
                    </button>
                  ) : isChallengeJoinable(challenge) ? (
                    <button
                      onClick={() => handleJoinChallenge(challenge.id)}
                      className="join-button"
                    >
                      Pridruži se
                    </button>
                  ) : statusInfo.status === 'USKORO' ? (
                    <button className="join-button disabled" disabled>
                      Uskoro počinje
                    </button>
                  ) : (
                    <button className="join-button disabled" disabled>
                      Završen
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
     
      {/* Izazovi na koje je korisnik prijavljen */}
      <div className="joined-challenges">
        <h2>Pridruženi izazovi</h2>
        {joinedChallenges.length === 0 ? (
          <div className="no-joined-challenges">
            <div className="no-joined-challenges-icon">🎯</div>
            <div className="no-joined-challenges-text">
              Niste se pridružili nijednom izazovu.
            </div>
            <div className="no-joined-challenges-hint">
              Pridružite se izazovima da biste videli detalje ovde.
            </div>
          </div>
        ) : (
          <ul>
            {joinedChallenges.map((challenge) => {
              const statusInfo = getChallengeStatus(challenge);
              
              return (
                <li key={challenge.id}>
                  <div className="joined-challenge-header">
                    <div className="joined-challenge-title">{challenge.name}</div>
                    <div className="joined-challenge-status">
                      {statusInfo.status}
                    </div>
                  </div>
                  
                  <div className="joined-challenge-details">
                    <div className="joined-challenge-details-row">
                      <span className="joined-challenge-label">Početak:</span>
                      <span className="joined-challenge-value">{formatDate(challenge.start_date)}</span>
                    </div>
                    <div className="joined-challenge-details-row">
                      <span className="joined-challenge-label">Kraj:</span>
                      <span className="joined-challenge-value">{formatDate(challenge.end_date)}</span>
                    </div>
                    <div className="joined-challenge-details-row">
                      <span className="joined-challenge-label">Ciljna distanca:</span>
                      <span className="joined-challenge-value">{challenge.target_distance} km</span>
                    </div>
                    <div className="joined-challenge-details-row">
                      <span className="joined-challenge-label">Trajanje:</span>
                      <span className="joined-challenge-value">{challenge.duration_days} dana</span>
                    </div>
                    <div className="joined-challenge-details-row">
                      <span className="joined-challenge-label">Učesnici:</span>
                      <span className="joined-challenge-value">{challenge.participants_count || 0}</span>
                    </div>
                  </div>
                  
                  {challenge.prize && (
                    <div className="joined-challenge-prize">
                      Nagrada: {challenge.prize}
                    </div>
                  )}
                  
                  <button
                    onClick={() => handleLeaveChallenge(challenge.id)}
                    className="leave-button"
                  >
                    Napusti izazov
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Challenges;