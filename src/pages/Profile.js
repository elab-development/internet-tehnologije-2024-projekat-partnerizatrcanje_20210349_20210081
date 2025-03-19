import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/profil.css";

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    profileImage: "https://via.placeholder.com/150",
    name: "Ivan Zekić",
    email: "ivan@example.com",
    height: 180,
    weight: 75,
    description: "Strastveni trkač i ljubitelj tehnologije."
  });
  const [editingField, setEditingField] = useState(null);
  const [imageChanged, setImageChanged] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [settingsForm, setSettingsForm] = useState({
    email: user.email,
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  
  // Podaci o bedževima - redizajnirani za trke
  const [badges, setBadges] = useState([
    { 
      id: 1, 
      name: "Maraton", 
      icon: "🏅", 
      description: "Završio maraton ispod 4h",
      type: "distance",
      event: "Belgrade Marathon 2024"
    },
    { 
      id: 2, 
      name: "Polumaraton", 
      icon: "🥈", 
      description: "Završio polumaraton ispod 2h",
      type: "distance",
      event: "Fruškogorski polumaraton"
    },
    { 
      id: 3, 
      name: "10km Trka", 
      icon: "🥉", 
      description: "Završio 10km trku",
      type: "distance",
      event: "Nike 10K Belgrade"
    },
    { 
      id: 4, 
      name: "5km Sprint", 
      icon: "🎖️", 
      description: "5km lični rekord",
      type: "achievement",
      event: "Adidas 5K Challenge"
    }
  ]);

  const handleDoubleClick = (field) => {
    // Dozvoljavamo uređivanje samo za opis
    if (field === "description") {
      setEditingField(field);
    }
  };

  const handleChange = (e) => {
    setUser({ ...user, [editingField]: e.target.value });
  };

  const handleBlur = () => {
    setEditingField(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUser({ ...user, profileImage: reader.result });
        setImageChanged(true);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleSettingsChange = (e) => {
    const { name, value } = e.target;
    setSettingsForm({ ...settingsForm, [name]: value });
  };
  
  const handleSettingsSubmit = (e) => {
    e.preventDefault();
    
    // Validacija lozinki
    if (settingsForm.newPassword !== settingsForm.confirmPassword) {
      alert("Lozinke se ne poklapaju!");
      return;
    }
    
    // Simulacija uspešne promene - sada dozvoljavamo promenu email-a kroz podešavanja
    setUser({ ...user, email: settingsForm.email });
    alert("Podešavanja uspešno sačuvana!");
    setShowSettingsModal(false);
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-image-container">
          <img
            src={user.profileImage}
            alt="Profile"
            className="profile-image"
          />
          <input
            type="file"
            id="profileImage"
            className="hidden-input"
            onChange={handleImageChange}
          />
          <label className="profile-image-button" htmlFor="profileImage">
            {imageChanged ? "Izmeni sliku" : "Dodaj sliku"}
          </label>
        </div>
        <div className="profile-description" onDoubleClick={() => handleDoubleClick("description")}>
          {editingField === "description" ? (
            <textarea
              className="profile-textarea"
              value={user.description}
              onChange={handleChange}
              onBlur={handleBlur}
              autoFocus
            />
          ) : (
            <p>{user.description}</p>
          )}
        </div>
      </div>
      <div className="profile-info">
        {[{ label: "Ime i Prezime", field: "name" }, { label: "E-mail", field: "email" }]
          .map(({ label, field }) => (
            <div key={field} className="profile-field">
              <strong>{label}:</strong>
              <div className="profile-field-value">
                <p>{user[field]}</p>
              </div>
            </div>
          ))}
        <div className="profile-field">
          <strong>Visina / Kilaža:</strong>
          <p>{user.height} cm / {user.weight} kg</p>
        </div>
      </div>
      
      {/* Sekcija sa bedževima - redizajnirana kao medalje */}
      <div className="badges-section">
        <h3 className="badges-title">Moja Dostignuća</h3>
        <div className="badges-container">
          {badges.map(badge => (
            <div key={badge.id} className="badge-item">
              <div className="badge-icon">{badge.icon}</div>
              <div className="badge-name">{badge.name}</div>
              <div className="badge-tooltip">
                {badge.description}<br/>
                <strong>{badge.event}</strong>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <button className="profile-button" onClick={() => setShowSettingsModal(true)}>
        Podešavanja
      </button>
      
      {/* Unapređeni modal za podešavanja */}
      {showSettingsModal && (
        <div className="modal-overlay">
          <div className="settings-modal">
            <h2>Podešavanja Profila</h2>
            <form onSubmit={handleSettingsSubmit}>
              <div className="modal-group">
                <label htmlFor="email">Email adresa:</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={settingsForm.email}
                  onChange={handleSettingsChange}
                  className="modal-input"
                  required
                />
              </div>
              
              <div className="modal-group">
                <label htmlFor="currentPassword">Trenutna lozinka:</label>
                <input
                  type="password"
                  id="currentPassword"
                  name="currentPassword"
                  value={settingsForm.currentPassword}
                  onChange={handleSettingsChange}
                  className="modal-input"
                  required
                />
              </div>
              
              <div className="modal-group">
                <label htmlFor="newPassword">Nova lozinka:</label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={settingsForm.newPassword}
                  onChange={handleSettingsChange}
                  className="modal-input"
                  minLength="8"
                />
              </div>
              
              <div className="modal-group">
                <label htmlFor="confirmPassword">Potvrdi novu lozinku:</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={settingsForm.confirmPassword}
                  onChange={handleSettingsChange}
                  className="modal-input"
                  minLength="8"
                />
              </div>
              
              <div className="modal-actions">
                <button type="button" className="cancel-button" onClick={() => setShowSettingsModal(false)}>
                  Otkaži
                </button>
                <button type="submit" className="save-button">
                  Sačuvaj promene
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}