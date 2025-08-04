import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/profil.css";

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: "",
    surname: "",
    email: "",
    height: null,
    weight: null,
    description: "",
    profile_image_url: null
  });
  const [editingField, setEditingField] = useState(null);
  const [imageChanged, setImageChanged] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  
  const [settingsForm, setSettingsForm] = useState({
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  // Mock badges - ovo možeš kasnije povezati sa bazom
  const [badges] = useState([
    {
      id: 1,
      name: "Prvi post",
      icon: "🏅",
      description: "Kreirao prvi plan trčanja",
      type: "achievement",
      event: "Dobrodošlica u SprintLink"
    },
    {
      id: 2,
      name: "Aktivni korisnik",
      icon: "🥈",
      description: "Više od 5 planova",
      type: "activity",
      event: "Kontinuirana aktivnost"
    }
  ]);

  // Učitaj korisnikove podatke
  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("auth_token");
      
      const response = await fetch("http://localhost:8000/api/user", {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
          "Accept": "application/json"
        }
      });

      if (response.ok) {
        const userData = await response.json();
        setUser({
          ...userData,
          profile_image_url: userData.profile_image_url || "https://via.placeholder.com/150"
        });
        setSettingsForm({
          email: userData.email,
          currentPassword: "",
          newPassword: "",
          confirmPassword: ""
        });
      } else {
        console.error("Failed to fetch user profile");
        // Ako je 401, preusmeri na login
        if (response.status === 401) {
          localStorage.removeItem("auth_token");
          localStorage.removeItem("user");
          navigate("/login");
        }
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDoubleClick = (field) => {
    if (["description", "height", "weight"].includes(field)) {
      setEditingField(field);
    }
  };

  const handleChange = (e) => {
    const value = e.target.value;
    const updatedValue =
      editingField === "height" || editingField === "weight"
        ? Number(value) || ""
        : value;

    setUser({ ...user, [editingField]: updatedValue });
  };

  const handleBlur = async () => {
    if (editingField) {
      await saveField(editingField, user[editingField]);
      setEditingField(null);
    }
  };

  const saveField = async (field, value) => {
    try {
      setSaving(true);
      const token = localStorage.getItem("auth_token");
      
      // Za osnovna polja (height, weight, description) ne treba lozinka
      const updateData = { [field]: value };
      
      const response = await fetch(`http://localhost:8000/api/user/${user.id}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(updateData)
      });

      if (response.ok) {
        console.log(`${field} saved successfully`);
      } else {
        const errorData = await response.json();
        console.error("Failed to save field:", errorData);
        alert("Greška pri čuvanju: " + (errorData.message || errorData.error || "Nepoznata greška"));
      }
    } catch (error) {
      console.error("Error saving field:", error);
      alert("Greška pri čuvanju podataka");
    } finally {
      setSaving(false);
    }
  };

  const handleImageChange = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  // Validacija fajla
  if (file.size > 2 * 1024 * 1024) {
    alert("Slika je prevelika. Maksimalna veličina je 2MB.");
    return;
  }

  if (!file.type.startsWith('image/')) {
    alert("Molimo selektujte validnu sliku.");
    return;
  }

  try {
    setUploadingImage(true);
    const token = localStorage.getItem("auth_token");
    
    const formData = new FormData();
    formData.append('profile_image', file);

    const response = await fetch(`http://localhost:8000/api/user/${user.id}/upload-image`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Accept": "application/json"
      },
      body: formData
    });

    if (response.ok) {
      const data = await response.json();
      
      // AŽURIRAJ SLIKU SA CACHE BUSTING
      setUser(prevUser => ({ 
        ...prevUser, 
        profile_image_url: data.image_url + '?v=' + Date.now(),
        profile_image: data.image_path
      }));
      
      setImageChanged(true);
      alert("Profilna slika je uspešno ažurirana!");
      
      // FORSIRAJ RELOAD SLIKE
      const imgElement = document.querySelector('.profile-image');
      if (imgElement) {
        imgElement.src = data.image_url + '?v=' + Date.now();
      }
      
    } else {
      const errorData = await response.json();
      alert("Greška pri upload-u slike: " + (errorData.message || "Nepoznata greška"));
    }
  } catch (error) {
    console.error("Error uploading image:", error);
    alert("Greška pri upload-u slike");
  } finally {
    setUploadingImage(false);
  }
};

  const handleSettingsChange = (e) => {
    const { name, value } = e.target;
    setSettingsForm({ ...settingsForm, [name]: value });
  };

  const handleSettingsSubmit = async (e) => {
    e.preventDefault();

    if (settingsForm.newPassword !== settingsForm.confirmPassword) {
      alert("Lozinke se ne poklapaju!");
      return;
    }

    if (settingsForm.newPassword && settingsForm.newPassword.length < 8) {
      alert("Nova lozinka mora imati najmanje 8 karaktera!");
      return;
    }

    try {
      setSaving(true);
      const token = localStorage.getItem("auth_token");
      
      const updateData = {
        email: settingsForm.email,
        current_password: settingsForm.currentPassword
      };

      if (settingsForm.newPassword) {
        updateData.password = settingsForm.newPassword;
        updateData.password_confirmation = settingsForm.confirmPassword;
      }

      const response = await fetch(`http://localhost:8000/api/user/${user.id}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(updateData)
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUser({ ...user, email: settingsForm.email });
        alert("Podešavanja uspešno sačuvana!");
        setShowSettingsModal(false);
        setSettingsForm({
          ...settingsForm,
          currentPassword: "",
          newPassword: "",
          confirmPassword: ""
        });
      } else {
        const errorData = await response.json();
        alert("Greška: " + (errorData.message || "Neispravni podaci"));
      }
    } catch (error) {
      console.error("Error updating settings:", error);
      alert("Greška pri ažuriranju podešavanja");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProfile = () => {
    setShowDeleteConfirmation(true);
  };

  const confirmDeleteProfile = async () => {
    try {
      const token = localStorage.getItem("auth_token");
      
      const response = await fetch(`http://localhost:8000/api/user/${user.id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json"
        }
      });

      if (response.ok) {
        alert("Profil je uspešno obrisan!");
        localStorage.removeItem("auth_token");
        localStorage.removeItem("user");
        navigate("/login");
      } else {
        const errorData = await response.json();
        alert("Greška pri brisanju profila: " + (errorData.message || "Nepoznata greška"));
      }
    } catch (error) {
      console.error("Error deleting profile:", error);
      alert("Greška pri brisanju profila");
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirmation(false);
  };

  if (loading) {
    return (
      <div className="profile-container">
        <div className="loading-message">
          <p>Učitavanje profila...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-image-container">
          <img
            src={user.profile_image_url}
            alt="Profile"
            className="profile-image"
          />
          <input
            type="file"
            id="profileImage"
            className="hidden-input"
            onChange={handleImageChange}
            accept="image/*"
            disabled={uploadingImage}
          />
          <label className="profile-image-button" htmlFor="profileImage">
            {uploadingImage ? "Upload..." : (imageChanged ? "Izmeni sliku" : "Dodaj sliku")}
          </label>
        </div>
        <div className="profile-description" onDoubleClick={() => handleDoubleClick("description")}>
          {editingField === "description" ? (
            <textarea
              className="profile-textarea"
              value={user.description || ""}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Dodaj opis o sebi..."
              autoFocus
              disabled={saving}
            />
          ) : (
            <p>{user.description || "Kliknite dvaput da dodate opis..."}</p>
          )}
        </div>
      </div>

      <div className="profile-info">
        <div className="profile-field">
          <strong>Ime i Prezime:</strong>
          <div className="profile-field-value">
            <p>{user.name} {user.surname}</p>
          </div>
        </div>
        
        <div className="profile-field">
          <strong>E-mail:</strong>
          <div className="profile-field-value">
            <p>{user.email}</p>
          </div>
        </div>
        
        <div
          className="profile-field"
          onDoubleClick={() => handleDoubleClick("height")}
        >
          <strong>Visina:</strong>
          {editingField === "height" ? (
            <input
              type="number"
              value={user.height || ""}
              onChange={handleChange}
              onBlur={handleBlur}
              className="profile-input"
              placeholder="cm"
              min="100"
              max="250"
              autoFocus
              disabled={saving}
            />
          ) : (
            <p>{user.height ? `${user.height} cm` : "Kliknite dvaput da dodate visinu"}</p>
          )}
        </div>

        <div
          className="profile-field"
          onDoubleClick={() => handleDoubleClick("weight")}
        >
          <strong>Kilaža:</strong>
          {editingField === "weight" ? (
            <input
              type="number"
              value={user.weight || ""}
              onChange={handleChange}
              onBlur={handleBlur}
              className="profile-input"
              placeholder="kg"
              min="30"
              max="300"
              step="0.1"
              autoFocus
              disabled={saving}
            />
          ) : (
            <p>{user.weight ? `${user.weight} kg` : "Kliknite dvaput da dodate kilažu"}</p>
          )}
        </div>
      </div>

      <div className="badges-section">
        <h3 className="badges-title">Moja Dostignuća</h3>
        <div className="badges-container">
          {badges.map(badge => (
            <div key={badge.id} className="badge-item">
              <div className="badge-icon">{badge.icon}</div>
              <div className="badge-name">{badge.name}</div>
              <div className="badge-tooltip">
                {badge.description}<br />
                <strong>{badge.event}</strong>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button 
        className="profile-button" 
        onClick={() => setShowSettingsModal(true)}
        disabled={saving}
      >
        {saving ? "Čuva..." : "Podešavanja"}
      </button>

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
                  disabled={saving}
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
                  disabled={saving}
                />
              </div>

              <div className="modal-group">
                <label htmlFor="newPassword">Nova lozinka (opciono):</label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={settingsForm.newPassword}
                  onChange={handleSettingsChange}
                  className="modal-input"
                  minLength="8"
                  disabled={saving}
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
                  disabled={saving}
                />
              </div>

              <div className="modal-actions">
                <button 
                  type="button" 
                  className="cancel-button" 
                  onClick={() => setShowSettingsModal(false)}
                  disabled={saving}
                >
                  Otkaži
                </button>
                <button 
                  type="submit" 
                  className="save-button"
                  disabled={saving}
                >
                  {saving ? "Čuva..." : "Sačuvaj promene"}
                </button>
              </div>

              <div className="delete-button-only">
                <button 
                  type="button" 
                  className="delete-profile-button" 
                  onClick={handleDeleteProfile}
                  disabled={saving}
                >
                  Obriši profil
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDeleteConfirmation && (
        <div className="modal-overlay">
          <div className="confirmation-modal">
            <h2>Da li ste sigurni?</h2>
            <p>Ova akcija će trajno obrisati vaš profil i sve povezane podatke. Ova akcija se ne može poništiti.</p>
            <div className="confirmation-actions">
              <button className="cancel-delete-button" onClick={cancelDelete}>
                Odustani
              </button>
              <button className="confirm-delete-button" onClick={confirmDeleteProfile}>
                DA, obriši profil
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}