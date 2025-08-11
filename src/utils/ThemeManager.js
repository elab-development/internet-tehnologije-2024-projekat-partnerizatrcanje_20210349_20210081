// ThemeManager.js - napravi ovaj fajl u src/utils/
export class ThemeManager {
  static applyTheme() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userRole = user.role || 'guest';
    
    // Ukloni postojeće teme
    document.body.classList.remove('admin-theme', 'user-theme', 'guest-theme');
    
    // Dodaj odgovarajuću temu
    if (userRole === 'admin') {
      document.body.classList.add('admin-theme');
      console.log('🔵 Admin tema aktivirana');
    } else if (userRole === 'user') {
      document.body.classList.add('user-theme');
      console.log('🟠 User tema aktivirana');
    } else {
      document.body.classList.add('guest-theme');
      console.log('🟡 Guest tema aktivirana');
    }
  }
  
  static getCurrentTheme() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.role || 'guest';
  }
  
  static isAdmin() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.role === 'admin';
  }
  
  static isUser() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.role === 'user';
  }
  
  static isGuest() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.role === 'guest';
  }
}

// Auto-apply theme when module loads
ThemeManager.applyTheme();