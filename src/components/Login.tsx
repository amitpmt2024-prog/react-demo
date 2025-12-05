import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { authAPI, moviesAPI } from '../services/api';
import './Login.css';

function Login() {
  const [emailOrUserName, setEmailOrUserName] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Helper function to check if input is an email
  const isEmail = (value: string): boolean => {
    return value.includes('@') && value.includes('.');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Determine if input is email or userName
      const loginCredentials = isEmail(emailOrUserName)
        ? { email: emailOrUserName, password }
        : { userName: emailOrUserName, password };

      const response = await authAPI.login(loginCredentials);
      console.log('res',response);
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

      // Check if user has any movies, if not redirect to create movie page
      try {
        const moviesResponse = await moviesAPI.getList({ page: 1, limit: 1 });
        if (moviesResponse.total === 0 || !moviesResponse.movies || moviesResponse.movies.length === 0) {
          // No movies, redirect to create movie page
          navigate('/movies/create');
        } else {
          // Has movies, go to movie list
          navigate('/movies');
        }
      } catch (error) {
        // If error fetching movies, still go to movie list
        console.error('Error checking movies:', error);
        navigate('/movies');
      }
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
            placeholder="Email or Username"
            value={emailOrUserName}
            onChange={(e) => setEmailOrUserName(e.target.value)}
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
        
        <button type="submit" className="login-button" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}

export default Login;

