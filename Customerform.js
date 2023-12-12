import React, { useState } from 'react';
import axios from 'axios';
import {
  TextField,
  Button,
  Card,
  CardContent,
  MenuItem,
  InputLabel,
  Select,
  FormControl,
  Typography,
  Dialog,
  DialogContent,
  DialogActions,
  CircularProgress,
  DialogTitle, Grid
} from '@mui/material';
import { useNavigate } from 'react-router-dom'; // Import the useNavigate hook
import './Customerform.css'
const serviceTypes = [
  'Networking',
  'Security Services',
  'Hardware Maintenance',
  'System Administration',
  'Consulting',
  'Training and Workshops',
  'Other',
];


const BASE_URL = 'https://enterprise-qr-backend.cyclic.app';

const CustomerComplaints = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    otp: '',
    doorNoStreet:'',
    address: '',
    description: '',
    type: '',
    status: 'open',
  });

  const [step, setStep] = useState(1);
  const [otpVerified, setOtpVerified] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false); // Add loading state
  const navigate = useNavigate(); // Initialize the navigate function
  const [pinCode, setPinCode] = useState('');
  const [district, setDistrict] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const validatePhoneNumber = (phoneNumber) => {
    return /^\d{10}$/.test(phoneNumber);
  };
  const validateName = (name) => {
    const nameRegex = /^[a-zA-Z ]{3,50}$/; // Validate name format (3 to 50 characters)
    return nameRegex.test(name);
  };
  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@(gmail\.com|miraclesoft\.com)$/i; // Validate email format
    return emailRegex.test(email);
  };

  const handleNextStep = async () => {
    if (step === 1) {
      // Set loading to true before making the API call
      

      const errors = {};

      if (!formData.firstName) {
        errors.firstName = 'First Name is required';
      }

      if (!formData.lastName) {
        errors.lastName = 'Last Name is required';
      }

      if (!formData.phone) {
        errors.phone = 'Phone Number is required';
      } else if (!validatePhoneNumber(formData.phone)) {
        errors.phone = 'Invalid phone number';
      }

      if (!formData.email) {
        errors.email = 'Email is required';
      } else if (!validateEmail(formData.email)) {
        errors.email = 'Invalid email address';
      }

      setFormErrors(errors);

      if (Object.keys(errors).length === 0) {
        try {
          setLoading(true);

          await axios.post(`${BASE_URL}/sendotp`, {
            email: formData.email,
          });
          setStep(step + 1);
        } catch (error) {
          console.error('Error sending OTP:', error);
          alert('Failed to send OTP');
        } finally {
          // Set loading to false when the API call is complete
          setLoading(false);
        }
      }
    } else if (step === 2) {
      if (!formData.otp) {
        setFormErrors({ otp: 'OTP is required' });
        return;
      }

      try {
        const response = await axios.post(`${BASE_URL}/verifyotp`, {
          email: formData.email,
          otp: formData.otp,
        });

        if (response.data.message === 'OTP verified successfully') {
          setOtpVerified(true);
          setStep(step + 1);
        } else {
          alert('Invalid OTP');
        }    
      } catch (error) {
        console.error('Error verifying OTP:', error);
        alert('Failed to verify OTP');
      } finally {
        setLoading(false);
      }
} else if (step === 3) {
  const errors = {};

  if (!formData.address) {
    errors.address = 'Address is required';
  }

  if (!formData.description) {
    errors.description = 'Description is required';
  }

  if (!formData.type) {
    errors.type = 'Complaint Type is required';
  }

  setFormErrors(errors);

  if (Object.keys(errors).length === 0) {
    try {
      if (otpVerified) {
        const requestData = {
          ...formData,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
        };

        const response = await axios.post(`${BASE_URL}/customer`, requestData);
        console.log('Complaint submitted:', response.data);
        setSubmissionStatus('success');
      } else {
        setSubmissionStatus('error');
        alert('Please verify OTP before submitting the complaint.');
      }
      if (submissionStatus === 'success') {
        // Open the success dialog
        setDialogOpen(true);
      }
    } catch (error) {
      console.error('Error submitting complaint:', error);
      setSubmissionStatus('error');
      alert('Failed to submit complaint');
    }
  }
  
}
};
const handleDialogClose = () => {
    // Reset the form and move back to step 1
    setFormData({
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      otp: '',
      doorNoStreet:'',
      address: '',
      description: '',
      type: '',
      status: 'open',
    });
    navigate('/ '); // Replace with your main page URL
    setOtpVerified(false);
    setSubmissionStatus(null);
    setFormErrors({});
    setDialogOpen(false);
  };

 
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const updatedFormErrors = { ...formErrors };
  
    if ((name === 'firstName' || name === 'lastName') && !validateName(value)) {
      updatedFormErrors[name] = 'Please enter a valid name';
    } else if (name === 'firstName' || name === 'lastName') {
      // Don't delete the error if it's not a validation error
      updatedFormErrors[name] = undefined;
    }
  
    if (name === 'email' && !validateEmail(value)) {
      updatedFormErrors[name] = 'Please enter a valid email';
    } else if (name === 'email') {
      // Don't delete the error if it's not a validation error
      updatedFormErrors[name] = undefined;
    }
  
    setFormErrors(updatedFormErrors);
  
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  


  const handleCancel = () => {
    // Use the navigate function to navigate back to the main page
    navigate('/ '); // Replace with your main page URL
  };
  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };


  const handlePinCodeSubmit = async () => {

    if (!formData.doorNoStreet.trim()) {
      setErrorMessage('Please enter above field.');
      return;
    }
    if (!pinCode.trim()) {
      setErrorMessage('Please enter a valid pin code.');
      return;
    }

    // Clear previous error message
    setErrorMessage('');
    const apiKey = '53b339b09c8e4aa89cd7bafd7b1f1713';

    try {
      const response = await fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${pinCode}&key=${apiKey}&language=en&pretty=1`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch address');
      }

      const data = await response.json();
      const components = data.results[0]?.components;

      if (!components) {
        throw new Error('Address components not found');
      }
      const doorNoStreet = formData.doorNoStreet || '';
      const address = ` ${doorNoStreet}, ${components.county || ''}, ${components.state_district || ''}, ${components.state || ''}, ${components.country || ''} , ${components.postcode || ''}`.trim();
      setFormData((prevData) => ({
        ...prevData,
        address: address || 'Unknown Address',
      }));
      // setDistrict(address || 'Unknown Address');
    } catch (error) {
      console.error('Error fetching address:', error);
    }
  };
  return (
    <>
    <div className='customerFormContainer'>
      <Card className={`customerFormCard ${step === 2 ? 'smallCard' : ''} ${step === 3 ? 'largeCard' : ''}`}>
        <Typography className='customerFormHeading'>
          Raise a Complaint - Fill Form
        </Typography>
        <CardContent>
          <div className='customerForm'>
            {step === 1 && (
              <>
                <TextField
                  name="firstName"
                  label="First Name"
                  variant="outlined"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  error={formErrors.firstName}
                  helperText={formErrors.firstName}
                  className='customerFormInput'
                /><br/>
                <TextField
                  name="lastName"
                  label="Last Name"
                  variant="outlined"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  error={formErrors.lastName !== undefined}
                  helperText={formErrors.lastName}
                  className='customerFormInput'                /><br/>
                <TextField
                  name="phone"
                  label="Phone"
                  type='number'
                  variant="outlined"
                  value={formData.phone}
                  onChange={handleInputChange}
                  error={formErrors.phone !== undefined}
                  helperText={formErrors.phone}
                  className='customerFormInput'                /><br/>
                <TextField
                  name="email"
                  label="Email"
                  variant="outlined"
                  value={formData.email}
                  onChange={handleInputChange}
                  error={formErrors.email !== undefined}
                  helperText={formErrors.email}
                  className='customerFormInput'                /><br/>
               <Grid container spacing={2}> {/* Use Grid container */}
                 <Button
              type="button"
              // variant="contained"
              // color="primary"
              className={`customerFormCancelButton ${step === 2 ? 'smallButton' : ''}`}
              onClick={handleCancel}
            >
              Cancel
            </Button>
            </Grid>
              </>
            )}
  
            {step === 2 && (
              <>
                <TextField
                  name="otp"
                  label="OTP"
                  variant="outlined"
                  value={formData.otp}
                  onChange={handleInputChange}
                  error={formErrors.otp !== undefined}
                  helperText={formErrors.otp}
                  className='customerFormInput'                />
                 <Grid container spacing={2}> {/* Use Grid container */}
            
              <Grid item> {/* Second Button */}
                <Button
                  type="button"
                  // variant="contained"
                  // color="primary"
                  size="small" // Set the size to small
                  className={`customerFormCancelButton ${step === 2 ? 'smallButton' : ''}`}

                  onClick={handleCancel}
                >
                  Cancel
                </Button>
              </Grid>
              <Grid item> {/* First Button */}
                <Button
                  type="button"
                  variant="outlined"
                  size="small" // Set the size to small
className={`customerFormBackButton ${step === 2 ? 'smallButton' : ''} ${step === 3 ? 'largeButton' : ''}`}
                  onClick={handleBack}
                >
                  Back
                </Button>
              </Grid>
            </Grid>
              </>
            )}
  
            {step === 3 && (
              <>
  <TextField
          name="doorNoStreet"
          label="Enter your Door.NO and Street"
          variant="outlined"
          multiline
          rows={1}
          value={formData.doorNoStreet}
          onChange={(e) => setFormData({ ...formData, doorNoStreet: e.target.value })}
          error={formErrors.doorNoStreet !== undefined}
          helperText={formErrors.doorNoStreet}
          className='customerFormInput'          /><br/>
<Grid item>
  
        <TextField
          label="Enter Pin Code"
          variant="outlined"
          value={pinCode}
          onChange={(e) => setPinCode(e.target.value)}
          style={{marginTop:"-1%"}}
        />
&nbsp;&nbsp;
        <Button variant="contained" onClick={handlePinCodeSubmit} 
style={{
     backgroundColor: "#32588D",
     borderColor:" #538dde",
     fontSize: "14px",
     minWidth: "71px",
     height: "36px",
     fontFamily: "Roboto",
     fontWeight: "500",
     marginTop:"1%"}}>
        Get  Address
        </Button>
        {errorMessage && (
          <div style={{ color: 'red', marginTop: '1%' }}>{errorMessage}</div>
        )}
      </Grid><br/>
    
               <TextField
          name="address"
          label="Address"
          variant="outlined"
          multiline
          rows={2}
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          // helperText={formErrors.address}
          className='customerFormInput'          /><br/>
          <FormControl variant="outlined"className='customerFormInput'>
                  <InputLabel>Type</InputLabel>
                  <Select
                    name="type"
                    label="Type"
                    value={formData.type}
                    onChange={handleInputChange}
                  >
                    {serviceTypes.map((type, index) => (
                      <MenuItem key={index} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                  
                </FormControl><br/>
                <TextField
                  name="description"
                  label="Description"
                  variant="outlined"
                  multiline
                  rows={3}
                  value={formData.description}
                  onChange={handleInputChange}
                  error={formErrors.description !== undefined}
                  helperText={formErrors.description}
                  className='customerFormInput'                /><br/>
                
                <Grid container spacing={2}> {/* Use Grid container */}
            
              <Grid item> {/* Second Button */}
                <Button
                  type="button"
                  // variant="contained"
                  color="primary"
                  size="small" // Set the size to small
                  onClick={handleCancel}
                 className={`customerFormCancelButton ${step === 2 ? 'smallButton' : ''}`}

                >
                  Cancel
                </Button>
              </Grid>
              <Grid item> {/* First Button */}
                <Button
                  type="button"
                  variant="outlined"
                  color="primary"
                  // style={{backgroundColor:"#4f5b5e", marginLeft:"190%"}}
                  className={`customerFormBackButton ${step === 2 ? 'smallButton' : ''} ${step === 3 ? 'largeButton' : ''}`}

                  size="small" // Set the size to small
                  onClick={handleBack}
                >
                  Back
                </Button>
              </Grid>
            </Grid>
              </>
            )}
  
            {loading && (
              <div className='customerFormLoadingDiv'>
                <CircularProgress color="primary" className='customerFormLoading'/>
              </div>
            )}
  
  {submissionStatus === 'success' && (
              // Use a dialog for success message
              <Dialog open={submissionStatus === 'success'} onClose={handleDialogClose}>
                <DialogTitle>Success</DialogTitle>
                <DialogContent>
                  <Typography variant="success" style={{ color: 'green' }}>
                    Complaint submitted successfully!
                  </Typography>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleDialogClose} color="primary">
                    OK
                  </Button>
                </DialogActions>
              </Dialog>
            )}
  
            {submissionStatus === 'error' && (
              <Typography variant="error" style={{ color: 'red' }}>
                Failed to submit the complaint. Please try again.
              </Typography>
            )}
                  <Grid container spacing={2}> 
                  <Grid container spacing={-12}> 

            <Button
                type="button"
              variant="contained"
              // size="small" // Set the size to small
              className={`customerFormButton ${step === 2 ? 'smallButton' : ''}`}

              // style={{...marginTop:"-12%",marginLeft:"105%"}}
              onClick={handleNextStep}
            >
              {step === 3 ? 'Submit' : 'Next'}
            </Button>
            </Grid></Grid>
          </div>
        </CardContent>
      </Card>
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogContent>
        <img
                                src="https://badge-exam.miraclesoft.com/assets/ecert/Completed-test.svg"
                                alt="Your Image Alt Text"
                            />
          <Typography variant="success" style={{ color: 'green' }}>
            Complaint submitted successfully!
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </div>
    </>
  );
  
};

export default CustomerComplaints;