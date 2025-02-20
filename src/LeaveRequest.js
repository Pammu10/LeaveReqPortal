import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LeaveRequest = () => {
  const navigate = useNavigate();
  const [view, setView] = useState('request');
  const [leaveData, setLeaveData] = useState([]);
  const [leaveHistory, setLeaveHistory] = useState([]);
  useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
          const user = JSON.parse(atob(token.split('.')[1]));
          if (user.email === 'hod@mycollege.com') {
            navigate('/leave-approval');
          } else {
            navigate('/leave-request');
          }
        }
      }, [navigate]);
  const fetchLeaveData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/leave-status/latest', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setLeaveData([data]);
    } catch (error) {
      console.error('Error fetching leave data:', error);
    }
  };

  const fetchLeaveHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/leave-history', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setLeaveHistory(Array.isArray(data) ? data : [data]);
    } catch (error) {
      console.error('Error fetching leave history:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const token = localStorage.getItem('token');
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch('http://localhost:5000/submit-leave', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });
      if (!response.ok) {
        const text = await response.text();
        throw new Error(text);
      }
      const result = await response.json();
      alert(result.message);
      setView('status');
      form.reset();
  
    } catch (error) {
      console.error('Error submitting leave request:', error);
    }
  };

  useEffect(() => {
    if (view === 'status') fetchLeaveData();
    if (view === 'history') fetchLeaveHistory();
  }, [view]);

  return (
    <div className="container">
      
      <div className="btn-group d-grid gap-2 col-sm-10">
        <h1 className='text-center'>Hostel Leave Request Screen</h1>
        <div className='row'>
        <button className="btn btn-warning m-1 rounded col-sm" onClick={() => setView('request')}>Leave Request</button>
        <button className="btn btn-warning m-1 rounded col-sm" onClick={() => setView('status')}>Leave Status</button>
        <button className="btn btn-warning m-1 rounded col-sm" onClick={() => setView('history')}>Leave History</button>
        </div>
       
      </div>
      {view === 'request' && (
        <div>
          <form className="form d-grid" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="control-label" htmlFor="Ltype">Leave Type</label>
              <div className="col-sm-10">
                <select className="form-control" name="Ltype" id="Ltype">
                  <option value="select">-Select-</option>
                  <option value="sick">Sick</option>
                  <option value="emergency">Emergency</option>
                  <option value="medical">Medical advice</option>
                  <option value="od">On Duty</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label className="control-label" htmlFor="Visit">Visiting Place</label>
              <div className="col-sm-10">
                <input className="form-control" type="text" name="Visit" id="Visit" required />
              </div>
            </div>
            <div className="form-group">
              <label className="control-label" htmlFor="fdate">From Date</label>
              <div className="col-sm-10">
                <input className="form-control" type="date" name="fdate" id="fdate" required />
              </div>
            </div>
            <div className="form-group">
              <label className="control-label" htmlFor="tform">Time From</label>
              <div className="col-sm-10">
                <input className="form-control" type="time" name="tform" id="tform" required />
              </div>
            </div>
            <div className="form-group">
              <label className="control-label" htmlFor="tdate">To Date</label>
              <div className="col-sm-10">
                <input className="form-control" type="date" name="tdate" id="tdate" required />
              </div>
            </div>
            <div className="form-group">
              <label className="control-label" htmlFor="tto">Time To</label>
              <div className="col-sm-10">
                <input className="form-control" type="time" name="tto" id="tto" required />
              </div>
            </div>
            <div className="form-group">
              <label className="control-label" htmlFor="reason">Reason</label>
              <div className="col-sm-10">
                <textarea className="form-control" name="reason" id="reason" required></textarea>
              </div>
            </div>
            <div className="form-group">
              <div className="d-grid gap-2 col-sm-10 mt-4">
                <button type="submit" className="btn btn-warning">Submit Leave Application</button>
              </div>
            </div>
          </form>
        </div>
      )}
      {view === 'status' && (
        <div className='d-grid gap-2 col-sm-10'>
          <h2>Leave Data</h2>
          <div className='table-responsive'>
          <table className="table table-warning table-striped table-hover align-middle">
            <thead>
              <tr>
                <th>Leave Type</th>
                <th>Visiting Place</th>
                <th>Reason</th>
                <th>From Date</th>
                <th>From Time</th>
                <th>To Date</th>
                <th>To Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {leaveData.map((data, index) => (
                <tr key={index}>
                  <td>{data.leave_type}</td>
                  <td>{data.visiting_place}</td>
                  <td>{data.reason}</td>
                  <td>{new Date(data.from_date).toLocaleDateString()}</td>
                  <td>{data.from_time}</td>
                  <td>{new Date(data.to_date).toLocaleDateString()}</td>
                  <td>{data.to_time}</td>
                  <td>{data.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>
      )}
      {view === 'history' && (
        <div className='d-grid gap-2 col-sm-10'>
          <h2>Leave History</h2>
          <div className='table-responsive'>
          <table className="table table-warning table-striped table-hover table align-middle">
            <thead>
              <tr>
                <th>Leave Type</th>
                <th>Visiting Place</th>
                <th>Reason</th>
                <th>From Date</th>
                <th>From Time</th>
                <th>To Date</th>
                <th>To Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {leaveHistory.map((item, index) => (
                <tr key={index}>
                  <td>{item.leave_type}</td>
                  <td>{item.visiting_place}</td>
                  <td>{item.reason}</td>
                  <td>{new Date(item.from_date).toLocaleDateString()}</td>
                  <td>{item.from_time}</td>
                  <td>{new Date(item.to_date).toLocaleDateString()}</td>
                  <td>{item.to_time}</td>
                  <td>{item.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaveRequest;