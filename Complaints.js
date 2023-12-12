import React, { useState, useEffect } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Sidebar from './Sidebar';
import { CircularProgress, } from '@mui/material';
import { Card, CardContent } from '@mui/material';
import './Complaints.css'
import { Grid, Typography, Button ,Divider } from '@material-ui/core'
import Header from './Header';

const ViewComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  // const BASE_URL = 'https://enterprise-qr-backend.cyclic.app';
  const BASE_URL = '  http://172.17.15.248:4600';

  useEffect(() => {
    // Define the URL for the API
    const apiUrl = `${BASE_URL}/getAllComplaints`;
    // Use the Fetch API to send a GET request to the API endpoint
    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        setComplaints(data);
        setLoading(false);
      });
  }, []);

  return (
    <>
    <div>
      <Header />
    </div>
    <div className='complaintMain'>
      <Sidebar />
      <div className='complaintsDiv'>
        {loading ? (
          <div className='complaintLoadingDiv'>
            <CircularProgress color="primary" className='complaintsLoading' />
          </div>
        ) : (
          <>
            <Card className='complaintsCard' >
              <CardContent>



                <Grid container spacing={2}>
                  {complaints.map((complaint, index) => (
                    <Grid item key={index} xs={12} sm={6} md={4} lg={4} xl={3}>
                      <Card className='hoverCard'>
                        <CardContent className='complaintCardContent'>
                          <h2 className='complaintCardHeading'>Complaint Summary</h2>
                          <Typography ><b>Complaint ID: {complaint.complaint?.complaintId}</b></Typography><br />
                          <Typography><b>Customer ID:</b> {complaint.customer?.customerId}</Typography>
                          <Typography><b>Customer Name:</b> {complaint.customer?.firstName}&nbsp;{complaint.customer?.lastName}</Typography>
                          <Typography><b>Customer Contact: </b>{complaint.customer?.phone}</Typography><br />
                          
                          <Divider variant="middle" className='divider' />

                          <Typography><b>Agent ID:</b> {complaint.agent?.empId}</Typography>
                          <Typography><b>Agent Name:</b> {complaint.agent?.firstName}&nbsp;{complaint.agent?.lastName}</Typography>
                          <Typography><b>Agent Contact:</b> {complaint.agent?.phone}</Typography>
                          <Typography><b>Service Type:</b> {complaint.customer?.serviceType}</Typography><br />
                          <Typography style={{
                            color:
                              complaint.customer?.status === 'Completed' ? 'green' :
                                complaint.customer?.status === 'Pending' ? 'red' :
                                  complaint.customer?.status === 'Assigned' ? '#00aaee' :
                                    complaint.customer?.status === 'In-Progress' ? '#D2691E' :
                                      'black'
                          }}>
                            <b className='statusData'>{complaint.customer?.status.toUpperCase()}</b>
                          </Typography>

                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>



              </CardContent>
            </Card>

          </>
        )}
      </div>
    </div>
    </>
  );
};

export default ViewComplaints;