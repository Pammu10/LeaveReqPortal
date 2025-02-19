import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './global.css';

const Header = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('User');
  const token = localStorage.getItem('token');
  const user = token ? JSON.parse(atob(token.split('.')[1])) : null;

  const handleSignOut = () => {
    localStorage.removeItem('token');
    navigate('/');
  };
  const getUser = async() => {
    try {
        const response = await fetch('http://localhost:5000/get-user', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }
        );
        if (response.ok){
            const data = await response.json();
            setUserName(data.student_name);
        }
        else {
            console.error('Network response was not ok');
        }
    }
     catch(err){
        console.error('Error fetching user data:', err);
     }
  }


  useEffect(() => {
    getUser();
  }, [token]);


  return (
    <div className="header">
      {user && <span className="user-name">Welcome, {userName}</span>}
      <button className="sign-out" onClick={handleSignOut}>Sign Out</button>
    </div>
  );
};

export default Header;