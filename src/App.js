import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LeaveRequest from './LeaveRequest';
import LeaveApproval from './LeaveApproval';
import Auth from './Auth';
import Header from './Header';
import NoPage from './NoPage';
import './index.css';
import './global.css';


function App() {
  let token = localStorage.getItem('token');

  return (
    <Router>
      <div className="App">
      {token && <Header />}
        <Routes>
          <Route path="/leave-request" element={<LeaveRequest />} />
          <Route path="/leave-approval" element={<LeaveApproval />} />
          <Route path="/" element={<Auth/>} />
          <Route path="*" element={<NoPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;