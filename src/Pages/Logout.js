import React from 'react'
import './Styles/Logout.css'
import Button from 'react-bootstrap/Button';
import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Logout() {

    const navigate = useNavigate();
    const { logout } = useAuth();

    function goHome() {
      navigate(`/`);
    }

    useEffect(() => {
        logout();
        const timer = setTimeout(goHome, 15000); 
        return () => clearTimeout(timer); 
    }, [logout]);

  return (
    <div>
        <div className="home-main-container logout-container">
          <div className="hero-masterhead">
            <img className='brand-logo' src='/Assets/Netflix-brand.png' alt="Netflix" height={45} />
            <Link to="/login" className="btn btn-2 logout-signin-link">Sign In</Link>
          </div>
          <div className="inner-box-error">
            <div className="text-box-error">
                <h3 className='logout-text-head'>Leaving So Soon?</h3><br></br>
                <p className='logout-text'>Just so you know, you don&apos;t always need to sign out of Netflix. It&apos;s only necessary if you&apos;re on a shared or public computer. </p>
                <p className='logout-text'>You&apos;ll be redirected to the home page in 15 seconds.</p><br></br>
                <Button onClick={goHome} variant="danger" className='gonow-btn'>Go Now</Button>
            </div>
          </div> 
          <div className="home-footer2 footer-logout">
            <h6>© 2026 NetflixForged. All rights reserved.</h6> 
            <h7>This is a demo project and is not affiliated with or endorsed by Netflix. All content, logos, and trademarks are property of their respective owners.</h7>
          </div>
        </div>
    </div>
  )
}
