import React, { useState } from 'react';
import './Styles/Main.css';
import './Styles/Signup.css';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

/** Legacy `/signup` route — older flow; prefer `/registration` for new users. */
export default function Signup() {
  const [borderColor, setBorderColor] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const { email } = location.state || {};
  const [showPassword, setShowPassword] = useState(true);
  const [hidePassword, setHidePassword] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  function visiblePassword() {
    setHidePassword(true);
    setPasswordVisible(true);
    setShowPassword(false);
  }

  function nonVisiblePassword() {
    setShowPassword(true);
    setPasswordVisible(false);
    setHidePassword(false);
  }

  function userRegister() {
    const userInput = document.getElementById('userPasswordInput')?.value ?? '';
    if (userInput === '') {
      setBorderColor('red');
    } else {
      addUser(email, userInput);
      createProfile(email);
      navigate('/signup/plan', { state: { email } });
    }
  }

  function addUser(emailAddr, password) {
    fetch(`http://localhost:8080/api/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: emailAddr,
        password,
      }),
    });
  }

  function createProfile(emailAddr) {
    fetch(`http://localhost:8080/api/profile/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: emailAddr,
        profilePicture: 'icon i1',
      }),
    });
  }

  return (
    <div className="nf-auth-shell signup-legacy-page">
      <Link to="/signup/logout" className="nf-signout-link signup-signout">
        Sign Out
      </Link>
      <header className="nf-auth-top">
        <Link to="/" aria-label="Netflix home">
          <img className="brand-logo" src="/Assets/Netflix-brand.png" alt="Netflix" />
        </Link>
      </header>
      <div className="nf-auth-card-outer">
        <div className="nf-auth-card signup-legacy-card">
          <p className="nf-step-label">Step 1 of 3</p>
          <h1 className="nf-flow-title">Create a password to start your membership</h1>
          <p className="signup-legacy-hint">Just a few more steps and you&apos;re done. We hate paperwork, too.</p>

          <Form className="signup-legacy-form">
            <div className="nf-field-wrap">
              <input
                id="legacy-email"
                name="email"
                type="email"
                className="nf-float-input"
                placeholder=" "
                defaultValue={email}
                readOnly
                autoComplete="email"
              />
              <label className="nf-float-label" htmlFor="legacy-email">
                Email
              </label>
            </div>
            <div className="nf-field-wrap signup-password-row">
              <input
                id="userPasswordInput"
                type={passwordVisible ? 'text' : 'password'}
                className="nf-float-input"
                placeholder=" "
                style={{ borderColor: borderColor || undefined }}
                autoComplete="new-password"
              />
              <label className="nf-float-label" htmlFor="userPasswordInput">
                Add a password
              </label>
              <button
                type="button"
                className="signup-toggle-vis"
                aria-label={passwordVisible ? 'Hide password' : 'Show password'}
                onClick={passwordVisible ? nonVisiblePassword : visiblePassword}
              >
                {passwordVisible ? 'Hide' : 'Show'}
              </button>
            </div>

            <div className="signup-offers">
              <Form.Check
                className="signup-offers-check"
                aria-label="Do not email special offers"
                label="Please do not email me Netflix special offers."
              />
            </div>

            <Button type="button" onClick={userRegister} className="btn nf-btn-primary signup-next">
              Next
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
}
