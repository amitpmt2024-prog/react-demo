import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { authAPI } from '../services/api';
import './Login.css';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
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

  // Validate name field
  const validateName = (nameValue: string): string => {
    if (!nameValue || !nameValue.trim()) {
      return 'Name is required';
    }
    if (nameValue.trim().length < 2) {
      return 'Name must be at least 2 characters long';
    }
    if (nameValue.trim().length > 100) {
      return 'Name cannot exceed 100 characters';
    }
    return '';
  };

  // Validate email field
  const validateEmail = (emailValue: string): string => {
    if (!emailValue || !emailValue.trim()) {
      return 'Email is required';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailValue.trim())) {
      return 'Please enter a valid email address';
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

  // Validate confirm password field
  const validateConfirmPassword = (confirmPasswordValue: string, passwordValue: string): string => {
    if (!confirmPasswordValue || !confirmPasswordValue.trim()) {
      return 'Confirm password is required';
    }
    if (confirmPasswordValue !== passwordValue) {
      return 'Passwords do not match';
    }
    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setNameError('');
    setEmailError('');
    setPasswordError('');
    setConfirmPasswordError('');
    setLoading(true);

    // Validate all fields
    const nameValidationError = validateName(name);
    const emailValidationError = validateEmail(email);
    const passwordValidationError = validatePassword(password);
    const confirmPasswordValidationError = validateConfirmPassword(confirmPassword, password);

    if (nameValidationError) {
      setNameError(nameValidationError);
      setLoading(false);
      return;
    }

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

    if (confirmPasswordValidationError) {
      setConfirmPasswordError(confirmPasswordValidationError);
      setLoading(false);
      return;
    }

    try {
      const registerData = {
        name: name.trim(),
        email: email.trim(),
        password,
      };

      const response = await authAPI.register(registerData);

      // Show success toast
      toast.success(response.message || 'Registration successful!');

      // Redirect to login page after successful registration
      navigate('/login');
    } catch (err: unknown) {
      // Extract error message from different response formats
      let errorMessage = 'Registration failed. Please try again.';
      
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
      
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form className="sign-in-box" onSubmit={handleSubmit}>
        <h1 className="sign-in-title">Sign up</h1>
        
        <div className="input-group">
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (nameError) {
                setNameError('');
              }
            }}
            onBlur={() => {
              setNameError(validateName(name));
            }}
            className={`login-input ${nameError ? 'input-error' : ''}`}
          />
          {nameError && (
            <div className="field-error-message">
              {nameError}
            </div>
          )}
        </div>
        
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
              // Re-validate confirm password if it has a value
              if (confirmPassword) {
                setConfirmPasswordError(validateConfirmPassword(confirmPassword, e.target.value));
              }
            }}
            onBlur={() => {
              setPasswordError(validatePassword(password));
              if (confirmPassword) {
                setConfirmPasswordError(validateConfirmPassword(confirmPassword, password));
              }
            }}
            className={`login-input ${passwordError ? 'input-error' : ''}`}
          />
          {passwordError && (
            <div className="field-error-message">
              {passwordError}
            </div>
          )}
        </div>

        <div className="input-group">
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              if (confirmPasswordError) {
                setConfirmPasswordError('');
              }
            }}
            onBlur={() => {
              setConfirmPasswordError(validateConfirmPassword(confirmPassword, password));
            }}
            className={`login-input ${confirmPasswordError ? 'input-error' : ''}`}
          />
          {confirmPasswordError && (
            <div className="field-error-message">
              {confirmPasswordError}
            </div>
          )}
        </div>
        
        {error && (
          <div className="error-message-container">
            {error}
          </div>
        )}
        
        <button type="submit" className="login-button" disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </button>

        <div className="signup-link-container">
          <span>Already have an account? </span>
          <Link to="/login">
            Sign in
          </Link>
        </div>
      </form>
    </div>
  );
}

export default Register;

