






import React, { useEffect, useState } from 'react';
import {  Select, MenuItem , InputLabel} from '@mui/material';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Container,
  Modal,
  Card,
  CardContent,
  Typography,
  Button,
  Grid
} from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import QRCode from 'qrcode.react';
import { Link } from 'react-router-dom';
import { toPng } from 'html-to-image';
import html2canvas from 'html2canvas';
import CircularProgress from '@mui/material/CircularProgress';

 const BASE_URL = 'http://localhost:2500';
 const formatDateString = (dateString) => {
  const date = new Date(dateString);
  return date.toDateString(); // Format the date as desired
};

const modalStyles = {
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  backgroundColor: 'white',
  padding: '20px',
  borderRadius: '5px',
  boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)',
  maxWidth: '80%',
  maxHeight: '80%',
  overflowY: 'auto',
  zIndex: '1000',
};

const CustomerComplaintsTable = () => {
  const [data, setData] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [agentDetails, setAgentDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [otp, setOTP] = useState(''); // Add state for OTP
  const [isOTPValid, setIsOTPValid] = useState(false); // Add state to track OTP validation

  const handleOTPValidation = async () => {
    // Make an API request to validate the OTP on the server
    try {
      const response = await axios.post(`${BASE_URL}/validateOTP`, { otp });
      if (response.status === 200) {
        setIsOTPValid(true);
      } else {
        setIsOTPValid(false);
        // Handle invalid OTP case, show an error message, etc.
      }
    } catch (error) {
      console.error('Error validating OTP:', error);
      setIsOTPValid(false);
      // Handle error and show an error message
    }
  };

  const openModal = (customer) => {
    setSelectedCustomer(customer);
    // Fetch agent details based on the customer's serviceType
    axios
    .get(`${BASE_URL}/getAgentsbyservice/${customer.serviceType}`)
    .then((response) => {
        setAgentDetails(response.data);
      })
      .catch((error) => {
        console.error('Error fetching agent details:', error);
      });
    setModalOpen(true);
  };

 


  const resetSelectedData = () => {
    setSelectedCustomer(null);
    setSelectedServiceType('');
    setAgentDetails(null);
  };
  
  const closeModal = () => {
    setModalOpen(false);
    resetSelectedData(); // Reset selected data when closing the modal
  };
  


  useEffect(() => {
    axios
      .get(`${BASE_URL}/getcustomers`)
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error('Error fetching customer data:', error);
      });
  }, []);
  const [selectedServiceType, setSelectedServiceType] = useState('');
  const [isAgentMatching, setIsAgentMatching] = useState(true);





  let dataUrl;

  

  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
    closeModal()
  };

  const handleOpenDialog = () => {
    setOpen(true);
  };
  const [error, setError] = useState(false); // Add error state


  const handleAssign = async () => {
    if (selectedCustomer && selectedServiceType) {
      const selectedAgent = agentDetails.find((agent) => agent.firstName === selectedServiceType);
  
      if (selectedAgent) {
        setIsAgentMatching(true); // Set isAgentMatching to true
        const qrCodeElement = document.getElementById('qr-code');
        
        if (qrCodeElement) {
          const captureQrCode = () =>
            new Promise((resolve, reject) => {
              html2canvas(qrCodeElement).then((canvas) => {
                const dataUrl = canvas.toDataURL('image/png');
                if (dataUrl) {
                  resolve(dataUrl);
                } else {
                  reject(new Error('Failed to capture QR code.'));
                }
              });
            });
    
          try {
            // Start loading
            setLoading(true);
    
            const dataUrl = await captureQrCode();
            const data = {
              customerId: selectedCustomer.customerId,
              agentId: selectedAgent.empId,
              agentQr: dataUrl,
            };
    
            const responseAssign = await axios.post(`${BASE_URL}/complaints`, data);
            console.log('Complaint assigned:', responseAssign.data);
    
            const customerId = selectedCustomer.customerId;
            const statusUpdateData = {
              status: 'Assigned',
            };
    
            const responseStatusUpdate = await axios.put(`${BASE_URL}/customer/${customerId}`, statusUpdateData);
            console.log('Customer status updated:', responseStatusUpdate.data);
    
            handleOpenDialog(); // Open the dialog after successful assignment and status update
          } catch (error) {
            console.error('Error capturing or assigning the complaint:', error);
            setError(true); // Set the error state to true
            handleOpenDialog(); // Open the dialog to display the error message
          } finally {
            // Stop loading
            setLoading(false);
          }
        }
      } else {
        setIsAgentMatching(false); // No matching agent found
        return; // Stop the function without proceeding further
      }
    }
  };

  return (
    <>
    <Container className="tableContainer">
    <div style={{ marginTop: '8%', marginLeft: '14%', overflow: 'auto', height: '88vh',minWidth:"85%" }}>

      <TableContainer component={Paper}>
        <Table className="table" aria-label="Customer Complaints Table">
          <TableHead className="tableHead">
            <TableRow>
              <TableCell className="tableCell">Customer ID</TableCell>
              <TableCell className="tableCell">Customer Name</TableCell>
              <TableCell className="tableCell">Phone</TableCell>
              <TableCell className="tableCell">Email</TableCell>
              <TableCell className="tableCell">Service Type</TableCell>
              <TableCell className="tableCell">Address</TableCell>
              <TableCell className="tableCell">Date</TableCell>
              <TableCell className="tableCell">Description</TableCell>
              <TableCell className="tableCell">Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((customer) => (
              <TableRow key={customer._id} className="tableRow">
                <TableCell className="tableCell">{customer.customerId}</TableCell>
                <TableCell className="tableCell">{customer.firstName}&nbsp;&nbsp;{customer.lastName}</TableCell>
                <TableCell className="tableCell">{customer.phone}</TableCell>
                <TableCell className="tableCell">{customer.email}</TableCell>
                <TableCell className="tableCell">{customer.serviceType}</TableCell>
                <TableCell className="tableCell">{customer.address}</TableCell>
                <TableCell className="tableCell">{formatDateString(customer.date)}</TableCell>
                <TableCell className="tableCell">{customer.description}</TableCell>
                <TableCell className="tableCell" onClick={() => openModal(customer)}>
                {customer.status === 'open' ? (
    <Button variant="contained" style={{ backgroundColor: 'orange', color: 'white' ,width:'105px'}}>
      {customer.status}
    </Button>
 ) : customer.status === 'Assigned' ? (
    <Button variant="contained" style={{ backgroundColor: '#00aaee', color: 'white' }}>
      {customer.status}
    </Button>
  ) : customer.status === 'Completed' ? (
    <Button variant="contained" style={{ backgroundColor: 'green', color: 'white' }}>
      {customer.status}
    </Button>
  ) : (
    <Button variant="contained" style={{ backgroundColor: 'black', color: 'white' }}>
      {customer.status}
    </Button>
  )}
</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      </div>

      {/* Modal Dialog to Display Customer and Agent Details */}
      <Modal open={isModalOpen} onClose={closeModal}>

        <Card style={{height:'670px',width:'900px',marginLeft:'25%',marginTop:'2%',overflow: 'auto'}}>
          <CardContent style={{marginLeft:'2%',width:'100%'}}>
          <h4>Customer Details</h4>
            {selectedCustomer && (
                <div style={{ width: '900px', margin: '2%' }}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography style={{ fontSize: '16px', fontFamily: 'sans-serif' }}>
                      <b>Customer Name:</b> {`${selectedCustomer.firstName} ${selectedCustomer.lastName}`}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography style={{ fontSize: '16px', fontFamily: 'sans-serif' }}>
                      <b>Customer Id:</b> {selectedCustomer.customerId}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography style={{ fontSize: '16px', fontFamily: 'sans-serif' }}>
                      <b>Phone:</b> {selectedCustomer.phone}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography style={{ fontSize: '16px', fontFamily: 'sans-serif' }}>
                      <b>Service Type:</b> {selectedCustomer.serviceType}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography style={{ fontSize: '16px', fontFamily: 'sans-serif' }}>
                      <b>Date:</b> {formatDateString(selectedCustomer.date)}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography style={{ fontSize: '16px', fontFamily: 'sans-serif' }}>
                      <b>Email:</b> {selectedCustomer.email}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography style={{ fontSize: '16px', fontFamily: 'sans-serif' }}>
                      <b>Description:</b> {selectedCustomer.description}
                    </Typography>
                  </Grid>
                </Grid>
              </div>
              
            )}
       {agentDetails && (
  <div>
    <h4 style={{marginTop:'3%',marginBottom:'3%'}}>Agent Details</h4>
    <Select
  value={selectedServiceType || ''}
  onChange={(e) => setSelectedServiceType(e.target.value)}
  style={{ width: '300px' }}
  displayEmpty // Add displayEmpty prop
>
  <MenuItem value="" disabled> Select an agent</MenuItem>
  {agentDetails.map((agent) => (
    <MenuItem key={agent._id} value={agent.firstName}>
      {agent.firstName}
    </MenuItem>
  ))}
</Select>
    {selectedServiceType && (
      <div>   
        {agentDetails
          .filter((agent) => agent.firstName === selectedServiceType)
          .map((agent) => (
            <div>
      <Typography variant="h6" style={{marginTop:'3%',marginBottom:'3%'}}>Selected Agent Details:</Typography>
      {agentDetails
        .filter((agent) => agent.firstName === selectedServiceType)
        .map((selectedAgent) => (
          <div key={selectedAgent._id} style={{ display: 'flex' }}>
            {/* Image */}
            <div>
              <img
                src={selectedAgent.image}
                style={{
                  height: '120px',
                  width: '120px',
                  borderRadius: '50%',
                }}
              /><br/>&nbsp;
              <div id="qr-code" style={{marginTop:'-12px'}}>
  <QRCode value={`${BASE_URL}/getAgents/${agent.empId}`}  />

</div>              
            </div>
            <div style={{ marginLeft: '5%', width: '650px' }}>
  <Grid container spacing={3}>
    <Grid item xs={6}>
      <Typography style={{ fontSize: '16px', fontFamily: 'sans-serif' }}>
        <b>Agent Name:</b> {`${selectedAgent.firstName} ${selectedAgent.lastName}`}
      </Typography>
      <Typography style={{ fontSize: '16px', fontFamily: 'sans-serif' }}>
        <b>Service Type:</b> {selectedAgent.serviceType}
      </Typography>
    </Grid>
    <Grid item xs={6}>
      <Typography style={{ fontSize: '16px', fontFamily: 'sans-serif' }}>
        <b>User Id:</b> {selectedAgent.empId}
      </Typography>
      <Typography style={{ fontSize: '16px', fontFamily: 'sans-serif' }}>
        <b>Email:</b> {selectedAgent.email}
      </Typography>
    </Grid>
    <Grid item xs={6}>
      <Typography style={{ fontSize: '16px', fontFamily: 'sans-serif' }}>
        <b>Job Type:</b> {selectedAgent.jobType}
      </Typography>
      <Typography style={{ fontSize: '16px', fontFamily: 'sans-serif' }}>
        <b>Review:</b> {selectedAgent.review}
      </Typography>
    </Grid>
    <Grid item xs={6}>
      <Typography style={{ fontSize: '16px', fontFamily: 'sans-serif' }}>
        <b>Phone No:</b> {selectedAgent.phone}
      </Typography>
      <Typography style={{ fontSize: '16px', fontFamily: 'sans-serif' }}>
        <b>Job Description:</b> {selectedAgent.jobDescription}
      </Typography>
    </Grid>
  </Grid>
</div>
          </div>
        ))}
    </div>
          ))}
          
      </div>
    )}

{loading ? (
  <div style={{ textAlign: 'center',marginTop:'-52%',fontSize:'26px',fontWeight:'bold', color:'#0d4166' }}>
    <p>Please wait while we process the data...</p>
    <CircularProgress style={{ marginTop: '10px',height:'120px',width:'120px' }} />
  </div>
) : (
  <Button
    variant="contained"
    color="primary"
    style={{
      marginTop: '-115px',
      backgroundColor: '#1dbb99',
      marginLeft: '80%',
      height: '50px',
      width: '120px',
      display: selectedServiceType ? 'block' : 'none', // Conditional display
    }}
    onClick={handleAssign}
  >
    Assign
  </Button>
)}



<Dialog open={open} onClose={handleClose}>
        <DialogTitle>Assign Agent</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {error ? 'Failed to assign the complaint. Please try again.' : 'Complaint assigned successfully to the agent.'}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>


  </div>
)}


          </CardContent>
        </Card>
      </Modal>
    </Container>
    </>

  );
};

export default CustomerComplaintsTable;
