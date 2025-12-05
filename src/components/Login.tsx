import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { authAPI } from '../services/api';
import './Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
    if (token) {
      // User is already logged in, redirect to movies list
      navigate('/movies', { replace: true });
    }
  }, [navigate]);

  // Check if form is valid
  const isFormValid = () => {
    if (!email || !email.trim()) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) return false;
    if (!password || password.length < 6) return false;
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Frontend validation
    if (!email || !email.trim()) {
      setError('Email is required');
      setLoading(false);
      return;
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      const loginCredentials = { email: email.trim(), password };

      const response = await authAPI.login(loginCredentials);
      
      // Store token based on rememberMe
      if (rememberMe) {
        localStorage.setItem('accessToken', response.accessToken);
        localStorage.setItem('user', JSON.stringify(response.user));
      } else {
        sessionStorage.setItem('accessToken', response.accessToken);
        sessionStorage.setItem('user', JSON.stringify(response.user));
      }

      // Show success toast
      toast.success('Login successful!');

      // Redirect to movies list page
      navigate('/movies');
    } catch (err: unknown) {
      // Extract error message from different response formats
      let errorMessage = 'Login failed. Please check your credentials.';
      
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as { response?: { data?: { message?: string | string[]; error?: string } } };
        if (axiosError.response?.data) {
          // Handle standard error format: { success: false, message: "...", ... }
          if (axiosError.response.data.message) {
            errorMessage = Array.isArray(axiosError.response.data.message) 
              ? axiosError.response.data.message[0] 
              : axiosError.response.data.message;
          } else if (axiosError.response.data.error) {
            errorMessage = axiosError.response.data.error;
          }
        }
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      
      // Set error state for inline display
      setError(errorMessage);
      
      // Show error toast notification
      toast.error(errorMessage);
      
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form className="sign-in-box" onSubmit={handleSubmit}>
        <h1 className="sign-in-title">Sign in</h1>
        
        <div className="input-group">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="login-input"
            required
          />
        </div>
        
        <div className="input-group">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="login-input"
            required
          />
        </div>
        
        {error && (
          <div className="error-message" style={{ color: 'red', marginBottom: '10px' }}>
            {error}
          </div>
        )}

        <div className="remember-me-group">
          <input
            type="checkbox"
            id="remember-me"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="remember-me-checkbox"
          />
          <label htmlFor="remember-me" className="remember-me-label">
            Remember me
          </label>
        </div>
        
        <button type="submit" className="login-button" disabled={loading || !isFormValid()}>
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <div style={{ marginTop: '1rem', textAlign: 'center' }}>
          <span style={{ color: 'white' }}>Don't have an account? </span>
          <Link to="/register" style={{ color: '#4caf50', textDecoration: 'none' }}>
            Sign up
          </Link>
        </div>
      </form>
    </div>
  );
}

export default Login;

