// src/App.jsx
// Root component - handles page routing and user session state.
// ============================================================
// We use simple "state-based routing" instead of React Router.
// The `currentPage` state determines which page/component to show.
// This is easier to understand for beginners than URL routing.
// ============================================================

import React, { useState } from 'react';
import './styles/global.css';

// Components
import Navbar from './components/Navbar';

// Pages
import HomePage    from './pages/HomePage';
import LoginPage   from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import BrowsePage  from './pages/BrowsePage';
import UploadPage  from './pages/UploadPage';
import MyNotesPage from './pages/MyNotesPage';
import AdminPage   from './pages/AdminPage';

/**
 * App component — the root of the entire frontend application.
 *
 * State:
 * - currentPage: which page is currently shown
 * - currentUser: the logged-in user object (null if not logged in)
 */
function App() {
  // Page routing: start on the home page
  const [currentPage, setCurrentPage] = useState('home');

  // User session: stored in component state (resets on page refresh)
  // For a real app, you'd use localStorage or JWT tokens to persist login
  const [currentUser, setCurrentUser] = useState(null);

  /**
   * Navigate to a different page.
   * Some pages require login; redirect to login if not authenticated.
   */
  const navigate = (page) => {
    const protectedPages = ['upload', 'my-notes', 'admin'];

    if (protectedPages.includes(page) && !currentUser) {
      // Redirect to login if trying to access a protected page
      setCurrentPage('login');
    } else {
      setCurrentPage(page);
    }
  };

  /**
   * Called when login or registration succeeds.
   * Stores the user in state and redirects to home.
   */
  const handleLogin = (userData) => {
    setCurrentUser(userData);
    setCurrentPage('home');
  };

  /**
   * Logs the user out by clearing user state.
   */
  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentPage('home');
  };

  /**
   * Render the correct page component based on `currentPage`.
   */
  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage currentUser={currentUser} onNavigate={navigate} />;

      case 'login':
        return <LoginPage onLogin={handleLogin} onNavigate={navigate} />;

      case 'register':
        return <RegisterPage onLogin={handleLogin} onNavigate={navigate} />;

      case 'browse':
        return <BrowsePage currentUser={currentUser} />;

      case 'upload':
        // Protect: only logged-in users
        return currentUser
          ? <UploadPage currentUser={currentUser} onNavigate={navigate} />
          : <LoginPage onLogin={handleLogin} onNavigate={navigate} />;

      case 'my-notes':
        // Protect: only logged-in users
        return currentUser
          ? <MyNotesPage currentUser={currentUser} onNavigate={navigate} />
          : <LoginPage onLogin={handleLogin} onNavigate={navigate} />;

      case 'admin':
        // Protect: only ADMIN role
        return currentUser?.role === 'ADMIN'
          ? <AdminPage currentUser={currentUser} />
          : <LoginPage onLogin={handleLogin} onNavigate={navigate} />;

      default:
        return <HomePage currentUser={currentUser} onNavigate={navigate} />;
    }
  };

  return (
    <div>
      {/* Navbar appears on every page */}
      <Navbar
        currentUser={currentUser}
        currentPage={currentPage}
        onNavigate={navigate}
        onLogout={handleLogout}
      />

      {/* Render the active page */}
      <main>
        {renderPage()}
      </main>
    </div>
  );
}

export default App;
