import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate, Link } from 'react-router-dom';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../services/firebase";
import styles from './Register.module.css';

const schema = yup.object().shape({
  email: yup.string().email('Invalid email format').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('Confirm password is required'),
});

const Register = () => {
  const navigate = useNavigate();
  const [registerError, setRegisterError] = useState('');
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    setRegisterError('');
    try {
      await createUserWithEmailAndPassword(auth, data.email, data.password);
      navigate('/login');
    } catch (error) {
      setRegisterError('Registration failed. Please check your details.');
    }
  };

  return (
    <div className={styles.registerContainer}>
      <form className={styles.registerForm} onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.registerHeader}>
          <h2 className={styles.title}>Create a New Account</h2>
          <p className={styles.subtitle}>Register to access the forum and explore dashboard features.</p>
        </div>

        {registerError && (
          <div className={styles.serverError}>
            <p>{registerError}</p>
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

        <div className={styles.inputGroup}>
          <input
            {...register('confirmPassword')}
            type="password"
            placeholder="Confirm Password"
            className={errors.confirmPassword ? styles.errorInput : ''}
          />
          {errors.confirmPassword && <p className={styles.errorText}>{errors.confirmPassword.message}</p>}
        </div>

        <button type="submit" disabled={isSubmitting} className={styles.registerBtn}>
          {isSubmitting ? 'Creating account...' : 'Register'}
        </button>

        <p className={styles.footerText}>
          Already have an account? <Link to="/login" className={styles.registerLink}>Sign in</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;