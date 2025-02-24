import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';

const Auth = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
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
    const url = isLogin ? 'https://leavereqbackend.railway.internal/login' : 'https://leavereqbackend.railway.internal/register';
    try {
      setLoading(true);
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      setLoading(false);
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
    <>
      <div className="container d-flex flex-column justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        
      <div className="row align-items-center mb-3">
        <h1 className='col-sm text-center'>{isLogin ? 'Login' : 'Register'}</h1>
      </div>
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <form className='form row' onSubmit={handleSubmit}>
            {!isLogin && (
              <>
                <div className="form-group row align-items-center mb-3">
                  <label className='col-sm-6 text-right'>Registration Number:</label>
                  <div className='col-sm-6'>
                    <input className='form-control' type="text" name="registration_number" value={formData.registration_number} onChange={handleChange} required />
                  </div>
                </div>
                <div className="form-group row align-items-center mb-3">
                  <label className='col-sm-6 text-right'>Student Name:</label>
                  <div className='col-sm-6'>
                    <input className='form-control' type="text" name="student_name" value={formData.student_name} onChange={handleChange} required />
                  </div>
                </div>
                <div className="form-group row align-items-center mb-3">
                  <label className='col-sm-6 text-right'>Student Year:</label>
                  <div className='col-sm-6'>
                    <input className='form-control' type="text" name="student_year" value={formData.student_year} onChange={handleChange} required />
                  </div>
                </div>
              </>
            )}
            <div className='form-group row align-items-center mb-3'>
              <label className='col-sm-6 text-right'>Email:</label>
              <div className='col-sm-6'>
                <input className='form-control' type="email" name="email" value={formData.email} onChange={handleChange} required />
              </div>
            </div>
            <div className="form-group row align-items-center mb-3">
              <label className='col-sm-6 text-right'>Password:</label>
              <div className='col-sm-6'>
                <input className='form-control' type="password" name="password" value={formData.password} onChange={handleChange} required />
              </div>
            </div>
            <div className="form-group row">
              <div className='col-sm-12 text-center'>
                <button type="submit" className='btn btn-warning mt-2'>
                  {loading && <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>}
                  {isLogin ? 'Login' : 'Register'}
                </button>
              </div>
            </div>
          </form> 
          <div className="text-center">
            <button className='btn btn-warning mt-2' onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? 'Switch to Register' : 'Switch to Login'}
            </button>
          </div>          
        </div>
        
      </div>
      </div>
    </>

  );
};

export default Auth;