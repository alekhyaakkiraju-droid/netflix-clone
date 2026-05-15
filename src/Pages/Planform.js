import React, { useState } from 'react';
import './Styles/Main.css';
import './Styles/Planform.css'
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Globalfooter from '../Components/Globalfooter'
import PlanCard from '../Components/PlanCard'
import Button from 'react-bootstrap/Button';
import PlanCard2 from '../Components/PlanCard2'


export default function Planform() {
  
  const navigate = useNavigate();
  const location = useLocation();
  const {email} = location.state || {};
  const [selectedCard, setSelectedCard] = useState('Premium');

  const handleSelect = (title1) => {
    setSelectedCard(title1);
  };

  const packageSelected = () => {
    let packagePrice;
    if(selectedCard=='Premium')
      packagePrice=9.99;
    else if(selectedCard=='Standerd')
      packagePrice=7.99;
    else if(selectedCard=='Basic')
      packagePrice=3.99;
    else if(selectedCard=='Mobile')
      packagePrice=2.99;
    navigate('/signup/paymentPicker', { state: {selectedCard,packagePrice,email} });
  };

  return (
    <div className="planform-container">
      <div className="planform-inner">
        <Link to="/signup/logout" className="nf-signout-link planform-signout">
          Sign Out
        </Link>
        <header className="nf-auth-top planform-logo-bar">
          <Link to="/" aria-label="Netflix home">
            <img className="brand-logo" src="/Assets/Netflix-brand.png" alt="Netflix" height={45} />
          </Link>
        </header>
        <div className="body-container2-1">
          <p className="nf-step-label planform-step">STEP 1 OF 3</p>
          <h2 className="planform-heading">Choose the plan that&apos;s right for you</h2>
        </div>
        <div className="body-container2-2">
          <PlanCard title1='Premium' isSelected={selectedCard === 'Premium'} onSelect={() => handleSelect('Premium')} gradient="linear-gradient(to top left, #eb0018, #333e99)"/>
          <PlanCard2 title1='Standard' title2='1080p' v1='USD 7.99' v4='TV, computer, mobile phone, tablet' v3='1080p (Full HD)' v2='Great' v5='2' v6='2' isSelected={selectedCard === 'Standerd'} onSelect={() => handleSelect('Standerd')} gradient="linear-gradient(to top left, #a339d5, #333e99)"/>
          <PlanCard2 title1='Basic' title2='720p' v1='USD 3.99' v4='TV, computer, mobile phone, tablet' v3='720p (HD)' v2='Good' v5='1' v6='1' isSelected={selectedCard === 'Basic'} onSelect={() => handleSelect('Basic')} gradient="linear-gradient(to top left, #653cd9, #333e99)"/>
          <PlanCard2 title1='Mobile' title2='480p' v1='USD 2.99' v4='Mobile phone, tablet' v3='480p' v2='Fair' v5='1' v6='1' isSelected={selectedCard === 'Mobile'} onSelect={() => handleSelect('Mobile')} gradient="linear-gradient(to top left, #226ddc, #333e99)"/>
        </div>
        <div className="body-container2-3 planform-cta-block">
          <p className="planform-info">HD (720p), Full HD (1080p), Ultra HD (4K) and HDR availability subject to your internet service and device capabilities. Not all content is available in all resolutions. <span className='terms-of-use-text'>See our Terms</span> of Use for more details.
          Only people who live with you may use your account. Watch on 4 different devices at the same time with Premium, 2 with Standard, and 1 with Basic and Mobile.</p>
          <Button variant="danger" onClick={packageSelected} className="btn-5 planform-next-btn" type="button">
            Next
          </Button>
        </div>
      </div>
      <Globalfooter/>
    </div>
  )
}
