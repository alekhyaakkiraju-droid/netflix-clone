import './App.css';
import Main from './Pages/Main';
import Signup from './Pages/Signin';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Planform from './Pages/Planform';
import PaymentPicker from './Pages/PaymentPicker';
import Login from './Pages/Login';
import ScrollTop from './Pages/ScrollTop';
import Registration from './Pages/Registration';
import Regform from './Pages/Signup';
import Planwelcome from './Pages/Planwelcome';
import PaymentGateway from './Pages/PaymentGateway';
import Logout from './Pages/Logout';
import Browse from './Pages/Browse';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <ScrollTop/>
        <Routes>
          <Route path='/' element={<Main/>}></Route>
          <Route path='/signin' element={<Signup/>}></Route>
          <Route path='/signup/planform' element={<Planform/>}></Route>
          <Route path='/signup/paymentPicker' element={<PaymentPicker/>}></Route>
          <Route path='/signup/pay' element={<PaymentGateway/>}></Route>          
          <Route path='/login' element={<Login/>}></Route>
          <Route path='/registration' element={<Registration/>}></Route>
          <Route path='/signup' element={<Regform/>}></Route>
          <Route path='/signup/plan' element={<Planwelcome/>}></Route>
          <Route path='/signup/logout' element={<Logout/>}></Route>
          <Route path='/browse' element={<Browse/>}></Route>         
        </Routes>
      </BrowserRouter>    
    </div>
  );
}

export default App;
