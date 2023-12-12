import React, { useEffect, useState } from 'react';
import { Select, MenuItem, InputLabel, Tooltip } from '@mui/material';
import axios from 'axios';
import {

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
import html2canvas from 'html2canvas';
import CircularProgress from '@mui/material/CircularProgress';
import Sidebar from './Sidebar';
import './Customer.css'
import Header from './Header';

//  const BASE_URL = 'https://enterprise-qr-backend.cyclic.app';
const BASE_URL = 'http://172.17.15.248:4600';
const formatDateString = (dateString) => {
  const date = new Date(dateString);
  return date.toDateString(); // Format the date as desired
};

const CustomerComplaintsTable = () => {
  const [data, setData] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [agentDetails, setAgentDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadings, setLoadings] = useState(false);
  const [agentAssignedDetails, setAssignedAgentDetails] = useState(null);

  const status = ["Assign",];
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

    // Fetch agentAssignedDetails based on customer information (customerId)

    setModalOpen(true);
  };

  const resetSelectedData = () => {
    setSelectedCustomer(null);
    setSelectedServiceType('');
    setSelectedStatus('');
    setAgentDetails(null);
    setAssignedAgentDetails(null);
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
  const [selectedStatus, setSelectedStatus] = useState('');
  const [isAgentMatching, setIsAgentMatching] = useState(true);

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
            setLoadings(true);

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
            setLoadings(false);
          }
        }
      } else {
        setIsAgentMatching(false); // No matching agent found
        return; // Stop the function without proceeding further
      }
    }
  };
  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      setLoading(false); // Set loading to false when data is ready
    }, 3000); // Replace with your data fetching logic
  }, []);

  const [comments, setComments] = useState(''); // State for comments
  const updateComments = (comments) => {
    setComments(comments);
  };
  const fetchAgentDetails = async (empId) => {
    try {
      const response = await fetch(`http://172.17.15.248:4600/getCompleteDataById/${empId}`);
      if (response.ok) {
        const data = await response.json();
        console.log('Received data:', data); // Log the data
        setAssignedAgentDetails({});
        setAssignedAgentDetails(data);
      } else {
        // Handle error here
        console.error('Failed to fetch agent details');
      }
    } catch (error) {
      console.error('An error occurred', error);
    }
  };
  return (
   <>
    <div>
      <Header />
    </div>
      <div className='mainDiv'>
        <Sidebar />

       
          <div className='containerMainDiv'>
            {loading ? ( // Render loading indicator when loading is true
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress color="primary" style={{ height: '50px', width: '50px', marginTop: '-18%', marginLeft: '6%' }} />
                {/* <p style={{ fontSize: '22px', marginLeft: '-20%', marginTop: '2%' }}>Please wait while we Process the data.</p> */}
              </div>
            ) : (
              <>


                <div className="cardContainer">
                  <Grid container spacing={2}>

                    {data.map((customer) => (
                      <Card key={customer._id} className="complaintCard">
                        <CardContent >
                          <Typography variant="h6" className='customerCardName'>{customer.firstName}&nbsp;&nbsp;{customer.lastName}</Typography>
                          <Typography className='customerCardContentData'><b>CID:</b>{customer.customerId}</Typography>
                          <Typography className='customerCardContentData'><b>Mobile:</b>{customer.phone}</Typography>
                          <Typography className='customerCardContentData' ><b>Email:</b>{customer.email}</Typography>
                          <Typography className='customerCardContentData'><b>ServiceType:</b>{customer.serviceType}</Typography>
                          <Typography className='customerCardContentData'><b>Date:</b>{formatDateString(customer.date)}</Typography>
                          <Button onClick={() => openModal(customer)}>
                            {customer.status === 'open' ? (
                              <Button variant="contained" className='tableOpenButton'>
                                {customer.status}
                              </Button>
                            ) : customer.status === 'Assigned' ? (
                              <Button variant="contained" onClick={() => fetchAgentDetails(customer.customerId)} className='tableAssignedButton'>
                                {customer.status}
                              </Button>
                            ) : customer.status === 'Completed' ? (
                              <Button variant="contained" onClick={() => fetchAgentDetails(customer.customerId)} className='tableCompletedButton'>
                                {customer.status}
                              </Button>
                            ) : customer.status === 'Pending' ? (
                              <Button variant="contained" className='tablePendingButton'>
                                {customer.status}
                              </Button>
                            ) : customer.status === 'In-Progress' ? (
                              <Button variant="contained" onClick={() => fetchAgentDetails(customer.customerId)} className='tableProgressButton'>
                                {customer.status}
                              </Button>
                            ) : (
                              <Button variant="contained" className='tableDefaultButton'>
                                {customer.status}
                              </Button>
                            )}
                          </Button>
                        </CardContent>
                      </Card>

                    ))}
                  </Grid>

                </div>


              </>
            )}
          
          <Modal open={isModalOpen} onClose={closeModal}>
            <Card className='modalCustomerOuterCard'>
              <Button
                color="primary"
                onClick={closeModal}
                className='modalCloseButton'
              >
                <Tooltip title="Close">
                  <b style={{ color: 'black' }}>X</b>
                </Tooltip>
              </Button>
              <CardContent className='modalOuterCustomerCardContent'>
                <h3 className='customerDetailsHeading'>Customer Details</h3>
                {selectedCustomer && (
                  <Card className='modalCustomerCardDetails'>
                    <CardContent>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <Typography component="div" >
                            <b>Customer Name:</b> <b className='customerName'>{`${selectedCustomer.firstName} ${selectedCustomer.lastName}`}</b>
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography component="div"  >
                            <b>Customer Id:</b> <b className='customerName'>{selectedCustomer.customerId}</b>
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography component="div" className='customerDetails'>
                            <b>Phone:</b> {selectedCustomer.phone}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography component="div" className='customerDetails'>
                            <b>Service Type:</b> {selectedCustomer.serviceType}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography component="div" className='customerDetails'>
                            <b>Date:</b> {formatDateString(selectedCustomer.date)}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography component="div" className='customerDetails'>
                            <b>Email:</b> {selectedCustomer.email}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography component="div" className='customerDetails'>
                            <b>Description:</b> {selectedCustomer.description}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography component="div" className='customerDetails'>
                            <b>Address:</b> {selectedCustomer.address}
                          </Typography>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                )}
                {agentDetails && (
                  <div><br /><br />
                    <div className='agentDisplayDetailsDiv'>


                      <div>
                        {selectedCustomer.status === 'Completed' ? (
                          <>
                            {agentAssignedDetails ? (
                              <>
                                <h4 className='agentClosedMessage'>Agent <b style={{ color: 'black' }}>{`${agentAssignedDetails.agent.firstName} ${agentAssignedDetails.agent.lastName}`}</b> has closed this complaint</h4>
                                <div className='agentDetailsHeadingDiv'>
                                  <h3 className='agentDetailsHeading'>Agent Details:</h3>
                                  <h4 className='closedDateDisplay'>
                                    Closed Date: &nbsp;{new Date(agentAssignedDetails.customer.endDate).toLocaleDateString()}
                                  </h4>
                                </div>
                                <Card className='agentDetailsCard'>
                                  <CardContent>
                                    <div key={agentAssignedDetails.agent._id} style={{ display: 'flex' }}>
                                      {/* Agent Image */}
                                      <div>
                                        <img
                                          src={agentAssignedDetails.agent.image}
                                          className='agentDetailsImg'
                                        />
                                        <br />&nbsp;
                                        <div id="qr-code" className='agentQrCodeDiv'>
                                          <QRCode
                                            value={`https://enterprise-qr-reader.vercel.app/agent/${agentAssignedDetails.agent.empId}`}
                                            className='agentQrCode'
                                          />
                                        </div>
                                      </div>
                                      <div className='agentDetailsGridDiv'>
                                        <Grid container spacing={3}>
                                          <Grid item xs={6}>
                                            <Typography className='agentDetailsName'>
                                              <b>{`${agentAssignedDetails.agent.firstName} ${agentAssignedDetails.agent.lastName}`}</b>
                                            </Typography>
                                            <Typography className='agentDetailsData'>
                                              <b>Service Type:</b> {agentAssignedDetails.agent.serviceType}
                                            </Typography>
                                          </Grid>
                                          <Grid item xs={6}>
                                            <Typography className='agentDetailsData'>
                                              <b>Agent Id:</b> {agentAssignedDetails.agent.empId}
                                            </Typography>
                                            <Typography className='agentDetailsData'>
                                              <b>Job Type:</b> {agentAssignedDetails.agent.jobType}
                                            </Typography>
                                          </Grid>
                                          <Grid item xs={6}>
                                            <Typography className='agentDetailsData'>
                                              <b>Email:</b> {agentAssignedDetails.agent.email}
                                            </Typography>
                                            <Typography className='agentDetailsData'>
                                              <b>Phone No:</b> {agentAssignedDetails.agent.phone}
                                            </Typography>
                                          </Grid>
                                          <Grid item xs={6}>
                                            <Typography className='agentDetailsData'>
                                              <b>Review:</b> {agentAssignedDetails.agent.review}
                                            </Typography>
                                            <Typography className='agentDetailsData'>
                                              <b>Job Description:</b> {agentAssignedDetails.agent.jobDescription}
                                            </Typography>
                                          </Grid>
                                        </Grid>
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              </>
                            ) : (
                              <div className='agentDetailsLoading'>
                                <CircularProgress />
                              </div>
                            )}
                          </>
                        ) : (
                          selectedCustomer.status === 'In-Progress' ? (
                            <>
                              {agentAssignedDetails ? (
                                <>
                                  <h4 className='agentProgressHeading'>
                                    Agent  <b style={{ color: 'black' }}>{`${agentAssignedDetails.agent.firstName} ${agentAssignedDetails.agent.lastName}`}</b> has been working on this Complaint.
                                  </h4>
                                  <div key={agentAssignedDetails.agent._id} className='agentProgressCardDiv'>
                                    {/* Agent Image and Name */}
                                    <Card className='agentProgressCard'>
                                      <CardContent>
                                        <div>
                                          <img
                                            src={agentAssignedDetails.agent.image}
                                           className='progressAgentImg'
                                          />
                                          <br />&nbsp;
                                          <Typography className='progressCardContentName'>
                                            <b>{`${agentAssignedDetails.agent.firstName} ${agentAssignedDetails.agent.lastName}`}</b>
                                          </Typography>
                                          <Typography className='progressCardContentId'>
                                            <b> {agentAssignedDetails.agent.empId}</b>
                                          </Typography>
                                        </div>
                                      </CardContent>
                                    </Card>&nbsp;&nbsp;&nbsp;&nbsp;
                                    {/* Agent Details */}
                                    <Card className='progressCardRemainData'>
                                      <CardContent>
                                        <Grid container spacing={3}>
                                          <Grid item xs={6}>
                                            <Typography className="agentDetailsData">
                                              <b>Service Type:</b> {agentAssignedDetails.agent.serviceType}
                                            </Typography>
                                          </Grid>
                                          <Grid item xs={6}>
                                            <Typography className="agentDetailsData">
                                              <b>Job Type:</b> {agentAssignedDetails.agent.jobType}
                                            </Typography>
                                          </Grid>
                                          <Grid item xs={6}>
                                            <Typography className="agentDetailsData">
                                              <b>Designation:</b> {agentAssignedDetails.agent.designation}
                                            </Typography>
                                            <Typography className="agentDetailsData">
                                              <b>Phone No:</b> {agentAssignedDetails.agent.phone}
                                            </Typography>
                                          </Grid>
                                          <Grid item xs={6}>
                                            <Typography className="agentDetailsData">
                                              <b>Review:</b> {agentAssignedDetails.agent.review}
                                            </Typography>
                                            <Typography className="agentDetailsData">
                                              <b>Job Description:</b> {agentAssignedDetails.agent.jobDescription}
                                            </Typography>
                                          </Grid>
                                          <Grid item xs={12}>
                                            <Typography className="agentDetailsData">
                                              <b>Email:</b> {agentAssignedDetails.agent.email}
                                            </Typography>
                                          </Grid>
                                        </Grid>
                                      </CardContent>
                                    </Card>
                                  </div>
                                </>
                              ) : (
                                <div style={{ width: '40px', marginLeft: '350px', height: '30px', marginTop: '15%' }}>
                                  <CircularProgress />
                                </div>
                              )}
                            </>
                          ) : (
                            selectedCustomer.status === 'Assigned' ? (
                              <>
                                {agentAssignedDetails ? (
                                  <>
                                    <h4 className='assignedToAgentMessage'>
                                      This complaint has been assigned to agent <b style={{ color: 'black' }}>{`${agentAssignedDetails.agent.firstName} ${agentAssignedDetails.agent.lastName}`}</b>.
                                    </h4>
                                    <div key={agentAssignedDetails.agent._id} className='agentProgressCardDiv'>
                                      {/* Agent Image and Name */}
                                      <Card className='agentProgressCard'>
                                        <CardContent>
                                          <div>
                                            <img
                                              src={agentAssignedDetails.agent.image}
                                             className='progressAgentImg '
                                            />
                                            <br />&nbsp;
                                            <Typography className='progressCardContentName'>
                                              <b>{`${agentAssignedDetails.agent.firstName} ${agentAssignedDetails.agent.lastName}`}</b>
                                            </Typography>
                                            <Typography className='progressCardContentId'>
                                              <b> {agentAssignedDetails.agent.empId}</b>
                                            </Typography>
                                          </div>
                                        </CardContent>
                                      </Card>&nbsp;&nbsp;&nbsp;&nbsp;
                                      {/* Agent Details */}
                                      <Card className='progressCardRemainData '>
                                        <CardContent>
                                          <Grid container spacing={3}>
                                            <Grid item xs={6}>
                                              <Typography className="agentDetailsData">
                                                <b>Service Type:</b> {agentAssignedDetails.agent.serviceType}
                                              </Typography>
                                            </Grid>
                                            <Grid item xs={6}>
                                              <Typography className="agentDetailsData">
                                                <b>Job Type:</b> {agentAssignedDetails.agent.jobType}
                                              </Typography>
                                            </Grid>
                                            <Grid item xs={6}>
                                              <Typography className="agentDetailsData">
                                                <b>Designation:</b> {agentAssignedDetails.agent.designation}
                                              </Typography>
                                              <Typography className="agentDetailsData">
                                                <b>Phone No:</b> {agentAssignedDetails.agent.phone}
                                              </Typography>
                                            </Grid>
                                            <Grid item xs={6}>
                                              <Typography className="agentDetailsData">
                                                <b>Review:</b> {agentAssignedDetails.agent.review}
                                              </Typography>
                                              <Typography className="agentDetailsData">
                                                <b>Job Description:</b> {agentAssignedDetails.agent.jobDescription}
                                              </Typography>
                                            </Grid>
                                            <Grid item xs={12}>
                                              <Typography className="agentDetailsData">
                                                <b>Email:</b> {agentAssignedDetails.agent.email}
                                              </Typography>
                                            </Grid>
                                          </Grid>
                                        </CardContent>
                                      </Card>
                                    </div>
                                  </>
                                ) : (
                                  <div className='agentDetailsLoading'>
                                    <CircularProgress />
                                  </div>
                                )}
                              </>
                            ) : (
                              <div>
                                <h4 className='selectStatusName'>Select Status</h4>
                                <Select
                                  value={selectedStatus || ''}
                                  onChange={(e) => setSelectedStatus(e.target.value)}
                                className='selectStatusDrop '
                                  displayEmpty // Add displayEmpty prop
                                >
                                  <MenuItem value="" disabled>
                                    Select status
                                  </MenuItem>
                                  {status.map((statusItem) => (
                                    <MenuItem key={statusItem} value={statusItem}>
                                      {statusItem}
                                    </MenuItem>
                                  ))}
                                </Select>
                              </div>
                            )
                          )

                        )}
                      </div>





                      {selectedStatus === 'Assign' && (
                        <div className='selectAgentDiv'>
                          <h4 className='selectAgentName'>Select Agent</h4>
                          <Select
                            value={selectedServiceType || ''}
                            onChange={(e) => setSelectedServiceType(e.target.value)}
                           className='selectAgentDrop'
                            displayEmpty // Add displayEmpty prop
                          >
                            <MenuItem value="" disabled style={{ color: 'white' }}>
                              Select an agent
                            </MenuItem>
                            {agentDetails.map((agent) => (
                              <MenuItem key={agent._id} value={agent.firstName}>
                                {agent.firstName}
                              </MenuItem>
                            ))}
                          </Select>
                        </div>
                      )}





                    </div>



                    {selectedServiceType && selectedStatus === 'Assign' && (
                      <div>
                        {agentDetails
                          .filter((agent) => agent.firstName === selectedServiceType)
                          .map((agent) => (
                            <div>

                              <Card className='agentDetailsCard' style={{backgroundColor:'#e9ecef'}}>
                                <CardContent>
                                  {agentDetails
                                    .filter((agent) => agent.firstName === selectedServiceType)
                                    .map((selectedAgent) => (
                                      <div key={selectedAgent._id} style={{ display: 'flex' }}>
                                        {/* Image */}
                                        <div>
                                          <img
                                            src={selectedAgent.image}
                                           className='agentImg'
                                          /><br />&nbsp;
                                          <div id="qr-code" className='qrCodeDiv'>
                                            <QRCode value={`https://enterprise-qr-reader.vercel.app/agent/${agent.empId}`} className='customerQrCode ' />
                                          </div>
                                        </div>
                                        <div className='completedButtonGridDiv'>
                                          <Grid container spacing={3}>
                                            <Grid item xs={6}>
                                              <Typography className='completedButtonGridDataName'>
                                                <b> {`${selectedAgent.firstName} ${selectedAgent.lastName}`}</b>
                                              </Typography>
                                              <Typography className='completedButtonGridData'>
                                                <b>Service Type:</b> {selectedAgent.serviceType}
                                              </Typography>
                                            </Grid>
                                            <Grid item xs={6}>
                                              <Typography className='completedButtonGridData'>
                                                <b>Agent Id:</b> {selectedAgent.empId}
                                              </Typography>
                                              <Typography className='completedButtonGridData'>
                                                <b>Job Type:</b> {selectedAgent.jobType}
                                              </Typography>
                                            </Grid>
                                            <Grid item xs={6}>
                                              <Typography className='completedButtonGridData'>
                                                <b>Email:</b> {selectedAgent.email}
                                              </Typography>
                                              <Typography className='completedButtonGridData'>
                                                <b>Phone No:</b> {selectedAgent.phone}
                                              </Typography>

                                            </Grid>
                                            <Grid item xs={6}>
                                              <Typography className='completedButtonGridData'>
                                                <b>Review:</b> {selectedAgent.review}
                                              </Typography>

                                              <Typography  className='completedButtonGridData'>
                                                <b>Job Description:</b> {selectedAgent.jobDescription}
                                              </Typography>
                                            </Grid>
                                          </Grid>
                                        </div>
                                      </div>
                                    ))}

                                </CardContent>
                              </Card>
                            </div>
                          ))}

                      </div>
                    )}

                    {selectedServiceType && selectedStatus === 'Assign' && (
                      <div className='assignedButtonDiv'>


                        {loadings ? (
                          <div className='assignedSuccessLoadingDiv'>
                            <CircularProgress color="primary" className='assignedSuccessLoading' />
                          </div>
                        ) : (
                          // <Button
                          //   variant="contained"
                          //   color="primary"
                          //   style={{
                          //     marginTop: '-38.5%',
                          //     backgroundColor: '#32588D',
                          //     marginLeft: '78.5%',
                          //     //   height: '50px',
                          //     width: '120px',
                          //     height: '35%',
                          //     display: selectedServiceType ? 'block' : 'none', // Conditional display
                          //   }}
                          //   onClick={handleAssign}
                          // >
                          //   Assign
                          // </Button>


                          <Button
                          variant="contained"
                          color="primary"
                          style={{
                          
                            display: selectedServiceType ? 'block' : 'none',
                           
                          }}

                          className='assignedButton'
                          onClick={handleAssign}
                        >
                          Assign
                        </Button>
                        


                        )}
                      </div>
                    )}

                    {selectedStatus === 'Pending' && (
                      <div>
                        <textarea
                          placeholder="Add comments here..."
                          rows="4"  // Set the initial number of visible rows
                          style={{ width: '80%', marginLeft: '5%', marginTop: '40px', minHeight: '200px' }}  // Set minHeight to control the height
                          // Add an onChange handler to update the comments
                          onChange={(e) => updateComments(e.target.value)}
                        ></textarea>

                        <Button
                          variant="contained"
                          color="primary"
                          style={{
                            marginTop: '-580px',
                            backgroundColor: 'blue',
                            marginLeft: '68%',
                            width: '160px',
                          }}
                          onClick={handleAssign}
                        >
                          Status Update
                        </Button>
                      </div>
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


          </div>
        
      </div>
      </>


  );
};

export default CustomerComplaintsTable;