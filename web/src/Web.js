import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { Mail, Eye, Lock } from 'lucide-react';
import 'react-toastify/dist/ReactToastify.css';
import './Web.css';

function Web() {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const Response_Py = await axios.post(myserver-ckaceug6c8h2cqdy.israelcentral-01.azurewebsites.net/login, {
        email: email,
        password: password
      });

      if (Respons_Py.data.success === true) {
        
        const Response_node = await axios.get('http://localhost:5000/get-message');
        
        toast.success(Response_node.data.toastMessage, {
          position: "top-right",
          autoClose: 5000,
        });

      } else {
        //false
        toast.error("Mail or the Password is not correct!");
      }

    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };
return (
  <div className="login-container">
    <div className="login-sidebar">
      <div className="logo-placeholder">S</div>
      <img src="URL_OF_YOUR_IMAGE" alt="illustration" className="sidebar-img" />
      <h1>Welcome aboard my friend</h1>
      <p>just a couple of clicks and we start</p>
    </div>

    <div className="login-form-section">
      <div className="form-wrapper">
        <h2>Log in</h2>
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <Mail className="input-icon" size={18} />
            <input type="email" placeholder="Email" required />
          </div>
          <div className="input-group">
            <Lock className="input-icon" size={18} />
            <input type={show ? "text" : "password"} placeholder="Password"/>
            <Eye className="eye-icon" onClick={() => setShow(!show)} />
          </div>
          <a href="#" className="forgot-password">Forgot password?</a>
          <button type="submit" className="login-btn">Log in</button>
        </form>
        <div className="divider">Or</div>
        <div className="social-buttons">
  <button className="social-btn">
    <img 
      src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" 
      alt="Google" 
      style={{ width: '18px' }} 
    /> 
    Google
  </button>
  
  <button className="social-btn">
    <img 
      src="https://upload.wikimedia.org/wikipedia/commons/b/b8/2021_Facebook_icon.svg" 
      alt="Facebook" 
      style={{ width: '18px' }} 
    /> 
    Facebook
  </button>
</div>
        <p className="footer-text">Have no account yet?</p>
        <button className="register-btn-flat">Register</button>
      </div>
    </div>
  </div>
);
}

export default Web;