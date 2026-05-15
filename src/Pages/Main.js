import React, { useState } from 'react'
import './Styles/Main.css'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Accordion from 'react-bootstrap/Accordion';
import Dropdown from 'react-bootstrap/Dropdown';
import { useNavigate, Link } from 'react-router-dom';
import GlobalFooter2 from '../Components/Globalfooter2';

const API_BASE = import.meta.env.VITE_API_URL || '/api/v1';

const REASONS = [
  {
    icon: '📺',
    title: 'Enjoy on your TV',
    text:
      'Watch on Smart TVs, Playstation, Xbox, Chromecast, Apple TV, Blu-ray players, and more.',
  },
  {
    icon: '⬇️',
    title: 'Download your shows to watch offline',
    text: 'Save your favorites easily and always have something to watch.',
  },
  {
    icon: '📱',
    title: 'Watch everywhere',
    text: 'Stream unlimited movies and TV shows on your phone, tablet, laptop, and TV.',
  },
  {
    icon: '👨‍👩‍👧',
    title: 'Create profiles for kids',
    text:
      'Send kids on adventures with their favorite characters in a space made just for them — free with your membership.',
  },
];

export default function Main() {

  const[emailReq1,setEmailReq1]=useState(false);
  const[emailReq2,setEmailReq2]=useState(false);
  const [borderColor, setBorderColor] = useState('');
  const [borderColor2, setBorderColor2] = useState('');
  const navigate=useNavigate();

  function showEmailReq1(){
    setEmailReq1(true);
    setBorderColor('red');
  }
  function showEmailReq2(){
    setEmailReq2(true);
    setBorderColor2('red');
  }
  function hideEmailReq1(){
    setEmailReq1(false);
    setBorderColor('');
  }
  function hideEmailReq2(){
    setEmailReq2(false);
    setBorderColor2('');
  }
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function getStartedHero() {
    const raw = document.getElementById('userEmailInput')?.value?.trim() ?? '';
    hideEmailReq1();
    if (!raw) {
      showEmailReq1();
      return;
    }
    if (!emailPattern.test(raw)) {
      showEmailReq1();
      return;
    }
    submitEmailFlow(raw);
  }

  function getStartedFaq() {
    const raw = document.getElementById('userEmailInput2')?.value?.trim() ?? '';
    hideEmailReq2();
    if (!raw) {
      showEmailReq2();
      return;
    }
    if (!emailPattern.test(raw)) {
      showEmailReq2();
      return;
    }
    submitEmailFlow(raw);
  }

  function submitEmailFlow(email) {
    verifyEmailExists(email)
      .then((exists) => {
        if (exists) {
          navigate('/login', { state: { email } });
        } else {
          navigate('/registration', { state: { email } });
        }
      })
      .catch(() => {
        navigate('/registration', { state: { email } });
      });
  }

  /** Returns true if the email is already registered (user should sign in). */
  function verifyEmailExists(email) {
    return fetch(
      `${API_BASE}/auth/verify-email/${encodeURIComponent(email)}`,
    )
      .then((response) => {
        if (!response.ok) throw new Error('verify failed');
        return response.json();
      })
      .then((data) => data.exists === true);
  }

  return (
    <div>
      <section className="hero-page-shell" aria-label="Hero">
        <div className="home-main-hero" aria-hidden />
        <div className="home-main-shadow" aria-hidden />
        <div className="home-main-container">
            <div className="hero-masterhead">
            <Link to="/" aria-label="Netflix home">
              <img className="brand-logo" src="/Assets/Netflix-brand.png" alt="Netflix" />
            </Link>
            <div className="hero-masterhead-actions">
              <Dropdown align="end">
                <Dropdown.Toggle
                  variant="outline-secondary"
                  id="dropdown-language-hero"
                  className="nf-lang-toggle"
                >
                  <i className="bi bi-globe" aria-hidden />
                  <span className="nf-lang-label">English</span>
                  <i className="bi bi-caret-down-fill nf-lang-caret" aria-hidden />
                </Dropdown.Toggle>
                <Dropdown.Menu variant="dark">
                  <Dropdown.Item active eventKey="en">
                    English
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
              <Button as={Link} to="/login" className="text-light fw-bold btn-sign-in-nav" variant="danger">
                Sign In
              </Button>
            </div>
          </div>
          <h1>Unlimited movies, TV shows, and more</h1>
          <p className="hero-subtitle">Starts at $8.99. Cancel anytime.</p>
          <p className="hero-cta-line">Ready to watch? Enter your email to create or restart your membership.</p>
          <div className="form-container">
            <Form className='email-input-container'>
              <Form.Control id="userEmailInput" className='email-input py-3' type="email" placeholder="Email address" autoComplete="email" aria-label="Email address" style={{ borderColor: borderColor }}/>
            </Form>
            <Button onClick={getStartedHero} className='text-light fw-bold btn-1' variant="danger">Get Started&nbsp; <i className="bi bi-chevron-right" aria-hidden /></Button>
          </div>
          {emailReq1 && <div className="profile-name-validate profile-name-notvalidate email-required"><i className="bi bi-x-circle-fill" aria-hidden /> Please enter a valid email.</div> }
        </div>
      </section>

      <section className="plan-banner-outer" aria-label="Plans and pricing">
        <div className="plan-banner-card">
          <span className="plan-banner-emoji" aria-hidden>🍿</span>
          <div className="plan-banner-text">
            <strong>The Netflix you love for just $8.99.</strong>
            <span>Get our most affordable, ad-supported plan.</span>
          </div>
          <Button type="button" className="btn-learn-more" variant="outline-light">
            Learn More
          </Button>
        </div>
      </section>

      <section className="reasons-section" aria-labelledby="reasons-heading">
        <div className="reasons-inner">
          <h2 id="reasons-heading" className="reasons-heading">More Reasons to Join</h2>
          <div className="reasons-grid">
            {REASONS.map((item) => (
              <article key={item.title} className="reason-card">
                <div className="reason-card-icon" aria-hidden>{item.icon}</div>
                <h3 className="reason-card-title">{item.title}</h3>
                <p className="reason-card-text">{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <div className="home-section5">
        <h2 className="faq-page-heading">Frequently Asked Questions</h2>
        <Accordion className='faq'>
          <Accordion.Item className='faq-item' eventKey="0">
          <Accordion.Header className='faq-head'>What is Netflix?<img className="plus" src="/Assets/plus.png" alt="" /></Accordion.Header>
          <Accordion.Body className='faq-body'>
            Netflix is a streaming service that offers a wide variety of award-winning TV shows, movies, anime, documentaries, and more on thousands of internet-connected devices.
            <br></br><br></br>
            You can watch as much as you want, whenever you want without a single commercial - all for one low monthly price. There's always something new to discover and new TV shows and movies are added every week!
          </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item className='faq-item' eventKey="1">
          <Accordion.Header>How much does Netflix cost?<img className="plus" src="/Assets/plus.png" alt="" /></Accordion.Header>
          <Accordion.Body className='faq-body'>
            Watch Netflix on your smartphone, tablet, Smart TV, laptop, or streaming device, all for one fixed monthly fee. Plans range from USD 2.99 to USD 9.99 a month. No extra costs, no contracts.
          </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item className='faq-item' eventKey="2">
          <Accordion.Header>Where can I watch?<img className="plus" src="/Assets/plus.png" alt="" /></Accordion.Header>
          <Accordion.Body className='faq-body'>
            Watch anywhere, anytime. Sign in with your Netflix account to watch instantly on the web at netflix.com from your personal computer or on any internet-connected device that offers the Netflix app, including smart TVs, smartphones, tablets, streaming media players and game consoles.
            <br></br><br></br>
            You can also download your favorite shows with the iOS or Android app. Use downloads to watch while you're on the go and without an internet connection. Take Netflix with you anywhere.
          </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item className='faq-item' eventKey="3">
          <Accordion.Header>How do I cancel?<img className="plus" src="/Assets/plus.png" alt="" /></Accordion.Header>
          <Accordion.Body className='faq-body'>
            Netflix is flexible. There are no pesky contracts and no commitments. You can easily cancel your account online in two clicks. There are no cancellation fees - start or stop your account anytime.
          </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item className='faq-item' eventKey="4">
          <Accordion.Header>What can I watch on Netflix?<img className="plus" src="/Assets/plus.png" alt="" /></Accordion.Header>
          <Accordion.Body className='faq-body'>
            Netflix has an extensive library of feature films, documentaries, TV shows, anime, award-winning Netflix originals, and more. Watch as much as you want, anytime you want.
          </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item className='faq-item' eventKey="5">
          <Accordion.Header>Is Netflix good for kids?<img className="plus" src="/Assets/plus.png" alt="" /></Accordion.Header>
          <Accordion.Body className='faq-body'>
            The Netflix Kids experience is included in your membership to give parents control while kids enjoy family-friendly TV shows and movies in their own space.
            <br></br><br></br>
            Kids profiles come with PIN-protected parental controls that let you restrict the maturity rating of content kids can watch and block specific titles you don't want kids to see.
          </Accordion.Body>
          </Accordion.Item>
        </Accordion>

        <div className="bottom-cta">
          <p className="bottom-cta-text">Ready to watch? Enter your email to create or restart your membership.</p>
          <div className="form-container2">
            <Form className='email-input-container'>
              <Form.Control id="userEmailInput2" className='email-input py-3' type="email" placeholder="Email address" autoComplete="email" aria-label="Email address" style={{ borderColor: borderColor2 }}/>
            </Form>
            <Button onClick={getStartedFaq} className='text-light fw-bold btn-2 btn-3' variant="danger">Get Started&nbsp; <i className="bi bi-chevron-right" aria-hidden /></Button>
          </div>
          {emailReq2 && <div className="profile-name-validate profile-name-notvalidate email-required2"><i className="bi bi-x-circle-fill" aria-hidden /> Please enter a valid email.</div> }
        </div>
      </div> 
      <GlobalFooter2/>
    </div>
  )
}
