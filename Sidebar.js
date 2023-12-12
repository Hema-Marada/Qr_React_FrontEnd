import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@mui/material';
import {
  AccountCircle,
  AssignmentInd,
  ReportProblem,
} from '@mui/icons-material';
import './Sidebar.css'


function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeButton, setActiveButton] = useState(location.pathname);

  const handleButtonClick = (path) => {
    setActiveButton(path);
    navigate(path);
  };

  return (
   
      
    <div className="sidebar">
      <ul>
        <Button
          className={`agentButton ${activeButton === '/agent' ? 'activeButton' : ''}`}
          onClick={() => handleButtonClick('/agent')}
        >
          {<AccountCircle />}&nbsp; <b  >ALL Agents</b>
        </Button>

        <Button
          className={`button ${activeButton === '/Customer' ? 'activeButton' : ''}`}
          onClick={() => handleButtonClick('/Customer')}
        >
          {<AssignmentInd />} &nbsp; &nbsp;<b>CUSTOMERs</b>
        </Button>

        <Button
          className={`button ${activeButton === '/Complaints' ? 'activeButton' : ''}`}
          onClick={() => handleButtonClick('/Complaints')}
        >
          {<ReportProblem />} &nbsp; &nbsp;<b>COMPLAINTS</b>
        </Button>
      </ul>
    </div>
 
  );

 



}

export default Sidebar;