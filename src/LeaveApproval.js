import React, { useState, useEffect } from 'react';
import './global.css';
import { useNavigate } from 'react-router-dom';

const LeaveApproval = () => {
  const navigate = useNavigate();
  const [pendingLeaves, setPendingLeaves] = useState([]);
  useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
          const user = JSON.parse(atob(token.split('.')[1]));
          if (user.studentId === 'A') {
            navigate('/leave-approval');
          } else {
            navigate('/leave-request');
          }
        }
      }, [navigate]);
  const fetchPendingLeaves = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch("http://localhost:5000/pending-leaves", 
        {headers: {
          'Authorization': `Bearer ${token}`
        }}
      );
      if (response.status === 403) {
        navigate('/');
        return;
      }
      const data = await response.json();
      setPendingLeaves(data);
    } catch (error) {
      console.error("Error fetching leave requests:", error);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const token = localStorage.getItem('token');  
      const response = await fetch("http://localhost:5000/update-leave-status", {
        method: "POST",
        headers: { "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`
         },
        body: JSON.stringify({ id, status })
      });

      const result = await response.json();
      alert(result.message);
      fetchPendingLeaves();
    } catch (error) {
      console.error("Error updating leave status:", error);
    }
  };

  useEffect(() => {
    fetchPendingLeaves();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
      return;
    }

    const studentId = JSON.parse(atob(token.split('.')[1])).studentId;
    if (studentId !== 'A') {
      navigate('/');
    }
  }, [navigate]);

  return (
    <div>
      <h2>Pending Leave Requests</h2>
      <table className='table'>
        <thead>
          <tr>
            <th>ID</th>
            <th>Leave Type</th>
            <th>Visiting Place</th>
            <th>From Date</th>
            <th>To Date</th>
            <th>Reason</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {pendingLeaves.length === 0 ? (
            <tr><td colSpan="8">No pending leave requests</td></tr>
          ) : (
            pendingLeaves.map(item => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.leave_type}</td>
                <td>{item.visiting_place}</td>
                <td>{new Date(item.from_date).toLocaleDateString()}</td>
                <td>{new Date(item.to_date).toLocaleDateString()}</td>
                <td>{item.reason}</td>
                <td>{item.status}</td>
                <td>
                  <button className="approve" onClick={() => updateStatus(item.id, 'approved')}>Approve</button>
                  <button className="reject" onClick={() => updateStatus(item.id, 'rejected')}>Reject</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default LeaveApproval;