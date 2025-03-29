import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../css/Sidebar.css';

const Sidebar = () => {
    const location = useLocation();
    
    // Function to check if a link is active
    const isActive = (path) => {
        return location.pathname === path;
    };

    return (
        <div className="sidebar">
            <div className="sidebar-header">
                <h3>Menu</h3>
            </div>
            
            <ul className="sidebar-menu">
                <li className={isActive('/dashboard') ? 'active' : ''}>
                    <Link to="/dashboard">
                        <i className="icon dashboard-icon"></i>
                        Dashboard
                    </Link>
                </li>
                <li className={isActive('/timesheet') ? 'active' : ''}>
                    <Link to="/timesheet">
                        <i className="icon timesheet-icon"></i>
                        Timesheet
                    </Link>
                </li>
                <li className={isActive('/reports') ? 'active' : ''}>
                    <Link to="/reports">
                        <i className="icon reports-icon"></i>
                        Reports
                    </Link>
                </li>
                <li className={isActive('/profile') ? 'active' : ''}>
                    <Link to="/profile">
                        <i className="icon profile-icon"></i>
                        Profile
                    </Link>
                </li>
            </ul>
            
            <div className="sidebar-footer">
                <p>© 2023 TimeTracker</p>
            </div>
        </div>
    );
};

export default Sidebar;
