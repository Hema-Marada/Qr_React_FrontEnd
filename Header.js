import React  from 'react';
import {
 // Added CircularProgress for loading
  Button
} from '@mui/material';
import { useNavigate, } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';

export default function Header() {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
  
    const parseJWT = (token) => {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const decodedData = JSON.parse(atob(base64));
      return decodedData;
    };
    const tokenData = parseJWT(token);
 
    const firstName = tokenData.First_name
    const lastName = tokenData.Last_name

    const handleLogout = () => {
        navigate('/')
      };


  return (

<div className='HeaderDiv'>
  <img src="https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcQCOKAE40WkZ0ReiBjnGxjXKv2Y4wCaT2gfnoDXiWyH1P8WhDBF" alt="Logo" className='headerLogo' />
  <b className='headerwelcomeText'>
    WELCOME {firstName.toUpperCase()} 
  </b>
  <Button
    variant="outlined"
    startIcon={<LogoutIcon />}
    onClick={handleLogout}
    className='logoutButton'
    style={{ borderColor: 'white', border: '2px solid white', color: 'white' }}
  >
    <b className='logoutButtonText'>LOGOUT</b>
  </Button>
</div>


  )
}
