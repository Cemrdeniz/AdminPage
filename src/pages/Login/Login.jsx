import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../services/firebase";
import styles from './Login.module.css';

// Validation schema
const schema = yup.object().shape({
  email: yup.string().email('Invalid email format').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

const Login = () => {
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState('');
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting } 
  } = useForm({
    resolver: yupResolver(schema),
  });

  // Asenkron Giriş İsteği 
  const onSubmit = async (data) => {
    setLoginError('');
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
      // Redirect after successful login
      navigate('/dashboard'); 
    } catch (error) {
      setLoginError('Login failed. Please check your credentials.');
    }
  };

  return (
    <div className={styles.loginContainer}>
      <form className={styles.loginForm} onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.headerBlock}>
          <span className={styles.badge}>Secure Forum Login</span>
          <h2 className={styles.title}>Medicine Store</h2>
          <p className={styles.subtitle}>Fast, modern access for your dashboard and community tools.</p>
        </div>

        {loginError && (
          <div className={styles.serverError}>
            <p>{loginError}</p>
          </div>
        )}

        <div className={styles.inputGroup}>
          <input 
            {...register('email')} 
            placeholder="Email"
            className={errors.email ? styles.errorInput : ''} 
          />
          {errors.email && <p className={styles.errorText}>{errors.email.message}</p>}
        </div>
        
        <div className={styles.inputGroup}>
          <input 
            {...register('password')} 
            type="password" 
            placeholder="Password" 
            className={errors.password ? styles.errorInput : ''} 
          />
          {errors.password && <p className={styles.errorText}>{errors.password.message}</p>}
        </div>

        <button 
          type="submit" 
          className={styles.loginBtn} 
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Signing in...' : 'Sign In'}
        </button>

        <p className={styles.footerText}>
          Don’t have an account yet? <Link to="/register" className={styles.registerLink}>Create one now</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;