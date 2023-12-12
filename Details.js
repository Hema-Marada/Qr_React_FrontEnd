import React, { useEffect, useState } from 'react';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import {
  Container,
  Card,
  CardContent,
  Typography,
  Grid,
  List,
  ListItem,
  ListItemText,
  Paper,
  Avatar,
  CircularProgress, // Added CircularProgress for loading
  Button
} from '@mui/material';
import {

  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import {
  AccountCircle,  // Import the icons you want to use
  AssignmentInd,
  DoneAll,
} from '@mui/icons-material';
import { useNavigate, } from 'react-router-dom';
import './Details.css'

import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,} from '@material-ui/core';

const styles = {
 

  avatar: {
    width: '150px',
    height: '150px',
  },
  agentInfo: {
    textAlign: 'center',
  },
  certifications: {
    marginTop: '20px',
  },
  certificationItem: {
    border: '1px solid #ccc',
    marginBottom: '10px',
    padding: '10px',
  },
  sidebar: {
    flex: '0 0 260px',
    backgroundColor: '#424242',
    marginLeft: '-80%',
    width: '30%',
    height: '93vh',
    marginTop: '-2%'
  },
  content: {
    flex: '90%', // The remaining 80% width
    marginLeft: '30%'
  },
};
const statusColors = {
  "Processing": "background-color: red;",
  "Completed": "background-color: green;",
  "Pending": "background-color: green;",
  "Assigned": "background-color: blue;",

};
// const BASE_URL = 'https://enterprise-qr-backend.cyclic.app';
const BASE_URL = 'http://172.17.15.248:4600';

