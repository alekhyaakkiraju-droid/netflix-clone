import React from 'react'
import Dropdown from 'react-bootstrap/Dropdown'
import './Styles/Globalfooter2.css'

export default function GlobalFooter2() {
  return (
    <footer className="nf-footer">
      <div className="nf-footer-inner">
        <a className="nf-footer-phone" href="tel:1-866-952-4456">
          Questions? Call 1-866-952-4456
        </a>

        <nav className="nf-footer-grid" aria-label="Footer">
          <ul className="nf-footer-col">
            <li><a href="#">FAQ</a></li>
            <li><a href="#">Media Center</a></li>
            <li><a href="#">Investor Relations</a></li>
            <li><a href="#">Jobs</a></li>
            <li><a href="#">Reed Hastings</a></li>
          </ul>
          <ul className="nf-footer-col">
            <li><a href="#">Help Center</a></li>
            <li><a href="#">Buy Gift Cards</a></li>
            <li><a href="#">Cookie Preferences</a></li>
            <li><a href="#">Legal Notices</a></li>
          </ul>
          <ul className="nf-footer-col">
            <li><a href="#">Account</a></li>
            <li><a href="#">Ways to Watch</a></li>
            <li><a href="#">Corporate Information</a></li>
            <li><a href="#">Only on Netflix</a></li>
          </ul>
          <ul className="nf-footer-col">
            <li><a href="#">Terms of Use</a></li>
            <li><a href="#">Contact Us</a></li>
            <li><a href="#">Do Not Sell or Share My Personal Information</a></li>
            <li><a href="#">Ad Choices</a></li>
          </ul>
        </nav>

        <div className="nf-footer-lang">
          <Dropdown align="start">
            <Dropdown.Toggle
              variant="outline-secondary"
              id="dropdown-language-footer"
              className="nf-lang-toggle nf-lang-toggle--footer"
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
        </div>

        <p className="nf-footer-copy">Netflix 2025</p>

        <p className="nf-footer-recaptcha">
          This page is protected by Google reCAPTCHA to ensure you&apos;re not a bot.
        </p>
      </div>
    </footer>
  )
}
