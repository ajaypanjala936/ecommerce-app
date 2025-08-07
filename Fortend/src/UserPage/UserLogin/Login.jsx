


// import { useState } from 'react';
// import { useAuth } from '../../context/AuthContext';
// import { Link, useNavigate } from 'react-router-dom';
// import { FiAlertCircle, FiLoader } from 'react-icons/fi';
// import './Login.css';

// export const Login = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);
//   const { login } = useAuth();
//   const navigate = useNavigate();

//   const validateEmail = (email) => {
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     return emailRegex.test(email);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     setLoading(true);

//     if (!validateEmail(email)) {
//       setError('Please enter a valid email address.');
//       setLoading(false);
//       return;
//     }
//     if (password.length < 6) {
//       setError('Password must be at least 6 characters long.');
//       setLoading(false);
//       return;
//     }

//     try {
//       const { token, user } = await login(email, password);
//       console.log('User login successful, response:', {
//         token: token.slice(0, 10) + '...',
//         user
//       });
//       console.log('localStorage after user login:', {
//         user: localStorage.getItem('user'),
//         token: localStorage.getItem('token')?.slice(0, 10) + '...'
//       });
//       alert(`Welcome to E-Commerce, ${user?.name || 'User'}! 🎉`);
//       navigate('/', { replace: true });
//     } catch (err) {
//       console.error('User login error:', err.message, err.stack);
//       const errorMessage =
//         err.message === 'Invalid credentials'
//           ? 'Incorrect email or password.'
//           : err.message.includes('Unexpected token')
//           ? 'Server error: Unable to connect to the API. Please check if the server is running.'
//           : err.message || 'Login failed. Please try again later.';
//       setError(errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const dismissError = () => {
//     setError('');
//   };

//   return (
//     <div className="login__container">
//       <div className="login__card">
//         <h1 className="login__title">Login</h1>
//         {error && (
//           <div className="login__error" role="alert">
//             <FiAlertCircle className="login__error-icon" />
//             <span>{error}</span>
//             <button
//               className="login__error-dismiss"
//               onClick={dismissError}
//               aria-label="Dismiss error message"
//               title="Dismiss error"
//             >
//               ×
//             </button>
//           </div>
//         )}
//         <form onSubmit={handleSubmit} className="login__form">
//           <div className="login__form-group">
//             <label htmlFor="email" className="login__form-label">Email</label>
//             <input
//               id="email"
//               type="email"
//               placeholder="Enter your email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               className="login__form-input"
//               required
//               autoComplete="email"
//               aria-required="true"
//             />
//           </div>
//           <div className="login__form-group">
//             <label htmlFor="password" className="login__form-label">Password</label>
//             <input
//               id="password"
//               type="password"
//               placeholder="Enter your password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               className="login__form-input"
//               required
//               autoComplete="current-password"
//               aria-required="true"
//             />
//           </div>
//           <button
//             type="submit"
//             className="login__submit-button"
//             disabled={loading}
//             aria-busy={loading}
//           >
//             {loading ? (
//               <>
//                 <FiLoader className="login__loading-spinner" /> Logging in...
//               </>
//             ) : (
//               'Login'
//             )}
//           </button>
//         </form>
//         <div className="login__links">
//           <p className="login__register-link">
//             Don't have an account? <Link to="/register" className="login__link-text">Register</Link>
//           </p>
//           <p className="login__forgot-password-link">
//             <Link to="/forgot-password" className="login__link-text">Forgot Password?</Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };







import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { FiAlertCircle, FiLoader } from 'react-icons/fi';
import './Login.css';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      setLoading(false);
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      setLoading(false);
      return;
    }

    try {
      const { token, user } = await login(email, password);
      console.log('User login successful, response:', {
        token: token.slice(0, 10) + '...',
        user
      });
      console.log('localStorage after user login:', {
        user: localStorage.getItem('user'),
        token: localStorage.getItem('token')?.slice(0, 10) + '...'
      });
      alert(`Welcome to E-Commerce, ${user?.name || 'User'}! 🎉`);

      // Redirect based on user role
      const redirectTo = user?.role === 'admin' ? '/dashboard' : '/';
      navigate(redirectTo, { replace: true });
    } catch (err) {
      console.error('User login error:', err.message, err.stack);
      const errorMessage =
        err.message === 'Invalid credentials'
          ? 'Incorrect email or password.'
          : err.message.includes('Unexpected token')
          ? 'Server error: Unable to connect to the API. Please check if the server is running.'
          : err.message || 'Login failed. Please try again later.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const dismissError = () => {
    setError('');
  };

  return (
    <div className="login__container">
      <div className="login__card">
        <h1 className="login__title">Login</h1>
        {error && (
          <div className="login__error" role="alert">
            <FiAlertCircle className="login__error-icon" />
            <span>{error}</span>
            <button
              className="login__error-dismiss"
              onClick={dismissError}
              aria-label="Dismiss error message"
              title="Dismiss error"
            >
              ×
            </button>
          </div>
        )}
        <form onSubmit={handleSubmit} className="login__form">
          <div className="login__form-group">
            <label htmlFor="email" className="login__form-label">Email</label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="login__form-input"
              required
              autoComplete="email"
              aria-required="true"
            />
          </div>
          <div className="login__form-group">
            <label htmlFor="password" className="login__form-label">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="login__form-input"
              required
              autoComplete="current-password"
              aria-required="true"
            />
          </div>
          <button
            type="submit"
            className="login__submit-button10"
            disabled={loading}
            aria-busy={loading}
          >
            {loading ? (
              <>
                <FiLoader className="login__loading-spinner" /> Logging in...
              </>
            ) : (
              'Login'
            )}
          </button>
        </form>
        <div className="login__links">
          <p className="login__register-link">
            Don't have an account? <Link to="/register" className="login__link-text">Registe cfasr</Link>
          </p>
          <p className="login__forgot-password-link">
            <Link to="/forgot-password" className="login__link-text">Forgot Password?</Link>
          </p>
        </div>
      </div>
    </div>
  );
};