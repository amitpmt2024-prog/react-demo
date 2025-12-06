import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { authAPI } from '../services/api';
import './Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // Check if user previously logged in with "Remember me" (token in localStorage)
  const [rememberMe, setRememberMe] = useState(() => {
    return !!localStorage.getItem('accessToken');
  });
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
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

  // Validate email field
  const validateEmail = (emailValue: string): string => {
    if (!emailValue || !emailValue.trim()) {
      return 'Email is required';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailValue.trim())) {
      return 'Please enter a valid email';
    }
    return '';
  };

  // Validate password field
  const validatePassword = (passwordValue: string): string => {
    if (!passwordValue || !passwordValue.trim()) {
      return 'Password is required';
    }
    if (passwordValue.length < 6 || !/[a-zA-Z]/.test(passwordValue)) {
      return 'Password should contain at least 6 characters and 1 alphabetical character';
    }
    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setEmailError('');
    setPasswordError('');
    setLoading(true);

    // Validate all fields
    const emailValidationError = validateEmail(email);
    const passwordValidationError = validatePassword(password);

    if (emailValidationError) {
      setEmailError(emailValidationError);
      setLoading(false);
      return;
    }

    if (passwordValidationError) {
      setPasswordError(passwordValidationError);
      setLoading(false);
      return;
    }

    try {
      const loginCredentials = { email: email.trim(), password };

      const response = await authAPI.login(loginCredentials);
      
      // Clear existing tokens from both storages first
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      sessionStorage.removeItem('accessToken');
      sessionStorage.removeItem('user');
      
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
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (emailError) {
                setEmailError('');
              }
            }}
            onBlur={() => {
              setEmailError(validateEmail(email));
            }}
            className={`login-input ${emailError ? 'input-error' : ''}`}
          />
          {emailError && (
            <div className="field-error-message">
              {emailError}
            </div>
          )}
        </div>
        
        <div className="input-group">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (passwordError) {
                setPasswordError('');
              }
            }}
            onBlur={() => {
              setPasswordError(validatePassword(password));
            }}
            className={`login-input ${passwordError ? 'input-error' : ''}`}
          />
          {passwordError && (
            <div className="field-error-message">
              {passwordError}
            </div>
          )}
        </div>
        
        {error && (
          <div className="error-message-container">
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
        
        <button type="submit" className="login-button" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <div className="signup-link-container">
          <span>Don't have an account? </span>
          <Link to="/register">
            Sign up
          </Link>
        </div>
      </form>
    </div>
  );
}

export default Login;

