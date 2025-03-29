import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { auth } from './firebase';
import './css/Timesheet.css';

const Timesheet = () => {
    const [entries, setEntries] = useState([]);
    const [date, setDate] = useState('');
    const [hours, setHours] = useState('');
    const [project, setProject] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchTimesheetEntries();
    }, []);

    const fetchTimesheetEntries = async () => {
        try {
            const user = auth.currentUser;
            if (!user) return;

            const response = await axios.get(`http://localhost:5000/timesheet/${user.uid}`);
            setEntries(response.data);
        } catch (error) {
            console.error('Error fetching timesheet entries:', error);
            setError('Failed to load timesheet entries');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        
        try {
            const user = auth.currentUser;
            if (!user) throw new Error('You must be logged in');

            await axios.post('http://localhost:5000/timesheet', {
                userId: user.uid,
                date,
                hours: parseFloat(hours),
                project
            });
            
            // Clear form and refresh entries
            setDate('');
            setHours('');
            setProject('');
            fetchTimesheetEntries();
            
        } catch (error) {
            console.error('Error adding timesheet entry:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="timesheet-container">
            <h2>Timesheet Manager</h2>
            
            <form onSubmit={handleSubmit} className="timesheet-form">
                <h3>Add New Entry</h3>
                {error && <div className="error-message">{error}</div>}
                
                <div className="form-group">
                    <label htmlFor="date">Date</label>
                    <input 
                        type="date" 
                        id="date"
                        value={date} 
                        onChange={(e) => setDate(e.target.value)} 
                        required 
                    />
                </div>
                
                <div className="form-group">
                    <label htmlFor="hours">Hours</label>
                    <input 
                        type="number" 
                        id="hours"
                        step="0.5"
                        min="0.5"
                        max="24"
                        value={hours} 
                        onChange={(e) => setHours(e.target.value)} 
                        required 
                    />
                </div>
                
                <div className="form-group">
                    <label htmlFor="project">Project</label>
                    <input 
                        type="text" 
                        id="project"
                        value={project} 
                        onChange={(e) => setProject(e.target.value)} 
                        required 
                    />
                </div>
                
                <button type="submit" disabled={loading}>
                    {loading ? 'Saving...' : 'Add Entry'}
                </button>
            </form>
            
            <div className="timesheet-entries">
                <h3>Your Time Entries</h3>
                {entries.length === 0 ? (
                    <div className="empty-state">
                        <p>No entries found</p>
                        <p>Add your first timesheet entry using the form above</p>
                    </div>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Hours</th>
                                <th>Project</th>
                            </tr>
                        </thead>
                        <tbody>
                            {entries.map(entry => (
                                <tr key={entry.id}>
                                    <td>{new Date(entry.date).toLocaleDateString()}</td>
                                    <td>{entry.hours}</td>
                                    <td>{entry.project}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default Timesheet;
