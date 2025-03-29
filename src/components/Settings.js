import React, { useState, useEffect } from 'react'
import { auth } from '../firebase'
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth'
import { toast } from 'react-toastify'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faLock, 
  faBell, 
  faEye, 
  faEyeSlash,
  faToggleOn,
  faToggleOff,
  faPalette,
  faLanguage,
  faUserShield
} from '@fortawesome/free-solid-svg-icons'
import Navbar from '../Navbar'
import Sidebar from '../Sidebar'
import '../css/Settings.css'

const Settings = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordError, setPasswordError] = useState('')
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  
  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [weeklyReports, setWeeklyReports] = useState(true)
  const [reminderNotifications, setReminderNotifications] = useState(true)
  
  // Theme settings
  const [darkMode, setDarkMode] = useState(false)
  const [language, setLanguage] = useState('english')
  
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(currentUser => {
      setUser(currentUser)
      
      // Load settings from localStorage
      const savedEmailNotifications = localStorage.getItem('emailNotifications')
      const savedWeeklyReports = localStorage.getItem('weeklyReports')
      const savedReminderNotifications = localStorage.getItem('reminderNotifications')
      const savedDarkMode = localStorage.getItem('darkMode')
      const savedLanguage = localStorage.getItem('language')
      
      if (savedEmailNotifications !== null) setEmailNotifications(savedEmailNotifications === 'true')
      if (savedWeeklyReports !== null) setWeeklyReports(savedWeeklyReports === 'true')
      if (savedReminderNotifications !== null) setReminderNotifications(savedReminderNotifications === 'true')
      if (savedDarkMode !== null) setDarkMode(savedDarkMode === 'true')
      if (savedLanguage) setLanguage(savedLanguage)
      
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])
  
  // Apply dark mode if enabled
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode')
    } else {
      document.body.classList.remove('dark-mode')
    }
    localStorage.setItem('darkMode', darkMode.toString())
  }, [darkMode])

  const handleChangePassword = async (e) => {
    e.preventDefault()
    setPasswordError('')
    
    // Validate passwords
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match')
      return
    }
    
    if (newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters')
      return
    }
    
    setIsChangingPassword(true)
    
    try {
      // Re-authenticate user
      const credential = EmailAuthProvider.credential(
        user.email,
        currentPassword
      )
      
      await reauthenticateWithCredential(user, credential)
      
      // Change password
      await updatePassword(user, newPassword)
      
      // Clear form
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      
      toast.success('Password changed successfully!')
    } catch (error) {
      console.error('Error changing password:', error)
      
      if (error.code === 'auth/wrong-password') {
        setPasswordError('Current password is incorrect')
      } else {
        setPasswordError('Failed to change password. Please try again.')
      }
    } finally {
      setIsChangingPassword(false)
    }
  }

  const toggleEmailNotifications = () => {
    const newValue = !emailNotifications
    setEmailNotifications(newValue)
    localStorage.setItem('emailNotifications', newValue.toString())
    toast.success(`Email notifications ${newValue ? 'enabled' : 'disabled'}`)
  }

  const toggleWeeklyReports = () => {
    const newValue = !weeklyReports
    setWeeklyReports(newValue)
    localStorage.setItem('weeklyReports', newValue.toString())
    toast.success(`Weekly reports ${newValue ? 'enabled' : 'disabled'}`)
  }

  const toggleReminderNotifications = () => {
    const newValue = !reminderNotifications
    setReminderNotifications(newValue)
    localStorage.setItem('reminderNotifications', newValue.toString())
    toast.success(`Reminder notifications ${newValue ? 'enabled' : 'disabled'}`)
  }

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    toast.success(`Dark mode ${!darkMode ? 'enabled' : 'disabled'}`)
  }

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value)
    localStorage.setItem('language', e.target.value)
    toast.success(`Language changed to ${e.target.value}`)
  }

  if (loading) {
    return (
      <div className="settings-page">
        <Navbar user={user} />
        <div className="settings-content">
          <Sidebar />
          <div className="main-content">
            <div className="loading-spinner"></div>
            <p>Loading settings...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="settings-page">
      <Navbar user={user} />
      <div className="settings-content">
        <Sidebar />
        <main className="main-content">
          <div className="settings-header">
            <h2>Settings</h2>
            <p>Manage your account settings and preferences</p>
          </div>
          
          <div className="settings-container">
            <div className="settings-sidebar">
              <ul className="settings-nav">
                <li className="active">
                  <a href="#security">
                    <FontAwesomeIcon icon={faLock} /> Security
                  </a>
                </li>
                <li>
                  <a href="#notifications">
                    <FontAwesomeIcon icon={faBell} /> Notifications
                  </a>
                </li>
                <li>
                  <a href="#appearance">
                    <FontAwesomeIcon icon={faPalette} /> Appearance
                  </a>
                </li>
                <li>
                  <a href="#privacy">
                    <FontAwesomeIcon icon={faUserShield} /> Privacy
                  </a>
                </li>
              </ul>
            </div>
            
            <div className="settings-details">
              <section id="security" className="settings-section">
                <h3>Security Settings</h3>
                
                <div className="settings-card">
                  <h4>Change Password</h4>
                  <form onSubmit={handleChangePassword}>
                    <div className="form-group">
                      <label>Current Password</label>
                      <div className="password-input-container">
                        <input 
                          type={showCurrentPassword ? "text" : "password"} 
                          value={currentPassword} 
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          required
                        />
                        <button 
                          type="button" 
                          className="password-toggle"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        >
                          <FontAwesomeIcon icon={showCurrentPassword ? faEyeSlash : faEye} />
                        </button>
                      </div>
                    </div>
                    
                    <div className="form-group">
                      <label>New Password</label>
                      <div className="password-input-container">
                        <input 
                          type={showNewPassword ? "text" : "password"} 
                          value={newPassword} 
                          onChange={(e) => setNewPassword(e.target.value)}
                          required
                        />
                        <button 
                          type="button" 
                          className="password-toggle"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                        >
                          <FontAwesomeIcon icon={showNewPassword ? faEyeSlash : faEye} />
                        </button>
                      </div>
                    </div>
                    
                    <div className="form-group">
                      <label>Confirm New Password</label>
                      <div className="password-input-container">
                        <input 
                          type={showConfirmPassword ? "text" : "password"} 
                          value={confirmPassword} 
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                        />
                        <button 
                          type="button" 
                          className="password-toggle"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
                        </button>
                      </div>
                    </div>
                    
                    {passwordError && <div className="error-message">{passwordError}</div>}
                    
                    <button 
                      type="submit" 
                      className="save-button"
                      disabled={isChangingPassword}
                    >
                      {isChangingPassword ? 'Changing...' : 'Change Password'}
                    </button>
                  </form>
                </div>
                
                <div className="settings-card">
                  <h4>Two-Factor Authentication</h4>
                  <p>Add an extra layer of security to your account by enabling two-factor authentication.</p>
                  <button className="primary-button">Enable 2FA</button>
                </div>
              </section>
              
              <section id="notifications" className="settings-section">
                <h3>Notification Settings</h3>
                
                <div className="settings-card">
                  <div className="toggle-setting">
                    <div className="toggle-info">
                      <h4>Email Notifications</h4>
                      <p>Receive email notifications about your timesheet status and approvals.</p>
                    </div>
                    <div className="toggle-control" onClick={toggleEmailNotifications}>
                      <FontAwesomeIcon 
                        icon={emailNotifications ? faToggleOn : faToggleOff} 
                        className={emailNotifications ? 'toggle-on' : 'toggle-off'}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="settings-card">
                  <div className="toggle-setting">
                    <div className="toggle-info">
                      <h4>Weekly Reports</h4>
                      <p>Receive weekly summary reports of your timesheet activity.</p>
                    </div>
                    <div className="toggle-control" onClick={toggleWeeklyReports}>
                      <FontAwesomeIcon 
                        icon={weeklyReports ? faToggleOn : faToggleOff} 
                        className={weeklyReports ? 'toggle-on' : 'toggle-off'}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="settings-card">
                  <div className="toggle-setting">
                    <div className="toggle-info">
                      <h4>Reminder Notifications</h4>
                      <p>Receive reminders to submit your timesheet before deadlines.</p>
                    </div>
                    <div className="toggle-control" onClick={toggleReminderNotifications}>
                      <FontAwesomeIcon 
                        icon={reminderNotifications ? faToggleOn : faToggleOff} 
                        className={reminderNotifications ? 'toggle-on' : 'toggle-off'}
                      />
                    </div>
                  </div>
                </div>
              </section>
              
              <section id="appearance" className="settings-section">
                <h3>Appearance Settings</h3>
                
                <div className="settings-card">
                  <div className="toggle-setting">
                    <div className="toggle-info">
                      <h4>Dark Mode</h4>
                      <p>Switch between light and dark themes.</p>
                    </div>
                    <div className="toggle-control" onClick={toggleDarkMode}>
                      <FontAwesomeIcon 
                        icon={darkMode ? faToggleOn : faToggleOff} 
                        className={darkMode ? 'toggle-on' : 'toggle-off'}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="settings-card">
                  <h4>Language</h4>
                  <p>Select your preferred language for the application.</p>
                  <div className="form-group">
                    <select 
                      value={language} 
                      onChange={handleLanguageChange}
                      className="language-select"
                    >
                      <option value="english">English</option>
                      <option value="spanish">Spanish</option>
                      <option value="french">French</option>
                      <option value="german">German</option>
                    </select>
                  </div>
                </div>
              </section>
              
              <section id="privacy" className="settings-section">
                <h3>Privacy Settings</h3>
                
                <div className="settings-card">
                  <h4>Data Privacy</h4>
                  <p>Manage how your data is used and stored within the application.</p>
                  <button className="secondary-button">Manage Data</button>
                </div>
                
                <div className="settings-card">
                  <h4>Delete Account</h4>
                  <p>Permanently delete your account and all associated data.</p>
                  <button className="danger-button">Delete Account</button>
                </div>
              </section>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default Settings