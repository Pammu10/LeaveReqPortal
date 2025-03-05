import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GAuth from './GAuth';

const Auth = () => {
  const navigate = useNavigate();


    useEffect(() => {
      const token = localStorage.getItem('token');
      if (token) {
        const user = JSON.parse(atob(token.split('.')[1]));
        if (user.role === 0) {
          navigate('/leave-approval');
        } else {
          navigate('/leave-request');
        }
      }
    }, [navigate]);

  

  return (
    <>
      <div className="container d-flex flex-column justify-content-center align-items-center" style={{ minHeight: '100vh', maxWidth: '100%'}}>
        <div>Leave Applcication Sign in Page</div>
        <div className='btn mt-2'><GAuth/></div> 
      </div>
      
    </>

  );
};

export default Auth;