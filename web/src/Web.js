import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { Mail, Eye, Lock, MessageCircle, X, Send } from 'lucide-react';
import 'react-toastify/dist/ReactToastify.css';
import './Web.css';


function Web() {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Chatbot State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { role: 'ai', text: 'שלום! איך אוכל לעזור לך היום?' }
  ]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const Response_Py = await axios.post('https://myserver-ckaceug6c8h2cqdy.israelcentral-01.azurewebsites.net/login', {
        email: email,
        password: password
      });
      //console.log("Response:", Response_Py.data);

      if (Response_Py.data.success === true) {
        //toast.success("Login successful!");
        const Response_node = await axios.get('http://localhost:5000/get-message');
        //console.log("Node Response:", Response_node.data)
        //toast.success(Response_node.data.toastMessage);
        
        toast.success(Response_node.data.toastMessage);

      } else {
        //false
        toast.error("Mail or the Password is not correct!");
      }

   } catch (error) {
      console.error("Error Details:", error.response?.data || error.message);
      
      const errorMessage = error.response?.data?.message || "Server Error (500)";
      toast.error(errorMessage);
      
    } finally {
      setIsLoading(false);
      console.log("finished.");
    }
  };

  //chatbot
  const handleChatSubmit = async (e) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    const newHistory = [...chatHistory, { role: 'user', text: chatMessage }];
    setChatHistory(newHistory);
    const currentMsg = chatMessage;
    setChatMessage('');

    try {
      const res = await axios.post('http://localhost:5001/chat', {
        message: currentMsg,
        history: chatHistory,
      });
      setChatHistory([...newHistory, { role: 'ai', text: res.data.reply }]);
    } catch (err) {
      toast.error("שגיאה בחיבור לצ'אט");
    }
  };

return (
  <div className="login-container">
    <div className="login-sidebar">
      <img src="./photo2.png" alt="Logo" className="logo-image" />
      <div className="illustration-wrapper">
        <div className="podium-circle"></div>
        <img src="/Photo.png" alt="illustration" className="sidebar-img" /></div>
      <h1>Welcome aboard my friend</h1>
      <p>just a couple of clicks and we start</p>
    </div>

    <div className="login-form-section">
      <div className="form-wrapper">
        <h2>Log in</h2>
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <Mail className="input-icon" size={18} />
            <input type="email" placeholder="Email" required value={email} 
            onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="input-group">
            <Lock className="input-icon" size={18} />
            <input type={show ? "text" : "password"} placeholder="Password" required value={password} 
            onChange={(e) => setPassword(e.target.value)} />
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

    {/*CHATBOT*/}
      <div className={`chat-wrapper ${isChatOpen ? 'open' : ''}`}>
        {isChatOpen ? (
          <div className="chat-window">
            <div className="chat-header">
              <span>תמיכה במשלוחים</span>
              <X onClick={() => setIsChatOpen(false)} className="close-chat" />
            </div>
            <div className="chat-body">
              {chatHistory.map((msg, i) => (
                <div key={i} className={`msg-bubble ${msg.role}`}>
                  {msg.text}
                </div>
              ))}
            </div>
            <form className="chat-footer" onSubmit={handleChatSubmit}>
              <input 
                value={chatMessage} 
                onChange={(e) => setChatMessage(e.target.value)} 
                placeholder="הקלד הודעה..." 
                dir="rtl"
              />
              <button type="submit"><Send size={18} /></button>
            </form>
          </div>
        ) : (
          <div className="chat-bubble" onClick={() => setIsChatOpen(true)}>
            <MessageCircle color="white" size={30} />
          </div>
        )}
      </div>
      

    <ToastContainer 
      position="top-right"
      autoClose={5000}
      hideProgressBar={true}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
    />
  </div>
);
}

export default Web;