import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { confirmPasswordReset, verifyPasswordResetCode } from 'firebase/auth';
import { auth } from './firebase';
import { toast } from 'react-toastify';
import './css/PasswordResetConfirm.css';

const PasswordResetConfirm = () => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [verifying, setVerifying] = useState(true);
    const [email, setEmail] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    // Extract the action code (oobCode) from the URL
    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const actionCode = queryParams.get('oobCode');
        
        if (!actionCode) {
            setError('Invalid password reset link. Please request a new one.');
            setVerifying(false);
            
            // Show error toast
            toast.error('Invalid password reset link. Please request a new one.', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            return;
        }

        // Verify the action code is valid
        const verifyCode = async () => {
            try {
                const email = await verifyPasswordResetCode(auth, actionCode);
                setEmail(email);
                setVerifying(false);
                
                // Show info toast
                toast.info(`Verified reset link for ${email}`, {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
            } catch (error) {
                setError('This password reset link has expired or is invalid. Please request a new one.');
                setVerifying(false);
                
                // Show error toast
                toast.error('This password reset link has expired or is invalid.', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
            }
        };

        verifyCode();
    }, [location]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        // Validate passwords
        if (newPassword !== confirmPassword) {
            setError("Passwords don't match");
            
            // Show error toast
            toast.error("Passwords don't match", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            return;
        }

        if (newPassword.length < 6) {
            setError("Password must be at least 6 characters");
            
            // Show error toast
            toast.error("Password must be at least 6 characters", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            return;
        }
        
        setLoading(true);
        
        try {
            const queryParams = new URLSearchParams(location.search);
            const actionCode = queryParams.get('oobCode');
            
            // Complete the password reset
            await confirmPasswordReset(auth, actionCode, newPassword);
            setSuccess(true);
            
            // Show success toast with redirect confirmation
            toast.success('Password reset successful! Redirecting to login page...', {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            
            // Clear form
            setNewPassword('');
            setConfirmPassword('');
            
            // Redirect to login after 3 seconds
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (error) {
            setError(error.message);
            console.error('Password reset error:', error);
            
            // Show error toast
            toast.error(`Failed to reset password: ${error.message}`, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        } finally {
            setLoading(false);
        }
    };

    if (verifying) {
        return (
            <div className="password-reset-confirm-container">
                <div className="loading-message">
                    <h2>Verifying your reset link...</h2>
                    <div className="loading-spinner"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="password-reset-confirm-container">
            <form onSubmit={handleSubmit}>
                <h2>Reset Your Password</h2>
                
                {error && <div className="error-message">{error}</div>}
                
                {success ? (
                    <div className="success-message">
                        <p>Your password has been reset successfully!</p>
                        <p>You will be redirected to the login page shortly.</p>
                    </div>
                ) : (
                    <>
                        {email && (
                            <div className="email-info">
                                <p>Setting new password for: <strong>{email}</strong></p>
                            </div>
                        )}
                        
                        <div className="form-group">
                            <label htmlFor="newPassword">New Password</label>
                            <input 
                                type="password" 
                                id="newPassword"
                                placeholder="Enter new password" 
                                value={newPassword} 
                                onChange={(e) => setNewPassword(e.target.value)} 
                                required 
                            />
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="confirmPassword">Confirm Password</label>
                            <input 
                                type="password" 
                                id="confirmPassword"
                                placeholder="Confirm new password" 
                                value={confirmPassword} 
                                onChange={(e) => setConfirmPassword(e.target.value)} 
                                required 
                            />
                        </div>
                        
                        <button type="submit" disabled={loading} className="reset-button">
                            {loading ? 'Resetting...' : 'Reset Password'}
                        </button>
                    </>
                )}
                
                <div className="back-to-login">
                    <a href="/login">Back to Login</a>
                </div>
            </form>
        </div>
    );
};

export default PasswordResetConfirm;
