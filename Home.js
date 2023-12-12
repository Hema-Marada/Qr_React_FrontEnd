import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import InputAdornment from '@mui/material/InputAdornment';

import TextField from "@mui/material/TextField";
// import Button from "@mui/material/Button";
// import Paper from "@mui/material/Paper";
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search'; 
const Main = () => {
  const navigate = useNavigate();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [customerId, setCustomerId] = useState("");
  const [customerData, setCustomerData] = useState(null);
  const [error, setError] = useState(null);
  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };
  const handleRaiseComplaint = () => {
    // Navigate to the Complaint component
    navigate('/Customerform');
  };

  const fetchData = async () => {
    try {
      const response = await fetch(
        `https://enterprise-qr-backend.cyclic.app/getcustomerById/${customerId}`
      );
      if (response.ok) {
        const data = await response.json();
        setCustomerData(data);
        setError(null); // Clear any previous error
      } else {
        setCustomerData(null);
        setError("Data not available");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setCustomerData(null);
      setError("An error occurred while fetching data");
    }
  };
  const handleCheck = () => {
    fetchData();
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.heading}>Welcome to Our Service</h1>
        <div style={styles.agentLogin}>
          If you are an agent, <Link to="/login" style={styles.loginLink}>login</Link>
        </div>
      </header>
      <main style={styles.main}>
        <p style={styles.text}>Do you have a complaint?</p>
        <button
          style={styles.raiseComplaintButton}
          onClick= {handleRaiseComplaint} // You can handle raising a complaint here
        >
          Raise a Complaint
        </button>
     <br/>
     <p style={{fontSize:"155%",fontWeight:"lighter"}}>To view complaint status </p>

     <div style={formContainerStyle}>

     <TextField
  label="Enter CustomerID"
  variant="outlined"
  value={customerId}
  onChange={(e) => setCustomerId(e.target.value)}
  InputProps={{
    style: {
      width: '205px',

      height: '40px', // Adjust the height to your desired value
    },
    endAdornment: (
      <InputAdornment position="end">
        <IconButton
          onClick={() => {
            handleCheck();
            openModal();
          }}
          color="primary"
        >
          <SearchIcon style={{ color: 'blue', paddingLeft: '40%' }} />
        </IconButton>
      </InputAdornment>
    ),
  }}
  InputLabelProps={{
    style: { color: 'white',marginTop:"-4%" }
  }}
/>

</div>
      </main>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal} // Close the modal when requested
        style={{
          content: {
            padding: '5px',
            border: 'none',
            height:"50%",
            backgroundColor:"snow",
            width: "420px", // Set the width as needed
marginLeft:"30%",
marginTop:'5%'
          },
        }}
      >
        {/* Your code for displaying customer data goes here */}
        <div style={containerStyle}>
        
          {error && <p style={errorStyle}>{error}</p>}
          {customerData && !error && (
            // <Paper elevation={3} style={paperStyle}>
            <div>
              <h2 style={titleStyle}>Complaint Status</h2>
              <p>
                <span style={keyStyle}> Name:</span>{' '}
                {customerData.firstName} {customerData.lastName}
              </p>
              <p>
                <span style={keyStyle}>Phone:</span> {customerData.phone}
              </p>
              <p>
                <span style={keyStyle}>Email:</span> {customerData.email}
              </p>
              <p>
                <span style={keyStyle}>Description:</span>{' '}
                {customerData.description}
              </p>
              <p>
                <span style={keyStyle}>Service Type:</span>{' '}
                {customerData.serviceType}
              </p>
              <p>
                <span style={keyStyle}>Status:</span>{' '}
                <span style={highlightedStatusStyle}>
                {customerData.status.toUpperCase()} {/* Convert to uppercase */}
                </span>
              </p>
              </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    background: 'linear-gradient(to bottom, #3494E6, #EC6EAD)',
  },
  header: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    textAlign: 'center',
  },
  heading: {
    fontSize: '36px',
    color: '#fff',
    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
  },
  agentLogin: {
    fontSize: '18px',
    color: '#fff',
    marginTop: '20px',
  },
  loginLink: {
    fontSize: '18px',
    color: 'orange',
    textDecoration: 'none',
  },
  main: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
  },
  text: {
    fontSize: '24px',
    color: '#fff',
  },
  raiseComplaintButton: {
    backgroundColor: '#E3342F',
    color: '#fff',
    border: 'none',
    padding: '15px 30px',
    fontSize: '18px',
    cursor: 'pointer',
    borderRadius: '5px',
    marginTop: '20px',
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
  },
  statusButton: {
    border: 'none',
    padding: '10px 15px',
    fontSize: '12px',
    cursor: 'pointer',
    borderRadius: '5px',
    marginTop: '20px',
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
  },
  
};
const containerStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  backgroundColor:"snow"
};

const paperStyle = {
  padding: "20px",
  marginTop: "20px",
  textAlign: "left",
  backgroundColor: "#f7f7f7",
  width: "400px", // Set the width as needed

  
};

const titleStyle = {
  fontSize: "24px",
  marginBottom: "10px",
};

const dataFieldStyle = {
  fontSize: "16px",
  marginBottom: "5px",
};

const keyStyle = {
  fontWeight: "bold",
};

const errorStyle = {
  color: "red",
};
const highlightedStatusStyle = {
  fontWeight: "bold",
  color: "red", // Add your preferred text color here
};

const formContainerStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  
};



const textFieldStyle = {
  marginRight: "10px", // Add margin for spacing
  width: "300px", // Set the width as needed

};
const buttonStyle = {
  height: "30px", // Set the height as needed
};
export default Main;