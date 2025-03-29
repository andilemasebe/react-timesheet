import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from './firebase';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, 
  faSignOutAlt, 
  faCog, 
  faBell,
  faCamera
} from '@fortawesome/free-solid-svg-icons';
import './Navbar.css';

const Navbar = ({ user }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState(3); // Example notification count
  const [profileImage, setProfileImage] = useState(null);
  const fileInputRef = useRef(null);
  const dropdownRef = useRef(null);

  // Load profile image from localStorage on component mount
  useEffect(() => {
    const savedImage = localStorage.getItem('profileImage');
    if (savedImage) {
      setProfileImage(savedImage);
    }
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      // Redirect is handled by auth state change in App.js
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageData = reader.result;
        setProfileImage(imageData);
        localStorage.setItem('profileImage', imageData);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeProfileImage = (e) => {
    e.stopPropagation();
    setProfileImage(null);
    localStorage.removeItem('profileImage');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <img src="/logo.png" alt="Timesheet App Logo" className="logo-image" />
          {/* You can keep or remove the text based on your preference */}
          {/* Timesheet App */}
        </Link>        
        <div className="navbar-right">
          <div className="navbar-notifications">
            <FontAwesomeIcon icon={faBell} />
            {notifications > 0 && <span className="notification-badge">{notifications}</span>}
          </div>
          
          <div className="navbar-profile" ref={dropdownRef}>
            <div className="profile-image-container" onClick={toggleDropdown}>
              {profileImage ? (
                <div className="profile-image" style={{ backgroundImage: `url(${profileImage})` }}>
                  <div className="profile-image-overlay">
                    <FontAwesomeIcon icon={faCamera} />
                  </div>
                </div>
              ) : (
                <div className="profile-placeholder" onClick={toggleDropdown}>
                  <FontAwesomeIcon icon={faUser} />
                  <div className="profile-image-overlay">
                    <FontAwesomeIcon icon={faCamera} />
                  </div>
                </div>
              )}
            </div>
            
            {dropdownOpen && (
              <div className="profile-dropdown">
                <div className="profile-header">
                  <div className="profile-info">
                    <h4>{user ? user.displayName || user.email : 'Guest User'}</h4>
                    <p>{user ? user.email : 'Not signed in'}</p>
                  </div>
                </div>
                
                <div className="profile-image-upload" onClick={handleImageClick}>
                  <FontAwesomeIcon icon={faCamera} />
                  <span>Change Profile Picture</span>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleImageChange} 
                    accept="image/*" 
                    style={{ display: 'none' }} 
                  />
                </div>
                
                {profileImage && (
                  <div className="profile-image-remove" onClick={removeProfileImage}>
                    <span>Remove Profile Picture</span>
                  </div>
                )}
                
                <div className="dropdown-divider"></div>
                
                <Link to="/profile" className="dropdown-item">
                  <FontAwesomeIcon icon={faUser} />
                  <span>My Profile</span>
                </Link>
                
                <Link to="/settings" className="dropdown-item">
                  <FontAwesomeIcon icon={faCog} />
                  <span>Settings</span>
                </Link>
                
                <div className="dropdown-divider"></div>
                
                <div className="dropdown-item logout" onClick={handleLogout}>
                  <FontAwesomeIcon icon={faSignOutAlt} />
                  <span>Logout</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
