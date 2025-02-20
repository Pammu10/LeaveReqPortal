import React, { useContext, useEffect, useState } from 'react';
import './global.css';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';



const Auth = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    registration_number: '',
    student_name: '',
    student_year: '',
    email: '',
    password: ''
  });
  const { signIn } = useContext(AuthContext);

    useEffect(() => {
      const token = localStorage.getItem('token');
      if (token) {
        const user = JSON.parse(atob(token.split('.')[1]));
        console.log(user)
        if (user.studentId === 'A') {
          navigate('/leave-approval');
        } else {
          navigate('/leave-request');
        }
      }
    }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = isLogin ? 'http://localhost:5000/login' : 'http://localhost:5000/register';
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (data.token){
        localStorage.setItem('token', data.token);
      }
      signIn(data.token);

      alert(data.message);
      if (formData.email === 'hod@mycollege.com') {
        navigate('/leave-approval');
      }
      else {
        navigate('/leave-request');
      }
      
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="auth-container">
      <h2>{isLogin ? 'Login' : 'Register'}</h2>
      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <>
            <div className="form-group">
              <label>Registration Number</label>
              <input type="text" name="registration_number" value={formData.registration_number} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Student Name</label>
              <input type="text" name="student_name" value={formData.student_name} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Student Year</label>
              <input type="text" name="student_year" value={formData.student_year} onChange={handleChange} required />
            </div>
          </>
        )}
        <div className="form-group">
          <label>Email</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} required />
        </div>
        <button type="submit">{isLogin ? 'Login' : 'Register'}</button>
      </form>
      <button onClick={() => setIsLogin(!isLogin)}>
        {isLogin ? 'Switch to Register' : 'Switch to Login'}
      </button>
    </div>
  );
};

export default Auth;