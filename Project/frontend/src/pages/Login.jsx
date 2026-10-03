import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('admin@utility.com');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const nav = useNavigate();

  const submit = async e => {
    e.preventDefault();
    try { await login(email, password); nav('/'); }
    catch (err) { setError(err.response?.data?.message || 'Login failed'); }
  };

  return (
    <div className="login-wrap">
      <form className="card login" onSubmit={submit}>
        <h1>⚡ Meter Portal</h1>
        <p className="muted">Reading Management & Analytics</p>
        <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
        {error && <div className="error">{error}</div>}
        <button>Sign in</button>
      </form>
    </div>
  );
}
