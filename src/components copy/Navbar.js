import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { toast } from 'react-toastify';
import '../css/Navbar.css';

const Navbar = ({ user }) => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await signOut(auth);
            toast.success('Logged out successfully', {
                position: "top-right",
                autoClose: 3000
            });
            navigate('/login');
        } catch (error) {
            console.error('Error signing out:', error);
            toast.error('Failed to log out', {
                position: "top-right",
                autoClose: 3000
            });
        }
    };

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <Link to="/dashboard">
                    <h1>TimeTracker</h1>
                </Link>
            </div>
            
            <div className="navbar-menu">
                {user ? (
                    <div className="navbar-user">
                        <div className="user-info">
                            <span className="user-email">{user.email}</span>
                        </div>
                        <button className="logout-button" onClick={handleLogout}>
                            Logout
                        </button>
                    </div>
                ) : (
                    <div className="navbar-auth">
                        <Link to="/login" className="login-button">Login</Link>
                        <Link to="/register" className="register-button">Register</Link>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
