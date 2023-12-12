import React, { useState } from 'react';
import { Container, Paper, TextField, Button, Typography, Grid, MenuItem } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const Registration = () => {
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [registrationError, setRegistrationError] = useState(null);

  const validationSchema = Yup.object({
    First_name: Yup.string().required('First Name is required'),
    Last_name: Yup.string().required('Last Name is required'),
    Role: Yup.string().required('Role is required'),
    Email: Yup.string()
    .email('Invalid email format')
    .required('Email is required')
    .test('is-gmail', 'Only Gmail email addresses are allowed', (value) => {
      if (value) {
        return value.endsWith('@gmail.com');
      }
      return true; // Allow empty email field
    }),
        Phone: Yup.string().matches(/^[0-9]+$/, 'Phone must be a number').required('Phone is required'),
    Password: Yup.string().required('Password is required'),
  });

  const initialValues = {
    First_name: '',
    Last_name: '',
    Role: '', // This field is for the dropdown
    Email: '',
    Phone: '',
    Password: '',
    Emp_ID: '',
  };

  const onSubmit = async (values) => {
    try {
      const response = await fetch('http://172.17.15.248:2500/Registration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        setRegistrationSuccess(true);
        setRegistrationError(null);
        formik.resetForm();
      } else {
        setRegistrationSuccess(false);
        setRegistrationError('Registration failed. Please check the provided information.');
      }
    } catch (error) {
      setRegistrationSuccess(false);
      setRegistrationError('An error occurred while registering. Please try again later.');
    }
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
  });

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} style={{ padding: '20px', marginTop: '100px' }}>
        <Typography variant="h4" gutterBottom >
          Registration
        </Typography>
        {registrationSuccess && (
          <Typography variant="body1" style={{color:"green"}}>
            Registration successful! You can now log in.
          </Typography>
        )}
        {registrationError && (
          <Typography  variant="body1" style={{color:"red"}}>
            {registrationError}
          </Typography>
        )}
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                name="First_name"
                label="First Name"
                variant="outlined"
                fullWidth
                required
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.First_name}
                error={formik.touched.First_name && Boolean(formik.errors.First_name)}
                helperText={formik.touched.First_name && formik.errors.First_name}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                name="Last_name"
                label="Last Name"
                variant="outlined"
                fullWidth
                required
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.Last_name}
                error={formik.touched.Last_name && Boolean(formik.errors.Last_name)}
                helperText={formik.touched.Last_name && formik.errors.Last_name}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                select
                name="Role"
                label="Role"
                variant="outlined"
                fullWidth
                required
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.Role}
                error={formik.touched.Role && Boolean(formik.errors.Role)}
                helperText={formik.touched.Role && formik.errors.Role}
              >
                <MenuItem value="Agent">Agent</MenuItem>
                <MenuItem value="Customer">Customer</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={6}>
              <TextField
                name="Phone"
                label="Phone"
                variant="outlined"
                fullWidth
                required
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.Phone}
                error={formik.touched.Phone && Boolean(formik.errors.Phone)}
                helperText={formik.touched.Phone && formik.errors.Phone}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="Email"
                label="Email"
                type="email"
                variant="outlined"
                fullWidth
                required
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.Email}
                error={formik.touched.Email && Boolean(formik.errors.Email)}
                helperText={formik.touched.Email && formik.errors.Email}
              />
            </Grid>
           
            <Grid item xs={12}>
              <TextField
                name="Password"
                label="Password"
                type="password"
                variant="outlined"
                fullWidth
                required
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.Password}
                error={formik.touched.Password && Boolean(formik.errors.Password)}
                helperText={formik.touched.Password && formik.errors.Password}
              />
            </Grid>
          </Grid>
          <br/>
          <Button
  type="submit"
  variant="contained"
  color="primary"
  fullWidth
  disabled={!formik.isValid || formik.isSubmitting}
>
  Register
</Button>

        </form>
      </Paper>
    </Container>
  );
};

export default Registration;
