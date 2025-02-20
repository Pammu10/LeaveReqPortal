import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';



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
      if (data.token  !== undefined) {
        localStorage.setItem('token', data.token);
        signIn(data.token);
        if (formData.email === 'hod@mycollege.com') {
          navigate('/leave-approval');
        }
        else {
          navigate('/leave-request');
        }
      }
      alert(data.message);
      
      
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="auth-container text-center">
      <h1 className='m-3'>{isLogin ? 'Login' : 'Register'}</h1>
      <form className='form' onSubmit={handleSubmit}>
        {!isLogin && (
          <>
            <div className="form-group m-2 p-2">
              <label>Registration Number : </label>
              <input type="text" name="registration_number" value={formData.registration_number} onChange={handleChange} required />
            </div>
            <div className="form- m-2 p-2">
              <label>Student Name : </label>
              <input type="text" name="student_name" value={formData.student_name} onChange={handleChange} required />
            </div>
            <div className="form-group m-2 p-2">
              <label>Student Year : </label>
              <input type="text" name="student_year" value={formData.student_year} onChange={handleChange} required />
            </div>
          </>
        )}
        <div className='form-group m-2 p-2'>
          <label>Email : </label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />
        </div>
        <div className="form-group m-2 p-2">
          <label>Password : </label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} required />
        </div>
        <button type="submit" className='btn btn-warning p-1'>{isLogin ? 'Login' : 'Register'}</button>
      </form>
      <button className='btn btn-warning p-1 m-2' onClick={() => setIsLogin(!isLogin)}>
        {isLogin ? 'Switch to Register' : 'Switch to Login'}
      </button>
    </div>
  );
};

export default Auth;