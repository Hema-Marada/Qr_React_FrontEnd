import React, { useEffect, useState } from 'react';
import axios from 'axios';
import jwt_decode from 'jwt-decode'; // Import jwt_decode for token decoding
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Container,
  Button
} from '@mui/material';
function formatDateString(dateString) {
    // Implement your date formatting logic here
    return dateString;
  }
  
const CustomerComplaintsTable = () => {
  const [data, setData] = useState([]);
  const [employeeId, setEmployeeId] = useState(null); // Employee ID from local storage

  useEffect(() => {
    // Retrieve the Employee ID from local storage
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwt_decode(token);
      setEmployeeId(decodedToken.Emp_id);
    }

    if (employeeId) {
      // Fetch data based on Employee ID
      axios
        .get(`http://172.17.15.248:2500/getcustomerById/${employeeId}`)
        .then((response) => {
          setData(response.data);
        })
        .catch((error) => {
          console.error('Error fetching customer data:', error);
        });
    }
  }, [employeeId]);

  return (
    <Container className="tableContainer">
      <TableContainer component={Paper}>
        <Table aria-label="Customer Complaints Table">
          <TableHead>
            <TableRow>
              <TableCell>Customer ID</TableCell>
              <TableCell>Customer Name</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Service Type</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((customer) => (
              <TableRow key={customer._id}>
                <TableCell>{customer.customerId}</TableCell>
                <TableCell>
                  {customer.firstName} {customer.lastName}
                </TableCell>
                <TableCell>{customer.phone}</TableCell>
                <TableCell>{customer.email}</TableCell>
                <TableCell>{customer.serviceType}</TableCell>
                <TableCell>{formatDateString(customer.date)}</TableCell>
                <TableCell>{customer.description}</TableCell>
                <TableCell>
                  {customer.status === 'open' ? (
                    <Button variant="contained" style={{ backgroundColor: 'orange', color: 'white' }}>
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
    </Container>
  );
};

export default CustomerComplaintsTable;

