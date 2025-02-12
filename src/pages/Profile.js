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

  const handleDoubleClick = (field) => {
    setEditingField(field);
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
      };
      reader.readAsDataURL(file);
    }
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
          <button className="profile-image-button" onClick={() => document.getElementById('profileImage').click()}>
            Dodaj sliku
          </button>
        </div>
        <div className="profile-description" onDoubleClick={() => handleDoubleClick("description")}> 
          {editingField === "description" ? (
            <input
              type="text"
              className="profile-input"
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
        {[
          { label: "Ime i Prezime", field: "name" },
          { label: "E-mail", field: "email" }
        ].map(({ label, field }) => (
          <div key={field} className="profile-field">
            <strong>{label}:</strong>
            <div className="profile-editable" onDoubleClick={() => handleDoubleClick(field)}>
              {editingField === field ? (
                <input
                  type="text"
                  className="profile-input"
                  value={user[field]}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  autoFocus
                />
              ) : (
                <p>{user[field]}</p>
              )}
            </div>
          </div>
        ))}
        <div className="profile-field">
          <strong>Visina / Kilaža:</strong>
          <p>{user.height} cm / {user.weight} kg</p>
        </div>
      </div>
      <button className="profile-button" onClick={() => navigate("/settings")}>
        Podešavanja
      </button>
    </div>
  );
}
