import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faHome, 
  faClipboardList, 
  faFileAlt, 
  faChartBar, 
  faCog 
} from '@fortawesome/free-solid-svg-icons';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <ul className="sidebar-menu">
        <li className="sidebar-item active">
          <FontAwesomeIcon icon={faHome} className="sidebar-icon" />
          Dashboard
        </li>
        <li className="sidebar-item">
          <FontAwesomeIcon icon={faClipboardList} className="sidebar-icon" />
          My Timesheets
        </li>
        <li className="sidebar-item">
          <FontAwesomeIcon icon={faFileAlt} className="sidebar-icon" />
          Submit Timesheet
        </li>
        <li className="sidebar-item">
          <FontAwesomeIcon icon={faChartBar} className="sidebar-icon" />
          Reports
        </li>
        <li className="sidebar-item">
          <FontAwesomeIcon icon={faCog} className="sidebar-icon" />
          Settings
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
