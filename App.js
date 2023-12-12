import React from 'react';

import {  Routes,Route } from 'react-router-dom';
 import Login from './components/Agent/login';
 import Reg from './components/Registration'
 import Admin from './components/Adminsssss'
//  import Customer from './components/Customer'
 import Cus from './components/Customerid'
 import Side from '../src/components/Admin/Sidebar'
 import Agent from './components/Admin/Agentdetails'
 import Customer from '../src/components/Admin/Customer'
 import Customerform from '../src/components/Customer/Customerform'
 import Home from '../src/components/Main/Home'
 import AgentData from '../src/components/Agent/Details'
 import Complaints from '../src/components/Admin/Complaints'
import Header from './components/Admin/Header';
import Practice from './Practice'


function App() {
  return (

      <Routes>
        <Route path="Login" element={<Login/>}/>
        <Route path="Reg" element={<Reg/>}/>
        <Route path="Admin" element={<Admin/>}/>
        {/* <Route path="Customer" element={<Customer/>}/> */}
        <Route path="Cus" element={<Cus/>}/>
        <Route path="Side" element={<Side/>}/>
        <Route path="Agent" element={<Agent/>}/>
        <Route path="Customer" element={<Customer/>}/>
        <Route path="Customerform" element={<Customerform/>}/>
        <Route path="" element={<Home/>}/>
        <Route path="AgentData" element={<AgentData/>}/>
        <Route path="Complaints" element={<Complaints/>}/>

        <Route path="Header" element={<Header/>}/>

        <Route path="Practice" element={<Practice/>}/>





      </Routes>

      );
    }
    
    export default App;