const AgentDetails = () => {
  const [agentData, setAgentData] = useState({});
  const [loading, setLoading] = useState(true); // Loading state
  const token = localStorage.getItem('token');
  const decodedToken = jwt_decode(token);
  const userId = decodedToken.empId;
  const [currentView, setCurrentView] = useState('agentDetails');
  const parseJWT = (token) => {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const decodedData = JSON.parse(atob(base64));
    return decodedData;
  };
  const tokenData = parseJWT(token);
  const Email = tokenData.Email;
  const empId = tokenData.empId
  const firstName = tokenData.First_name
  const lastName = tokenData.Last_name
  console.log("empId", empId);
  console.log("line No 62", Email);

  useEffect(() => {
    axios
      .get(`${BASE_URL}/getAgents/${userId}`)
      .then((response) => {
        setAgentData(response.data[0]);
        setLoading(false); // Set loading to false when data is fetched
      })
      .catch((error) => {
        console.error('Error fetching agent data:', error);
        setLoading(false); // Set loading to false in case of an error
      });
  }, [userId]);
  const [certificates, setCertificates] = useState({});
  const navigate = useNavigate();
  useEffect(() => {

    axios
      .get(`${BASE_URL}/getCertificate`)
      .then((response) => {
        const certificateData = {};
        response.data.forEach((certificate) => {
          certificateData[certificate.certificateId] = certificate;
        });
        setCertificates(certificateData);
      })
      .catch((error) => {
        console.error('Error fetching certificate data:', error);
      });
  }, []);
  const [showAgentDetails, setShowAgentDetails] = useState(false); // Control visibility

  const toggleAgentDetails = () => {
    setShowAgentDetails(!showAgentDetails);
  };
  const [assignedTickets, setAssignedTickets] = useState([]);
  const [loadingAssignedTickets, setLoadingAssignedTickets] = useState(true);

  const [loadingCompletedTickets, setLoadingCompletedTickets] = useState(true);
  const fetchAssignedTickets = () => {
    axios
      .get(`${BASE_URL}/getAssignedTickets/${userId}`)
      .then((response) => {
        setAssignedTickets(response.data);
        setLoadingAssignedTickets(false);
        setLoadingCompletedTickets(false);

      })
      .catch((error) => {
        console.error('Error fetching assigned tickets:', error);
        setLoadingAssignedTickets(false);
        setLoadingCompletedTickets(false);
      });
  };
  const [complaints, setComplaints] = useState([]);
  const [loadingComplaints, setLoadingComplaints] = useState(true);
  const fetchComplaints = () => {
    axios
      .get(`${BASE_URL}/getAllComplaints`)
      .then((response) => {
        setComplaints(response.data);
        setLoadingComplaints(false);
      })
      .catch((error) => {
        console.error('Error fetching complaints:', error);
        setLoadingComplaints(false);
      });
  };

  useEffect(() => {
    if (currentView === 'assignedTickets') {
      fetchComplaints();
    }
  }, [currentView]);

  useEffect(() => {
    if (currentView === 'assignedTickets') {
      fetchAssignedTickets();
    }
  }, [currentView, userId]);
  const filteredComplaints = complaints.filter((complaint) => complaint.agent.empId === empId);
  console.log("filteredComplaints", filteredComplaints);

  const [rowStatus, setRowStatus] = useState({});
  const status = ["In-Progress", "Completed",];
  const handleLogout = () => {
    navigate('/')
  };
  const [openDialog, setOpenDialog] = useState(false);
const [selectedComplaintId, setSelectedComplaintId] = useState(null);

  return (
    <>
      <div className='detailsCompHeaderDiv'>
        <div className='welcomeTextDiv'>

          <b className='welcomeText'>
            WELCOME {firstName.toUpperCase()} {lastName.toUpperCase()}
          </b>

          <Button
            onClick={handleLogout} // Replace with your logout function
            variant="contained"

           className='logoutButton'
          >
            Logout
          </Button>
        </div>
        <Container maxWidth="md" className='detailsContainer'>
          <div style={styles.sidebar}>
            <Button
              onClick={() => setCurrentView('agentDetails')}
              style={{
                    backgroundColor: currentView === 'agentDetails' ? '#84848e' : '#2e2d2d',
               
              }}
              className='viewProfile'
              startIcon={<AccountCircle />}
            >
              VIEW PROFILE
            </Button>
            <Button
              onClick={() => setCurrentView('assignedTickets')}
              style={{
                width: '60%',
                marginTop: '40px',
                backgroundColor: currentView === 'assignedTickets' ? '#84848e' : '#2e2d2d',
                marginLeft: '28%',
                color: 'white',
              }}
              startIcon={<AssignmentInd />}
            >&nbsp;&nbsp;&nbsp;
              ASSIGNED
            </Button>
            <Button
              onClick={() => setCurrentView('completedTickets')}
              style={{
                width: '60%',
                marginTop: '40px',
                backgroundColor: currentView === 'completedTickets' ? '#84848e' : '#2e2d2d',
                marginLeft: '28%',
                color: 'white',
              }}
              startIcon={<DoneAll />}
            >
              COMPLETED
            </Button>
          </div>

          <div style={styles.content}>
            {currentView === 'agentDetails' && loading ? (
              <CircularProgress
                style={{
                  marginTop: '40%',
                  height: '60px',
                  width: '60px',
                  marginLeft: '60%',
                }}
              />
            ) : currentView === 'agentDetails' && agentData && Object.keys(agentData).length > 0 && (
              <Card elevation={3} className='detailsCard'>
                <CardContent style={{ maxHeight: '580px', overflowY: 'auto' }} >
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={4}>
                      <Avatar
                        alt={`Agent ${userId}`}
                        src={agentData.image}
                        style={styles.avatar}
                      />
                    </Grid>
                    <Grid item xs={8}>
                      <Typography variant="h4" style={styles.agentInfo}>
                        <b style={{ marginLeft: '-15%', fontSize: '30px' }}>{agentData.firstName} {agentData.lastName}</b>
                      </Typography>
                      <Typography variant="subtitle1" style={styles.agentInfo}>
                        <b style={{ marginLeft: '-36%' }}>Agent ID:</b> {userId}
                      </Typography>
                      <Typography variant="subtitle1" style={styles.agentInfo}>
                        <b>Email:</b>   {agentData.email}
                      </Typography>
                      <Typography variant="subtitle1" style={styles.agentInfo}>
                        <b style={{ marginLeft: '-30%' }}>Job Type:</b>  {agentData.jobType}
                      </Typography>
                      <Typography variant="subtitle1" style={styles.agentInfo}>
                        <b style={{ marginLeft: '-20%' }}>Service Type:</b>  {agentData.serviceType}
                      </Typography>
                    </Grid>
                  </Grid>
                  <div style={styles.certifications} >
                    <Typography variant="body1">
                      <b>Designation:</b><br />{agentData.jobDescription}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Rating:</strong> {agentData.rating}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Review:</strong> {agentData.review}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Work Experience:</strong> {agentData.workExperience} years
                    </Typography>
                  </div>
                  <div style={styles.certifications}>
                    <Typography variant="h5"><b>Certifications Timeline</b></Typography>
                    <List component={Paper}>
                      {agentData.certifications.map((certification) => (
                        <Paper key={certification.certificateId} style={styles.certificationItem}>
                          <ListItem>
                            <ListItemText
                              primary={

                                <Typography component="span" variant="subtitle1">
                                  <b>Certificate ID: {certification.certificateId}</b>
                                </Typography>
                              }
                              secondary={
                                <div >
                                  <Typography component="span" variant="subtitle2">
                                    <b>Certificate Name:</b>  {certificates && certificates[certification.certificateId] ? certificates[certification.certificateId].name : 'Not Found'}
                                  </Typography>
                                  <br />
                                  <Typography component="span" variant="subtitle2">
                                    <b>Start Date:</b>  {certification.startDate}
                                  </Typography>
                                  <br />
                                  <Typography component="span" variant="subtitle2">
                                    <b> End Date:</b>  {certification.endDate}
                                  </Typography>
                                  <br />
                                  <Typography component="span" variant="subtitle2">
                                    <b>Pending Days:</b>  {certification.pendingDays}
                                  </Typography>
                                </div>
                              }
                            />
                            <Button
                              variant="contained"
                              style={{
                                backgroundColor: certification.pendingDays > 0 ? 'green' : 'red',
                                color: 'white',
                                marginBottom: '10%',
                                marginTop: '5%',
                              }}
                            >
                              {certification.pendingDays > 0 ? 'Active' : 'Expired'}
                            </Button>
                          </ListItem>
                        </Paper>
                      ))}
                    </List>
                  </div>
                </CardContent>
              </Card>
            )}
            {currentView === 'assignedTickets' && loadingAssignedTickets ? (
              <CircularProgress
                style={{
                  marginTop: '30%',
                  height: '60px',
                  width: '60px',
                  marginLeft: '60%',
                }}
              />
            ) : currentView === 'assignedTickets' && (
              <div >
                {loadingComplaints ? (
                  <CircularProgress
                    style={{
                      marginTop: '30%',
                      height: '60px',
                      width: '60px',
                      marginLeft: '60%',
                    }}
                  />
                ) :
                  (
                    <>
                      <Typography variant="h5" style={{ marginLeft: '35%', marginTop: '2%' }}>Assigned Tickets</Typography>

                      <TableContainer component={Paper} style={{ marginLeft: '-15%', marginTop: '2%', width: '120%' }}>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell style={{ fontWeight: 'bolder' }}>Complaint ID</TableCell>
                              <TableCell style={{ fontWeight: 'bolder' }}>Customer ID</TableCell>
                              <TableCell style={{ fontWeight: 'bolder' }}>Customer Name</TableCell>
                              <TableCell style={{ fontWeight: 'bolder' }}>Email</TableCell>
                              <TableCell style={{ fontWeight: 'bolder' }}>Service Type</TableCell>

                              <TableCell style={{ fontWeight: 'bolder' }}>Date</TableCell>
                              <TableCell style={{ fontWeight: 'bolder' }}>Status</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {filteredComplaints.map((complaint) => (
                              <TableRow key={complaint.complaint.complaintId}>
                                <TableCell>{complaint.complaint.complaintId}</TableCell>
                                <TableCell>{complaint.customer.customerId}</TableCell>
                                <TableCell>
                                  {complaint.customer.firstName} {complaint.customer.lastName}
                                </TableCell>
                                <TableCell>{complaint.customer.email}</TableCell>
                                <TableCell>{complaint.customer.serviceType}</TableCell>

                                <TableCell>{complaint.customer.date}</TableCell>
                            

<TableCell>
  <Select
    value={rowStatus[complaint.complaint.complaintId] || ''}
    onChange={(e) => {
      const newStatus = e.target.value;
      const currentDate = new Date();
      const endDate = currentDate.toISOString();

      const confirmUpdate = window.confirm("Are you sure you want to update the status?");

      if (confirmUpdate) {
        setRowStatus({
          ...rowStatus,
          [complaint.complaint.complaintId]: newStatus,
        });

        axios.put(`${BASE_URL}/customer/${complaint.customer.customerId}`, {
          status: newStatus,
          endDate: endDate,
        })
          .then((response) => {
            console.log('Status and endDate updated successfully:', response.data);
          })
          .catch((error) => {
            console.error('Error updating status and endDate:', error);
          });
      }
    }}
    style={{
      width: '200px',
      backgroundColor: statusColors[rowStatus[complaint.complaint.status]],
    }}
    displayEmpty
  >
    <MenuItem value="" disabled style={{ color: 'white' }}> {complaint.customer.status}</MenuItem>
    {status.map((statusItem) => (
      <MenuItem key={statusItem} value={statusItem}>
        {statusItem}
      </MenuItem>
    ))}
  </Select>
</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </>
                  )}
              </div>
            )}

            {currentView === 'completedTickets' && loadingCompletedTickets ? (
              <CircularProgress
                style={{
                  marginTop: '30%',
                  height: '60px',
                  width: '60px',
                  marginLeft: '60%',
                }}
              />
            ) : currentView === 'completedTickets' && (
              <div>
                {loadingComplaints ? (
                  <CircularProgress
                    style={{
                      marginTop: '30%',
                      height: '60px',
                      width: '60px',
                      marginLeft: '60%',
                    }}
                  />
                ) : filteredComplaints
                  .filter((complaint) => complaint.customer.status === 'Completed')
                  .length > 0 ? (
                  <TableContainer component={Paper} style={{ marginLeft: '-12%', marginTop: '6%', width: '120%' }}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell style={{ fontWeight: 'bolder' }}>Complaint ID</TableCell>
                          <TableCell style={{ fontWeight: 'bolder' }}>Customer ID</TableCell>
                          <TableCell style={{ fontWeight: 'bolder' }}>Customer Name</TableCell>
                          <TableCell style={{ fontWeight: 'bolder' }}>Email</TableCell>
                          <TableCell style={{ fontWeight: 'bolder' }}>Service Type</TableCell>

                          <TableCell style={{ fontWeight: 'bolder' }}>Date</TableCell>
                          <TableCell style={{ fontWeight: 'bolder' }}>Status</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {filteredComplaints
                          .filter((complaint) => complaint.customer.status === 'Completed')
                          .map((complaint) => (
                            <TableRow key={complaint.complaint.complaintId}>
                              <TableCell>{complaint.complaint.complaintId}</TableCell>
                              <TableCell>{complaint.customer.customerId}</TableCell>
                              <TableCell>
                                {complaint.customer.firstName} {complaint.customer.lastName}
                              </TableCell>
                              <TableCell>{complaint.customer.email}</TableCell>
                              <TableCell>{complaint.customer.serviceType}</TableCell>
                              <TableCell>{complaint.customer.date}</TableCell>
                              <TableCell>
                                <Button
                                  variant="contained"
                                  color="primary"
                                  style={{
                                    backgroundColor: '#1dbb99',
                                    fontWeight: 'bolder'
                                  }}
                                >
                                  {complaint.customer.status}
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : (
                  <Typography
                    variant="body1"
                    style={{ textAlign: 'center', marginTop: '300px', fontSize: '28px', marginLeft: '22%' }}
                  >
                    No completed records found.
                  </Typography>
                )}
              </div>
            )}
          </div>
        </Container>
      </div>
    </>
  );
};

export default AgentDetails;
