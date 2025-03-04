import React, { useContext} from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LeaveRequest from './LeaveRequest';
import LeaveApproval from './LeaveApproval';
import Auth from './Auth';
import Header from './Header';
import NoPage from './NoPage';
import { AuthContext, AuthProvider } from './AuthContext';


function App() {
  const {token} = useContext(AuthContext)
  return (
    <Router>
      <div className="container-fluid bg-primary bg-gradient p-4 text-light min-vh-100"> 
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

export default function AppWrapper() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}