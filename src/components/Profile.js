import React, { useState, useEffect, useRef } from 'react';
import { auth } from '../firebase';
import { updateProfile } from 'firebase/auth';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, 
  faEnvelope, 
  faCalendarAlt, 
  faEdit,
  faCamera,
  faSave,
  faTimes
} from '@fortawesome/free-solid-svg-icons';
import Navbar from '../Navbar';
import Sidebar from '../Sidebar';
import '../css/Profile.css';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileImage, setProfileImage] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [department, setDepartment] = useState('');
  const [bio, setBio] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(currentUser => {
      setUser(currentUser);
      if (currentUser) {
        setDisplayName(currentUser.displayName || '');
        
        // Load profile data from localStorage
        const savedImage = localStorage.getItem('profileImage');
        if (savedImage) {
          setProfileImage(savedImage);
        }
        
        setJobTitle(localStorage.getItem('jobTitle') || 'Not specified');
        setDepartment(localStorage.getItem('department') || 'Not specified');
        setBio(localStorage.getItem('bio') || 'No bio available');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

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
        toast.success('Profile picture updated successfully!');
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleEditMode = () => {
    setEditMode(!editMode);
  };

  const saveChanges = async () => {
    try {
      // Update Firebase display name
      if (user) {
        await updateProfile(user, {
          displayName: displayName
        });
      }
      
      // Save other profile data to localStorage
      localStorage.setItem('jobTitle', jobTitle);
      localStorage.setItem('department', department);
      localStorage.setItem('bio', bio);
      
      setEditMode(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile. Please try again.');
    }
  };

  const cancelEdit = () => {
    // Reset to saved values
    setDisplayName(user?.displayName || '');
    setJobTitle(localStorage.getItem('jobTitle') || 'Not specified');
    setDepartment(localStorage.getItem('department') || 'Not specified');
    setBio(localStorage.getItem('bio') || 'No bio available');
    setEditMode(false);
  };

  if (loading) {
    return (
      <div className="profile-page">
        <Navbar user={user} />
        <div className="profile-content">
          <Sidebar />
          <div className="main-content">
            <div className="loading-spinner"></div>
            <p>Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <Navbar user={user} />
      <div className="profile-content">
        <Sidebar />
        <main className="main-content">
          <div className="profile-header">
            <h2>My Profile</h2>
            <p>View and edit your profile information</p>
          </div>
          
          <div className="profile-container">
            <div className="profile-sidebar">
              <div className="profile-image-container">
                {profileImage ? (
                  <div 
                    className="profile-image large" 
                    style={{ backgroundImage: `url(${profileImage})` }}
                    onClick={handleImageClick}
                  >
                    <div className="profile-image-overlay">
                      <FontAwesomeIcon icon={faCamera} />
                      <span>Change Photo</span>
                    </div>
                  </div>
                ) : (
                  <div 
                    className="profile-placeholder large"
                    onClick={handleImageClick}
                  >
                    <FontAwesomeIcon icon={faUser} size="2x" />
                    <div className="profile-image-overlay">
                      <FontAwesomeIcon icon={faCamera} />
                      <span>Upload Photo</span>
                    </div>
                  </div>
                )}
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleImageChange} 
                  accept="image/*" 
                  style={{ display: 'none' }} 
                />
              </div>
              
              <div className="profile-stats">
                <div className="stat-item">
                  <h4>Total Hours</h4>
                  <p>120</p>
                </div>
                <div className="stat-item">
                  <h4>Projects</h4>
                  <p>5</p>
                </div>
                <div className="stat-item">
                  <h4>Joined</h4>
                  <p>Jan 2023</p>
                </div>
              </div>
            </div>
            
            <div className="profile-details">
              {!editMode ? (
                <>
                  <div className="profile-actions">
                    <button className="edit-button" onClick={toggleEditMode}>
                      <FontAwesomeIcon icon={faEdit} /> Edit Profile
                    </button>
                  </div>
                  
                  <div className="profile-section">
                    <h3>Personal Information</h3>
                    <div className="profile-field">
                      <div className="field-icon">
                        <FontAwesomeIcon icon={faUser} />
                      </div>
                      <div className="field-content">
                        <label>Full Name</label>
                        <p>{displayName || 'Not specified'}</p>
                      </div>
                    </div>
                    
                    <div className="profile-field">
                      <div className="field-icon">
                        <FontAwesomeIcon icon={faEnvelope} />
                      </div>
                      <div className="field-content">
                        <label>Email</label>
                        <p>{user?.email}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="profile-section">
                    <h3>Work Information</h3>
                    <div className="profile-field">
                      <div className="field-icon">
                        <FontAwesomeIcon icon={faUser} />
                      </div>
                      <div className="field-content">
                        <label>Job Title</label>
                        <p>{jobTitle}</p>
                      </div>
                    </div>
                    
                    <div className="profile-field">
                      <div className="field-icon">
                        <FontAwesomeIcon icon={faCalendarAlt} />
                      </div>
                      <div className="field-content">
                        <label>Department</label>
                        <p>{department}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="profile-section">
                    <h3>About Me</h3>
                    <p className="profile-bio">{bio}</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="profile-actions edit-actions">
                    <button className="save-button" onClick={saveChanges}>
                      <FontAwesomeIcon icon={faSave} /> Save Changes
                    </button>
                    <button className="cancel-button" onClick={cancelEdit}>
                      <FontAwesomeIcon icon={faTimes} /> Cancel
                    </button>
                  </div>
                  
                  <div className="profile-section">
                    <h3>Personal Information</h3>
                    <div className="profile-field edit-field">
                      <label>
                        <FontAwesomeIcon icon={faUser} /> Full Name
                      </label>
                      <input 
                        type="text" 
                        value={displayName} 
                        onChange={(e) => setDisplayName(e.target.value)}
                        placeholder="Enter your full name"
                      />
                    </div>
                    
                    <div className="profile-field edit-field">
                      <label>
                        <FontAwesomeIcon icon={faEnvelope} /> Email
                      </label>
                      <input 
                        type="email" 
                        value={user?.email} 
                        disabled 
                        className="disabled-input"
                      />
                      <small>Email cannot be changed</small>
                    </div>
                  </div>
                  
                  <div className="profile-section">
                    <h3>Work Information</h3>
                    <div className="profile-field edit-field">
                      <label>
                        <FontAwesomeIcon icon={faUser} /> Job Title
                      </label>
                      <input 
                        type="text" 
                        value={jobTitle} 
                        onChange={(e) => setJobTitle(e.target.value)}
                        placeholder="Enter your job title"
                      />
                    </div>
                    
                    <div className="profile-field edit-field">
                      <label>
                        <FontAwesomeIcon icon={faCalendarAlt} /> Department
                      </label>
                      <input 
                        type="text" 
                        value={department} 
                        onChange={(e) => setDepartment(e.target.value)}
                        placeholder="Enter your department"
                      />
                    </div>
                  </div>
                  
                  <div className="profile-section">
                    <h3>About Me</h3>
                    <textarea 
                      value={bio} 
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Tell us about yourself"
                      rows={5}
                    ></textarea>
                  </div>
                </>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Profile;
