import React, { useState, useEffect } from 'react';
import '../styles/Races.css';

const Races = () => {
  const [joinedRaces, setJoinedRaces] = useState([]);
  const [allRaces, setAllRaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Dohvati korisnika iz localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('auth_token');

  // Dohvati sve trke iz API-ja
  useEffect(() => {
    const fetchRaces = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:8000/api/races', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });

        if (response.ok) {
          const racesData = await response.json();
          setAllRaces(racesData);
          
          // Filtriraj trke u koje je korisnik već pridružen (koristi backend podatke)
          const userJoinedRaces = racesData.filter(race => race.is_user_joined);
          setJoinedRaces(userJoinedRaces);
        } else {
          console.error('Greška pri dohvatanju trka:', response.status);
          setError('Greška pri učitavanju trka.');
        }
      } catch (error) {
        console.error('Greška:', error);
        setError('Došlo je do greške prilikom učitavanja trka.');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchRaces();
    } else {
      setError('Niste prijavljeni.');
      setLoading(false);
    }
  }, [token]);

  const handleJoinRace = async (raceId) => {
    try {
      const response = await fetch(`http://localhost:8000/api/races/${raceId}/join`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      const responseData = await response.json();

      if (response.ok) {
        // Osvežи sve trke da dobijеš ažurirane podatke
        const updatedResponse = await fetch('http://localhost:8000/api/races', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });

        if (updatedResponse.ok) {
          const updatedRacesData = await updatedResponse.json();
          setAllRaces(updatedRacesData);
          
          // Ažuriraj pridružene trke
          const userJoinedRaces = updatedRacesData.filter(race => race.is_user_joined);
          setJoinedRaces(userJoinedRaces);
        }

        alert('Uspešno ste se pridružili trci!');
      } else {
        alert(responseData.message || 'Greška pri pridruživanju trci.');
      }
    } catch (error) {
      console.error('Greška pri pridruživanju trci:', error);
      alert('Došlo je do greške.');
    }
  };

  const handleLeaveRace = async (raceId) => {
    try {
      const response = await fetch(`http://localhost:8000/api/races/${raceId}/leave`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      const responseData = await response.json();

      if (response.ok) {
        // Ukloni trku iz pridruženih trka
        const updatedRaces = joinedRaces.filter(r => r.id !== raceId);
        setJoinedRaces(updatedRaces);
        alert('Uspešno ste napustili trku.');
      } else {
        alert(responseData.message || 'Greška pri napuštanju trke.');
      }
    } catch (error) {
      console.error('Greška pri napuštanju trke:', error);
      alert('Došlo je do greške.');
    }
  };

  // Formatiranje samo datuma
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

  // Formatiranje vremena - poboljšano
  const formatTime = (timeString) => {
    if (!timeString) return 'N/A';
    try {
      // Ako je datetime format (2025-01-01T14:30:00.000000Z)
      if (timeString.includes('T')) {
        const date = new Date(timeString);
        return date.toLocaleTimeString('sr-RS', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: false 
        });
      }
      // Ako je već HH:MM:SS format
      return timeString.substring(0, 5); // HH:MM format
    } catch (error) {
      return 'N/A';
    }
  };

  // Proveri da li je vreme za prijavu isteklo
  const isRegistrationExpired = (raceDate, endTime) => {
    if (!raceDate || !endTime) return false;
    
    try {
      const now = new Date();
      const raceEndDateTime = new Date(`${raceDate}T${endTime}`);
      return now > raceEndDateTime;
    } catch (error) {
      return false;
    }
  };

  // Check if race is already joined - koristi backend podatke
  const isRaceJoined = (race) => {
    return race.is_user_joined || false;
  };

  if (loading) {
    return (
      <div className="races-container">
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <h2>Učitavam trke...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="races-container">
        <div style={{ textAlign: 'center', padding: '40px', color: 'red' }}>
          <h2>Greška</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="races-container">
      {/* Dostupne trke */}
      <div className="races-section">
        <h2>Biznis trke</h2>
        {allRaces.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
            <p>Trenutno nema dostupnih biznis trka.</p>
            <p><em>Administratori mogu kreirati nove trke.</em></p>
          </div>
        ) : (
          <div className="race-list">
            {allRaces.map((race) => (
              <div className="race-card" key={race.id}>
                <h3>{race.name}</h3>
                <p>{race.description}</p>
                
                {/* Informacije o trci */}
                <div className="race-details" style={{ fontSize: '0.9em', color: '#666', margin: '10px 0' }}>
                  <div><strong>Datum trke:</strong> {formatDate(race.race_date)}</div>
                  <div><strong>Vreme prijave:</strong> {formatTime(race.start_time)} - {formatTime(race.end_time)}</div>
                  <div><strong>Distanca:</strong> {race.distance} km</div>
                  <div><strong>Učesnici:</strong> {race.participants_count || 0}/{race.max_participants || 'N/A'}</div>
                  {race.prize && (
                    <div><strong>Nagrada:</strong> {race.prize}</div>
                  )}
                </div>

                {/* Status prijave */}
                <div className="race-status" style={{ fontSize: '0.85em', marginBottom: '10px' }}>
                  {isRegistrationExpired(race.race_date, race.end_time) ? (
                    <span style={{ color: '#dc3545', fontWeight: 'bold' }}>⏰ VREME ZA PRIJAVU ISTEKLO</span>
                  ) : (
                    <span style={{ color: '#28a745', fontWeight: 'bold' }}>✅ OTVORENO ZA PRIJAVE</span>
                  )}
                </div>

                {/* Dugmad */}
                {isRaceJoined(race) ? (
                  <button className="join-button joined" disabled>
                    Pridružen
                  </button>
                ) : isRegistrationExpired(race.race_date, race.end_time) ? (
                  <button className="join-button" disabled style={{ opacity: 0.5, cursor: 'not-allowed' }}>
                    Vreme isteklo
                  </button>
                ) : race.participants_count >= race.max_participants ? (
                  <button className="join-button" disabled style={{ opacity: 0.5, cursor: 'not-allowed' }}>
                    Popunjena
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
        )}
      </div>

      {/* Pridružene trke */}
      <div className="joined-races-section">
        <h2>Pridružene trke</h2>
        {joinedRaces.length === 0 ? (
          <div className="no-joined-races">
            <div className="no-joined-races-icon">🏃‍♂️</div>
            <div className="no-joined-races-text">
              Niste se pridružili nijednoj trci.
            </div>
            <div className="no-joined-races-hint">
              Pridružite se trkama da biste videli detalje ovde.
            </div>
          </div>
        ) : (
          <ul>
            {joinedRaces.map((race) => (
              <li key={race.id}>
                <div className="joined-race-header">
                  <div className="joined-race-title">{race.name}</div>
                  <div className="joined-race-status">
                    {isRegistrationExpired(race.race_date, race.end_time) ? 'ISTEKLO' : 'AKTIVNO'}
                  </div>
                </div>
                
                <div className="joined-race-details">
                  <div className="joined-race-details-row">
                    <span className="joined-race-label">Datum trke:</span>
                    <span className="joined-race-value">{formatDate(race.race_date)}</span>
                  </div>
                  <div className="joined-race-details-row">
                    <span className="joined-race-label">Distanca:</span>
                    <span className="joined-race-value">{race.distance} km</span>
                  </div>
                  <div className="joined-race-details-row">
                    <span className="joined-race-label">Vreme prijave:</span>
                    <span className="joined-race-value">{formatTime(race.start_time)} - {formatTime(race.end_time)}</span>
                  </div>
                  <div className="joined-race-details-row">
                    <span className="joined-race-label">Učesnici:</span>
                    <span className="joined-race-value">{race.participants_count}/{race.max_participants}</span>
                  </div>
                </div>
                
                {race.prize && (
                  <div className="joined-race-prize">
                    Nagrada: {race.prize}
                  </div>
                )}
                
                {/* Status za pridružene trke */}
                {isRegistrationExpired(race.race_date, race.end_time) && (
                  <div className="joined-race-expired">
                    Vreme za prijavu isteklo
                  </div>
                )}
                
                <button
                  onClick={() => handleLeaveRace(race.id)}
                  className="leave-button"
                >
                  Napusti trku
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Races;