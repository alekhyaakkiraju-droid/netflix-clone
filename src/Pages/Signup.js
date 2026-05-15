import React, { useState } from 'react';
import './Styles/Main.css';
import './Styles/Signup.css';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { authService } from '../services/authService';
import api, { ApiError } from '../services/apiClient';

/** `/signup` — email + password; prefers email from Main/registration via route state. */
export default function Signup() {
  const [borderColor, setBorderColor] = useState('');
  const [errorText, setErrorText] = useState('');
  const [submitting, setSubmitting] = useState(false);
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

  async function userRegister() {
    setErrorText('');
    const userInput = document.getElementById('userPasswordInput')?.value ?? '';
    const emailInput =
      document.getElementById('legacy-email')?.value?.trim() || email?.trim() || '';

    if (!emailInput) {
      setBorderColor('red');
      setErrorText('Email is required. Go back to the home page and enter your email.');
      return;
    }
    if (userInput === '') {
      setBorderColor('red');
      setErrorText('Please enter a password.');
      return;
    }

    setSubmitting(true);
    setBorderColor('');
    try {
      const result = await authService.register(emailInput, userInput);
      localStorage.setItem('accessToken', result.accessToken);
      localStorage.setItem('refreshToken', result.refreshToken);
      await api.post('/profiles', { profileName: 'Profile 1' }, true);
      navigate('/signup/plan', { state: { email: emailInput } });
    } catch (e) {
      const message =
        e instanceof ApiError
          ? e.message
          : e instanceof Error
            ? e.message
            : 'Registration failed. Please try again.';
      setErrorText(message);
      setBorderColor('red');
    } finally {
      setSubmitting(false);
    }
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
          <p className="signup-legacy-hint">
            Just a few more steps and you&apos;re done. We hate paperwork, too.
          </p>
          <p className="signup-legacy-hint" style={{ fontSize: '0.85rem', opacity: 0.9 }}>
            Password must be at least 8 characters and include an uppercase letter and a number.
          </p>

          <Form className="signup-legacy-form">
            {errorText && (
              <div className="profile-name-validate profile-name-notvalidate signup-reg-error" role="alert">
                {errorText}
              </div>
            )}
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

            <Button
              type="button"
              onClick={userRegister}
              className="btn nf-btn-primary signup-next"
              disabled={submitting}
            >
              {submitting ? '…' : 'Next'}
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
}
