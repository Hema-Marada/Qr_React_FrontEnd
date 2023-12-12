import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar';
import { useLocation } from 'react-router-dom';
import {
  Button, Typography, Grid, Card, CardContent, Stepper,
  Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import 'react-datepicker/dist/react-datepicker.css';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Tooltip from '@mui/material/Tooltip';
import './Agentdetails.css'
import Header from './Header';
import './Header.css'


// const BASE_URL = 'https://enterprise-qr-backend.cyclic.app';
const BASE_URL = 'http://172.17.15.248:4600';


const QRScanner = () => {

  const location = useLocation();
  const pagePath = location.pathname;
  const [employeeData, setEmployeeData] = useState([]);

  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false); // State to manage form visibility
  const [dataConfirmed, setDataConfirmed] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [certificateData, setCertificateData] = useState([]); // State to store certificate data
  const [certificateNames, setCertificateNames] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);

  const [certificates, setCertificates] = useState({});
  const [imagePreview, setImagePreview] = useState(null);

  const [isImageModalOpen, setImageModalOpen] = useState(false);
  const [agentDetails, setAgentDetails] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Fetch data from the API
    axios.get(`${BASE_URL}/getAgents`)
      .then((response) => {
        const agentEmployees = response.data.filter(employee => employee.role === 'agent');
        setEmployeeData(agentEmployees);

      })
      .catch((error) => {
        console.error('Error fetching employee data:', error);
      });
  }, []);

  useEffect(() => {
    axios.get(`${BASE_URL}/getCertificate`)
      .then((response) => {

        setCertificateData(response.data);
        setLoading(false)
      })
      .catch((error) => {
        console.error('Error fetching certificate data: ', error);
      });
  }, []);

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


  const closeImageModal = () => {
    setImageModalOpen(false);
  };

  const fetchAgentDetails = async (empId) => {
    try {
      const response = await fetch(`${BASE_URL}/getAgents/${empId}`);
      if (response.ok) {
        const data = await response.json();
        console.log('Received data:', data); // Log the data
        setAgentDetails({});
        setAgentDetails(data[0]);
      } else {
        // Handle error here
        console.error('Failed to fetch agent details');
      }
    } catch (error) {
      console.error('An error occurred', error);
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  return (

    <>
    <div>
      <Header />
    </div>
    <div className='gcontainer'>
      
      <Sidebar />

      <div className='agentCompMainDiv'>

        {loading ? (
          <div className='agentCompLoadingDiv'>
            <CircularProgress color="primary" className='agentCompLoading' />

          </div>
        ) : (
          employeeData.reduce((rows, employee, index) => {
            if (index % 3 === 0) rows.push([]);
            rows[rows.length - 1].push(employee);
            return rows;
          }, []).map((row, rowIndex) => (
            <Grid container spacing={2} key={rowIndex} >
              {row.map((employee) => (
                <Grid item xs={12} md={4} key={employee.empId} className='hoverGrid'>
                  <Card className='agentCompCard'>
                    <CardContent>
                      <div className='agentCompCardContentDiv'>
                        <img
                          src={employee.image}
                          alt={`Employee ${employee.empId}`}
                          className='agentCompImg'
                        />
                        <div className='agentCompContentMainDiv'>
                          <div className='agentCompDataDisplay'>
                            <div className='agentCompNameDiv'>
                              <b>Agent Name:</b>
                            </div>
                            <div className='agentCompName'>
                              {employee.firstName}&nbsp;{employee.lastName}
                            </div>
                          </div>
                          <div className='agentCompContentData'>
                            <div className='agentCompNameDiv'>
                              <b>Agent ID:</b>
                            </div>
                            <div className='agentCompData'>
                              {employee.empId}
                            </div>
                          </div>
                          <div className='agentCompContentData'>
                            <div className='agentCompNameDiv'>
                              <b>Email :</b>
                            </div>
                            <div className='agentCompData'>
                              {employee.email}
                            </div>
                          </div>
                          <div className='agentCompContentData'>
                            <div className='agentCompNameDiv'>
                              <b>Job Type:</b>
                            </div>
                            <div className='agentCompData'>
                              {employee.jobType}
                            </div>
                          </div>
                          <div className='agentCompContentData'>
                            <div className='agentCompNameDiv'>
                              <b>Experience:</b>
                            </div>
                            <div className='agentCompData'>
                              {employee.workExperience} Years
                            </div>
                          </div>
                          <div className='agentCompContentData'>
                            <div className='agentCompNameDiv'>
                              <b>Contact No:</b>
                            </div>
                            <div className='agentCompData'>
                              {employee.phone}
                            </div>
                          </div>
                          <div className='agentCompContentData'>
                            <div className='agentCompNameDiv'>
                              <b>Service Type:</b>
                            </div>
                            <div className='agentCompData'>
                              {employee.serviceType}
                            </div>
                          </div>
                        </div>
                        <div className='parentDiv'>
                        <div className='viewDetailsDiv'>
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          onClick={() => {
                            console.log("Clicked Agent ID: ", employee.empId);


                            openModal();
                            fetchAgentDetails(employee.empId);
                          }}
                          className='viewDetailsButton'
                          style={{ marginTop: '4%' }}
                        >
                          View Details
                        </Button>
                        </div>
                        </div>

                        <div>

                          <Modal
                            open={isModalOpen}
                            onClose={closeModal}
                            aria-labelledby="agent-details-modal"
                            aria-describedby="agent-details-description"
                          >
                            <Box

                              className="boxContainer"
                            >
                              <Button
                                color="primary"
                                onClick={closeModal}
                                className='agentCompCloseButton'
                              >
                                <Tooltip title="Close">
                                  <b style={{ color: 'black' }}>X</b>
                                </Tooltip>
                              </Button>

                              {agentDetails ? (
                                <div className='agentCompCardMainDiv'>
                                  <div className='agentCompCardDiv'>
                                    <Card style={{ overflow: 'hidden' }}>
                                      <CardContent>
                                        <div>
                                          <div className='agentCompModalImgDiv'>
                                            <img
                                              src={agentDetails.image}
                                              className='agentCompModalImg'
                                            />
                                            <div className='agentCompModalDataDiv'>
                                              <Typography className='agentCompModalData'>
                                                <span>{agentDetails.firstName}&nbsp;{agentDetails.lastName}</span>
                                              </Typography>
                                              <Typography color="textSecondary" className='agentCompModalData'>
                                                <b>Employee ID:</b> {agentDetails.empId}
                                              </Typography>
                                            </div>
                                          </div>
                                          <br />
                                          <div>
                                            <Typography>
                                              <b>Email:</b> {agentDetails.email}
                                            </Typography>
                                            <Typography>
                                              <b>Role:</b> {agentDetails.role}
                                            </Typography>
                                            <Typography>
                                              <b>Job Type:</b> {agentDetails.jobType}
                                            </Typography>
                                          </div>
                                        </div>
                                        <Typography>
                                          <b>Job Description:</b> {agentDetails.jobDescription}
                                        </Typography>
                                        <Typography>
                                          <b>Rating:</b> {agentDetails.rating}
                                        </Typography>
                                        <Typography>
                                          <b>Review:</b> {agentDetails.review}
                                        </Typography>
                                        <Typography>
                                          <b>Phone:</b> {agentDetails.phone}
                                        </Typography>
                                        <Typography>
                                          <b>Active State:</b> {agentDetails.activeState}
                                        </Typography><br />
                                        <Typography variant="h6" className='agentCompCertificate'>
                                          <b> Certification Timeline</b>:
                                        </Typography>
                                        <ul>
                                          {agentDetails.certifications?.map((cert) => (
                                            <li key={cert._id}>
                                              <b> Certificate ID:</b> {cert.certificateId}<br />
                                              <b> Certificate Name:</b> {certificates && certificates[cert.certificateId] ? certificates[cert.certificateId].name : 'Not Found'}<br />
                                              <b> Start Date:</b> {cert.startDate}<br />
                                              <b> End Date:</b> {cert.endDate}<br />
                                              <b> Pending Days:</b> {cert.pendingDays}<br /><br />
                                              <Button
                                                variant="contained"
                                                style={{
                                                  backgroundColor: cert.pendingDays > 0 ? 'green' : 'red',

                                                }} className='agentCompPendingButton'
                                              >
                                                {cert.pendingDays > 0 ? 'Active' : 'Expired'}
                                              </Button><br /><br />
                                            </li>
                                          ))}
                                        </ul>
                                      </CardContent>
                                    </Card>
                                  </div>
                                </div>
                              ) : (
                                <div className='agentCompLoadingDivFinal'>
                                  <CircularProgress />
                                </div>
                              )}
                            </Box>
                          </Modal>

                        </div>

                      </div>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ))
        )}

        <Dialog open={isImageModalOpen} onClose={closeImageModal}>
          <DialogTitle>Image Preview</DialogTitle>
          <DialogContent>
            <img src={imagePreview} alt="Employee Image" style={{ width: '100%' }} />
          </DialogContent>
          <DialogActions>
            <Button onClick={closeImageModal} color="primary" className='agentCompDialog'>
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </div>
      
          </div>
          </>

  );
};

export default QRScanner;



