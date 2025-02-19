import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './global.css';

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
      const result = await response.json();
      alert(result.message);
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
      <h1 className="my-4">Hostel Leave Request Screen</h1>
      <div className="btn-group mb-4">
        <button className="btn btn-primary" onClick={() => setView('request')}>Leave Request</button>
        <button className="btn btn-secondary" onClick={() => setView('status')}>Leave Status</button>
        <button className="btn btn-info" onClick={() => setView('history')}>Leave History</button>
      </div>
      {view === 'request' && (
        <div>
          <form className="form-horizontal" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="control-label col-sm-2" htmlFor="Ltype">Leave Type</label>
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
              <label className="control-label col-sm-2" htmlFor="Visit">Visiting Place</label>
              <div className="col-sm-10">
                <input className="form-control" type="text" name="Visit" id="Visit" required />
              </div>
            </div>
            <div className="form-group">
              <label className="control-label col-sm-2" htmlFor="fdate">From Date</label>
              <div className="col-sm-10">
                <input className="form-control" type="date" name="fdate" id="fdate" required />
              </div>
            </div>
            <div className="form-group">
              <label className="control-label col-sm-2" htmlFor="tform">Time From</label>
              <div className="col-sm-10">
                <input className="form-control" type="time" name="tform" id="tform" required />
              </div>
            </div>
            <div className="form-group">
              <label className="control-label col-sm-2" htmlFor="tdate">To Date</label>
              <div className="col-sm-10">
                <input className="form-control" type="date" name="tdate" id="tdate" required />
              </div>
            </div>
            <div className="form-group">
              <label className="control-label col-sm-2" htmlFor="tto">Time To</label>
              <div className="col-sm-10">
                <input className="form-control" type="time" name="tto" id="tto" required />
              </div>
            </div>
            <div className="form-group">
              <label className="control-label col-sm-2" htmlFor="reason">Reason</label>
              <div className="col-sm-10">
                <textarea className="form-control" name="reason" id="reason" required></textarea>
              </div>
            </div>
            <div className="form-group">
              <div className="col-sm-offset-2 col-sm-10">
                <button type="submit" className="btn btn-warning">Submit Leave Application</button>
              </div>
            </div>
          </form>
        </div>
      )}
      {view === 'status' && (
        <div>
          <h2>Leave Data</h2>
          <div className='table-container'>
          <table className="table table-bordered table-responsive">
            <thead>
              <tr>
                <th>ID</th>
                <th>Leave Type</th>
                <th>Visiting Place</th>
                <th>Reason</th>
                <th>From Date</th>
                <th>From Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {leaveData.map((data, index) => (
                <tr key={index}>
                  <td>{data.id}</td>
                  <td>{data.leave_type}</td>
                  <td>{data.visiting_place}</td>
                  <td>{data.reason}</td>
                  <td>{new Date(data.from_date).toLocaleDateString()}</td>
                  <td>{data.from_time}</td>
                  <td>{data.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>
      )}
      {view === 'history' && (
        <div>
          <h2>Leave History</h2>
          <div className='table-container'>
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Leave Type</th>
                <th>Visiting Place</th>
                <th>Reason</th>
                <th>From Date</th>
                <th>From Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {leaveHistory.map((item, index) => (
                <tr key={index}>
                  <td>{item.id}</td>
                  <td>{item.leave_type}</td>
                  <td>{item.visiting_place}</td>
                  <td>{item.reason}</td>
                  <td>{new Date(item.from_date).toLocaleDateString()}</td>
                  <td>{item.from_time}</td>
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