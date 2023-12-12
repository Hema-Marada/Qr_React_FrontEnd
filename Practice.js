// ApiTable.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ApiTable = () => {
  const [apiData, setApiData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://api.publicapis.org/entries');
        // Filter entries where HTTPS is true
        const filteredData = response.data.entries.filter(api => api.HTTPS && api.Auth !== '');
        setApiData(filteredData);
      } catch (error) {
        console.error('Error fetching API data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h2>API Table</h2>
      <table>
        <thead>
          <tr>
            <th>API</th>
            <th>Description</th>
            <th>Auth</th>
            <th>HTTPS</th>
            <th>CORS</th>
            <th>Link</th>
            <th>Category</th>
          </tr>
        </thead>
        <tbody>
          {apiData.map((api, index) => (
            <tr key={index}>
              <td>{api.API}</td>
              <td>{api.Description}</td>
              <td>{api.Auth}</td>
              <td>{api.HTTPS.toString()}</td>
              <td>{api.Cors}</td>
              <td>
                <a href={api.Link} target="_blank" rel="noopener noreferrer">
                  {api.Link}
                </a>
              </td>
              <td>{api.Category}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ApiTable;
