import React, { useState, useEffect } from 'react';
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

      await response.json();
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
    <div className='container'>
      <h2>Pending Leave Requests</h2>
      <div className='table-responsive'>
      <table className='table table-warning table-striped table-hover table align-middle'>
        <thead>
          <tr>
            <th>Student Reg</th>
            <th>Leave Type</th>
            <th>Visiting Place</th>
            <th>From Date</th>
            <th>From Time</th>
            <th>To Date</th>
            <th>To Time</th>
            <th>Reason</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {pendingLeaves.length === 0 ? (
            <tr><td colSpan="10">No pending leave requests</td></tr>
          ) : (
            pendingLeaves.map(item => (
              <tr key={item.id}>
                <td>{item.studentID}</td>
                <td>{item.leave_type}</td>
                <td>{item.visiting_place}</td>
                <td>{new Date(item.from_date).toLocaleDateString()}</td>
                <td>{item.from_time}</td>
                <td>{new Date(item.to_date).toLocaleDateString()}</td>
                <td>{item.to_time}</td>
                <td>{item.reason}</td>
                <td>{item.status}</td>
                <td>
                  <div className="btn-group-vertical">
                  <button className="btn btn-success p-1 m-1 rounded" onClick={() => updateStatus(item.id, 'approved')}>Approve</button>
                  <button className="btn btn-danger p-1 m-1 rounded" onClick={() => updateStatus(item.id, 'rejected')}>Reject</button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
    </div>
  );
};

export default LeaveApproval;