import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from './firebase';
import { toast } from 'react-toastify';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faClock, 
  faCalendarAlt, 
  faClipboardCheck, 
  faChartLine,
  faProjectDiagram,
  faCheckCircle
} from '@fortawesome/free-solid-svg-icons';
import './Dashboard.css';

const Dashboard = () => {
    const [entries, setEntries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [stats, setStats] = useState({
        totalHours: 0,
        projectBreakdown: {},
        weeklyHours: []
    });
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(currentUser => {
            setUser(currentUser);
            if (!currentUser) {
                toast.error('Please login to access the dashboard', {
                    position: "top-right",
                    autoClose: 3000
                });
                navigate('/login');
            } else {
                fetchData(currentUser);
            }
        });

        return () => unsubscribe();
    }, [navigate]);

    const fetchData = async (currentUser) => {
        try {
            // Simulate data for demonstration
            const mockEntries = [
                { id: 1, date: '2023-06-01', project: 'Website Redesign', hours: 8, status: 'approved' },
                { id: 2, date: '2023-06-02', project: 'Mobile App', hours: 6, status: 'approved' },
                { id: 3, date: '2023-06-03', project: 'Database Migration', hours: 7, status: 'pending' },
                { id: 4, date: '2023-06-04', project: 'Website Redesign', hours: 5, status: 'approved' },
                { id: 5, date: '2023-06-05', project: 'Mobile App', hours: 8, status: 'pending' },
                { id: 6, date: '2023-06-06', project: 'API Integration', hours: 4, status: 'approved' },
                { id: 7, date: '2023-06-07', project: 'Database Migration', hours: 6, status: 'approved' },
            ];
            
            setEntries(mockEntries);
            calculateStats(mockEntries);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching timesheet data:', error);
            setError('Failed to load timesheet data. Please try again later.');
            toast.error('Failed to load dashboard data', {
                position: "top-right",
                autoClose: 3000
            });
            setLoading(false);
        }
    };

    const calculateStats = (entries) => {
        // Calculate total hours
        const totalHours = entries.reduce((sum, entry) => sum + entry.hours, 0);
        
        // Calculate hours by project
        const projectBreakdown = entries.reduce((projects, entry) => {
            if (!projects[entry.project]) {
                projects[entry.project] = 0;
            }
            projects[entry.project] += entry.hours;
            return projects;
        }, {});
        
        // Calculate weekly hours (last 4 weeks)
        const now = new Date();
        const fourWeeksAgo = new Date();
        fourWeeksAgo.setDate(now.getDate() - 28);
        
        // Initialize weekly buckets (4 weeks)
        const weeklyBuckets = Array(4).fill(0);
        
        entries.forEach(entry => {
            const entryDate = new Date(entry.date);
            if (entryDate >= fourWeeksAgo) {
                // Calculate which week this entry belongs to (0-3)
                const weekIndex = 3 - Math.floor((now - entryDate) / (7 * 24 * 60 * 60 * 1000));
                if (weekIndex >= 0 && weekIndex < 4) {
                    weeklyBuckets[weekIndex] += entry.hours;
                }
            }
        });
        
        // Create labels for the weeks
        const weeklyHours = weeklyBuckets.map((hours, index) => {
            const weekStart = new Date(now);
            weekStart.setDate(now.getDate() - (3 - index) * 7);
            const weekLabel = `Week ${index + 1}`;
            return { week: weekLabel, hours };
        });
        
        setStats({
            totalHours,
            projectBreakdown,
            weeklyHours
        });
    };

    const getRecentEntries = () => {
        // Sort entries by date (newest first) and take the first 5
        return [...entries]
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 5);
    };

    const getPendingApprovals = () => {
        return entries.filter(entry => entry.status === 'pending').length;
    };

    const getWeeklyHours = () => {
        const today = new Date();
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());
        
        return entries
            .filter(entry => new Date(entry.date) >= startOfWeek)
            .reduce((sum, entry) => sum + entry.hours, 0);
    };

    const getMonthlyHours = () => {
        const today = new Date();
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        
        return entries
            .filter(entry => new Date(entry.date) >= startOfMonth)
            .reduce((sum, entry) => sum + entry.hours, 0);
    };

    if (loading) {
        return (
            <div className="dashboard">
                <Navbar user={user} />
                <div className="dashboard-content">
                    <Sidebar />
                    <div className="main-content">
                        <div className="dashboard-loading">
                            <div className="loading-spinner"></div>
                            <p>Loading dashboard data...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard">
            <Navbar user={user} />
            <div className="dashboard-content">
                <Sidebar />
                <main className="main-content">
                    <div className="dashboard-header">
                        <h2>Dashboard</h2>
                        <p>Welcome back! Here's an overview of your timesheet activity.</p>
                    </div>
                    
                    <div className="dashboard-grid">
                        <div className="stat-card">
                            <div className="stat-card-icon">
                                <FontAwesomeIcon icon={faClock} />
                            </div>
                            <div className="stat-card-content">
                                <h3>Hours This Week</h3>
                                <div className="value">{getWeeklyHours()}</div>
                                <div className="stat-card-footer">
                                    <span className={getWeeklyHours() >= 40 ? "positive" : "neutral"}>
                                        {getWeeklyHours() >= 40 ? "Target reached" : "Target: 40 hours"}
                                    </span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="stat-card">
                            <div className="stat-card-icon">
                                <FontAwesomeIcon icon={faCalendarAlt} />
                            </div>
                            <div className="stat-card-content">
                                <h3>Hours This Month</h3>
                                <div className="value">{getMonthlyHours()}</div>
                                <div className="stat-card-footer">
                                    <span className="neutral">Monthly average: {Math.round(getMonthlyHours() / (new Date().getDate()))} hrs/day</span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="stat-card">
                            <div className="stat-card-icon">
                                <FontAwesomeIcon icon={faClipboardCheck} />
                            </div>
                            <div className="stat-card-content">
                                <h3>Pending Approvals</h3>
                                <div className="value">{getPendingApprovals()}</div>
                                <div className="stat-card-footer">
                                    <span className={getPendingApprovals() === 0 ? "positive" : "neutral"}>
                                        {getPendingApprovals() === 0 ? "All entries approved" : "Awaiting approval"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="dashboard-row">
                        <div className="dashboard-card recent-entries">
                            <div className="card-header">
                                <h3><FontAwesomeIcon icon={faChartLine} /> Recent Timesheets</h3>
                                <Link to="/timesheet" className="view-all-link">View All</Link>
                            </div>
                            <div className="card-content">
                                <table className="timesheet-table">
                                    <thead>
                                        <tr>
                                            <th>Date</th>
                                            <th>Project</th>
                                            <th>Hours</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {getRecentEntries().map(entry => (
                                            <tr key={entry.id}>
                                                <td>{new Date(entry.date).toLocaleDateString()}</td>
                                                <td>{entry.project}</td>
                                                <td>{entry.hours}</td>
                                                <td>
                                                    <span className={`status-badge ${entry.status}`}>
                                                        {entry.status === 'approved' ? (
                                                            <><FontAwesomeIcon icon={faCheckCircle} /> Approved</>
                                                        ) : (
                                                            'Pending'
                                                        )}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        
                        <div className="dashboard-card project-breakdown">
                            <div className="card-header">
                                <h3><FontAwesomeIcon icon={faProjectDiagram} /> Project Breakdown</h3>
                            </div>
                            <div className="card-content">
                                <div className="project-list">
                                    {Object.entries(stats.projectBreakdown).map(([project, hours]) => (
                                        <div className="project-item" key={project}>
                                            <div className="project-info">
                                                <div className="project-name">{project}</div>
                                                <div className="project-hours">{hours} hours</div>
                                            </div>
                                            <div className="project-bar-container">
                                                <div 
                                                    className="project-bar" 
                                                    style={{ 
                                                        width: `${(hours / stats.totalHours) * 100}%`,
                                                        backgroundColor: getRandomColor(project)
                                                    }}
                                                ></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="dashboard-card quick-actions">
                        <div className="card-header">
                            <h3>Quick Actions</h3>
                        </div>
                        <div className="card-content">
                            <div className="action-buttons">
                                <Link to="/timesheet/new" className="action-button primary">
                                    <FontAwesomeIcon icon={faClipboardCheck} />
                                    <span>Log Time</span>
                                </Link>
                                <Link to="/reports" className="action-button secondary">
                                    <FontAwesomeIcon icon={faChartLine} />
                                    <span>View Reports</span>
                                </Link>
                                <Link to="/projects" className="action-button tertiary">
                                    <FontAwesomeIcon icon={faProjectDiagram} />
                                    <span>Manage Projects</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

// Helper function to generate consistent colors for projects
function getRandomColor(str) {
    // Simple hash function to generate a number from a string
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    // Convert to hex color
    const colors = [
        '#4b6cb7', // Blue
        '#1e88e5', // Lighter blue
        '#43a047', // Green
        '#7cb342', // Light green
        '#fb8c00', // Orange
        '#f4511e', // Deep orange
        '#8e24aa', // Purple
        '#6a1b9a'  // Deep purple
    ];
    
    return colors[Math.abs(hash) % colors.length];
}

export default Dashboard;
