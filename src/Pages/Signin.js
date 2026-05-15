import { useLocation } from 'react-router-dom';
import './Styles/Main.css';
import './Styles/Signin.css';
import Signin_component from '../Components/Signin_component';

/** Legacy `/signin` route */
export default function Signin() {
  const location = useLocation();
  const { email } = location.state || {};

  return (
    <div className="nf-auth-shell signin-legacy-wrap">
      <div className="signin-legacy-inner">
        <Signin_component email={email} />
      </div>
    </div>
  );
}
