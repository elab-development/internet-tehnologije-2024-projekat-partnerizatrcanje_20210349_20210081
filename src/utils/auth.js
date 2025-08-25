// src/utils/auth.js

export const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const getCurrentToken = () => {
  return localStorage.getItem('auth_token');
};

export const isGuest = () => {
  const user = getCurrentUser();
  return user?.role === 'guest';
};

export const isRegularUser = () => {
  const user = getCurrentUser();
  return user?.role === 'user';
};

export const isAdmin = () => {
  const user = getCurrentUser();
  return user?.role === 'admin';
};

export const canCreateContent = () => {
  // Samo registrovani korisnici i admini mogu da kreiraju sadržaj
  return isRegularUser() || isAdmin();
};

export const canInteractWithPosts = () => {
  // Samo registrovani korisnici i admini mogu da interaguju sa postovima
  return isRegularUser() || isAdmin();
};

export const hasProfile = () => {
  // Gosti nemaju profil
  return !isGuest();
};

export const logout = async () => {
  const API_BASE_URL = "http://localhost:8000/api";
  const token = getCurrentToken();
  const user = getCurrentUser();
  
  try {
    // Pozovi logout endpoint
    const response = await fetch(`${API_BASE_URL}/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    // Za guest korisnike, pozovi poseban endpoint koji briše account
    if (user?.role === 'guest') {
      await fetch(`${API_BASE_URL}/delete-guest-account`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
    }

    // Obriši iz localStorage
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    
    return true;
  } catch (error) {
    console.error('Logout error:', error);
    // Čak i ako API poziv ne uspe, obriši lokalno
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    return false;
  }
};