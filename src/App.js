import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from './firebase';
import './css/App.css';

function App() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
      const unsubscribe = auth.onAuthStateChanged(user => {
        setUser(user);
      });

      return () => unsubscribe();
    }, []);

    const handleLogout = async () => {
      try {
        await signOut(auth);
        navigate('/login');
      } catch (error) {
        console.error('Error signing out:', error);
      }
    };

    return (
      <div className="App">
        <header className="App-header">
          <h1>Timesheet App</h1>
          <nav>
            {user ? (
              <>
                <span>Welcome, {user.email}!</span>
                <Link to="/timesheet">Timesheet</Link>
                <button onClick={handleLogout}>Logout</button>
              </>
            ) : (
              <>
                <Link to="/login">Login</Link>
                <Link to="/register">Register</Link>
              </>
            )}
          </nav>
        </header>
        <main>
          <div className="welcome-section">
            <h2>Welcome to the Timesheet Application</h2>
            <p>Track your work hours efficiently with our easy-to-use timesheet system.</p>
            {!user && (
              <div className="cta-buttons">
                <Link to="/register" className="btn btn-secondary">Sign Up</Link>
                <Link to="/login" className="btn btn-secondary">Login</Link>
              </div>
            )}
          </div>
        </main>
      </div>
    );
}

export default App;