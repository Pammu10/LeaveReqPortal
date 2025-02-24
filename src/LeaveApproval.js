import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const LeaveApproval = () => {
  const navigate = useNavigate();
  const [pendloading, setPendloading] = useState(false);
  const [allloading, setAllloading] = useState(false);
  const [pendingLeaves, setPendingLeaves] = useState([]);
  const [pending, setPending] = useState(true);
  const [modifyingId, setModifyingId] = useState(null);
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
  const fetchPendingLeaves = useCallback(async () => {
    setPending(true)
    try {
      setPendloading(true);
      const token = localStorage.getItem('token');
      const response = await fetch("https://leavereqbackend.railway.internal/pending-leaves", 
        {headers: {
          'Authorization': `Bearer ${token}`
        }}
      );
      if (response.status === 403) {
        navigate('/');
        setPendloading(false);
        return;
      }
      const data = await response.json();
      setPendingLeaves(data);
      setPendloading(false);
    } catch (error) {
      console.error("Error fetching leave requests:", error);
    }
  }, [navigate]);


  const fetchAllLeaves = async () => {
    setPending(false)
    try {
      setAllloading(true);  
      const token = localStorage.getItem('token');
      const response = await fetch("https://leavereqbackend.railway.internal/all-leaves", 
        {headers: {
          'Authorization': `Bearer ${token}`
        }}
      );
      if (response.status === 403) {
        navigate('/');
        setAllloading(false);
        return;
      }
      const data = await response.json();
      setPendingLeaves(data);
      setAllloading(false);
    } catch (error) {
      console.error("Error fetching leave requests:", error);
    }
  }

  const updatePendingStatus = async (id, status) => {
    try {
      const token = localStorage.getItem('token');  
      const response = await fetch("https://leavereqbackend.railway.internal/update-leave-status", {
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

  const updateAllStatus = async (id, status) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch("https://leavereqbackend.railway.internal/update-leave-status", {
        method: "POST",
        headers: { "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`
         },
        body: JSON.stringify({ id, status })
      });
      await response.json();
      setModifyingId(null);
      fetchAllLeaves();
    } catch (error) {
      console.error("Error updating leave status:", error);
    } 

  }
  const modifyStatus = (id) => {
    alert('You are modifying the leave request');
    setModifyingId(id);
  }


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

   useEffect(() => {
      fetchPendingLeaves();
    }, [fetchPendingLeaves]);


  const currentDate = new Date();
  return (
    <div className='container d-grid gap-2 p-1'>
      <div className='row'>
      <h2 className='btn btn-warning col m-1 p-1' onClick={() => fetchPendingLeaves()}>{pendloading && <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>}Pending Leave Requests</h2>
      <h2 className='btn btn-warning col m-1 p-1' onClick={() => fetchAllLeaves()}>{allloading && <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>}All Leave Requests</h2>
      </div>
      <div className='table-responsive'>
      <table className='table table-warning table-striped table-hover table align-middle'>
        <thead>
          <tr>
            <th>Student Reg</th>
            <th>Student Name</th>
            <th>Student Year</th>
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
          {pendingLeaves?.length === 0 ? (
            <tr><td colSpan="12">No pending leave requests</td></tr>
          ) : (
            pendingLeaves?.map(item => {
              const fromDate = new Date(item.from_date);
              const showModifyButton = currentDate < fromDate;
              return (
              <tr key={item.id} className={item.status === 'rejected' ? 'table-warning' : item.status === 'approved' ? 'table-info' : ''}>
                <td>{item.studentID}</td>
                <td>{item.student_name}</td>
                <td>{item.student_year}</td>
                <td>{item.leave_type}</td>
                <td>{item.visiting_place}</td>
                <td>{new Date(item.from_date).toLocaleDateString()}</td>
                <td>{item.from_time}</td>
                <td>{new Date(item.to_date).toLocaleDateString()}</td>
                <td>{item.to_time}</td>
                <td>{item.reason}</td>
              <td>{item.status}</td>
              <td>
                {pending === true ? (<div className="btn-group-vertical">
                  <button className="btn btn-success p-1 m-1 rounded" onClick={() => updatePendingStatus(item.id, 'approved')}>Approve</button>
                  <button className="btn btn-danger p-1 m-1 rounded" onClick={() => updatePendingStatus(item.id, 'rejected')}>Reject</button>
                  </div>) : (
                      modifyingId === item.id ? (
                        <div className="btn-group-vertical">
                          <button className="btn btn-success p-1 m-1 rounded" onClick={() => updateAllStatus(item.id, 'approved')}>Accept</button>
                          <button className="btn btn-danger p-1 m-1 rounded" onClick={() => updateAllStatus(item.id, 'rejected')}>Reject</button>
                        </div>
                      ) : (
                        showModifyButton ? (
                          <button className="btn btn-info p-1 m-1 rounded" onClick={() => modifyStatus(item.id)}>Modify</button>
                        ) : (
                          ''
                        )
                      )
                    )}
                  
                </td>
              </tr>
            );
          })
          )}
        </tbody>
      </table>
    </div>
    </div>
  );
};

export default LeaveApproval;