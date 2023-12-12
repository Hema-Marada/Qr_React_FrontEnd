import React, { useState } from 'react';
import { Container, Paper, TextField, Button, Typography, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import './Login.css'


const Login = () => {
  const navigate = useNavigate();
  const [empId, setEmpID] = useState('');
  const [Password, setPassword] = useState('');
  const [error, setError] = useState(null);

 
  // const BASE_URL = 'https://enterprise-qr-backend.cyclic.app';
  const BASE_URL = 'http://172.17.15.248:4600';


  const handleLogin = async () => {
    try {
      const response = await fetch(`${BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ empId, Password }),
      });

      if (response.ok) {
        const data = await response.json();
        const token = data.token;

        // Store the token in local storage
        localStorage.setItem('token', token);

        // Navigate to the agent page upon successful login
        navigate('/Agent'); // Assuming '/agent' is the route for the agent page
      } else {
        setError('Invalid empId or password. Please try again.');
      }
    } catch (error) {
      setError('An error occurred while logging in. Please try again later.');
    }
  };

  return (
    
      <Paper elevation={3} className='loginPaper'>
        <Typography variant="h4" gutterBottom className='loginText'>
          Login
        </Typography>
        <form>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="EmpId"
                variant="outlined"
                fullWidth
                required
                value={empId}
                onChange={(e) => setEmpID(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Password"
                type="password"
                variant="outlined"
                fullWidth
                required
                value={Password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Grid>
          </Grid>
          <br />
          {error && (
            <Typography variant="body1" className='loginErr'>
              {error}
            </Typography>
          )}
          <Button
            type="button"
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleLogin}
          >
            Login
          </Button>
        </form>
      </Paper>
   
  );
};

export default Login;
