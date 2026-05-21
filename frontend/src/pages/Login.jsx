import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, GithubAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBl-bM40nxZdQMYUd3Z1x7E6mz29h0rR4U",
  authDomain: "campuslink-92e32.firebaseapp.com",
  projectId: "campuslink-92e32",
  storageBucket: "campuslink-92e32.firebasestorage.app",
  messagingSenderId: "954078668028",
  appId: "1:954078668028:web:6ee4fb8e59e52f96dea379",
  measurementId: "G-MLFHTHYQ7E"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

export default function Login() {
  const [selectedRole, setSelectedRole] = useState("student");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    try {
      await login(selectedRole, { email, password });
    } catch (error) {
      alert(error.message);
    }
  };

  const handleSocialLogin = async (provider) => {
    try {
      const result = await signInWithPopup(auth, provider);
      const token = await result.user.getIdToken();

      const response = await fetch('/api/auth/firebase-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, role: selectedRole })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('userType', selectedRole);
        localStorage.setItem(`${selectedRole}Id`, data.id);

        if (selectedRole === 'student') window.location.href = '/student-dashboard';
        else if (selectedRole === 'company') window.location.href = '/company';
        else window.location.href = '/admin';
      } else {
        alert('Login failed: ' + data.error);
      }
    } catch (error) {
      alert('Authentication Error: ' + error.message);
    }
  };

  return (
    <div className="login-page">
      <div className="login-box">
        <h2 className="login-title">Welcome Back</h2>
        <p className="login-subtitle">Sign in to continue to your CampusLink dashboard</p>

        <div className="role-toggle">
          <button className={selectedRole === "student" ? "active" : ""} onClick={() => setSelectedRole("student")}>Student</button>
          <button className={selectedRole === "company" ? "active" : ""} onClick={() => setSelectedRole("company")}>Company</button>
          <button className={selectedRole === "admin" ? "active" : ""} onClick={() => setSelectedRole("admin")}>Admin</button>
        </div>

        <input id="email" type="email" placeholder="Enter your email" />
        <input id="password" type="password" placeholder="Enter your password" />

        <button className="btn-primary login-btn" onClick={handleLogin} style={{ width: "100%", marginBottom: "15px" }}>
          Login
        </button>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {/* Google Login */}
          <button
            className="btn-outline social-btn"
            onClick={() => handleSocialLogin(googleProvider)}
            style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", padding: "10px", backgroundColor: "#fff", border: "1px solid #dee2e6", borderRadius: "4px", cursor: "pointer" }}
          >
            <img src="https://fonts.gstatic.com/s/i/productlogos/googleg/v6/24px.svg" alt="Google" style={{ width: "18px" }} />
            Sign in with Google
          </button>

          {/* GitHub Login */}
          <button
            className="btn-outline social-btn"
            onClick={() => handleSocialLogin(githubProvider)}
            style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", padding: "10px", backgroundColor: "#24292e", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }}
          >
            <img src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" alt="GitHub" style={{ width: "20px", filter: "invert(1)" }} />
            Sign in with GitHub
          </button>
        </div>

        <p className="login-register" style={{ marginTop: "20px" }}>
          Don’t have an account? <Link to="/register">Create one</Link>
        </p>
      </div>
    </div>
  );
}