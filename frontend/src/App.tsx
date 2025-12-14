import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './hooks/useAuth';
import './App.css';

// Placeholder pages - you can expand these
const HomePage = () => {
  const { user, logout, isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="container">
      <h1>Welcome, {user?.username}!</h1>
      <p>Email: {user?.email}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

const LoginPage = () => {
  const { login, isLoggedIn } = useAuth();

  if (isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    try {
      await login({
        username: formData.get('username') as string,
        password: formData.get('password') as string,
      });
    } catch (error) {
      console.error('Login failed:', error);
      alert('Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="container">
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <input type="text" name="username" placeholder="Username" required />
        </div>
        <div>
          <input type="password" name="password" placeholder="Password" required />
        </div>
        <button type="submit">Login</button>
      </form>
      <p>
        Don't have an account? <a href="/register">Register</a>
      </p>
    </div>
  );
};

const RegisterPage = () => {
  const { isLoggedIn } = useAuth();

  if (isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const password = formData.get('password') as string;
    const password2 = formData.get('password2') as string;

    if (password !== password2) {
      alert('Passwords do not match');
      return;
    }

    try {
      const response = await fetch('/api/users/register/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.get('username'),
          email: formData.get('email'),
          password,
          password2,
        }),
      });

      if (response.ok) {
        alert('Registration successful! Please login.');
        window.location.href = '/login';
      } else {
        const data = await response.json();
        alert(`Registration failed: ${JSON.stringify(data)}`);
      }
    } catch (error) {
      console.error('Registration failed:', error);
      alert('Registration failed. Please try again.');
    }
  };

  return (
    <div className="container">
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <input type="text" name="username" placeholder="Username" required />
        </div>
        <div>
          <input type="email" name="email" placeholder="Email" required />
        </div>
        <div>
          <input type="password" name="password" placeholder="Password" required />
        </div>
        <div>
          <input type="password" name="password2" placeholder="Confirm Password" required />
        </div>
        <button type="submit">Register</button>
      </form>
      <p>
        Already have an account? <a href="/login">Login</a>
      </p>
    </div>
  );
};

const AppRoutes = () => {
  const { isLoading } = useAuth();

  if (isLoading) {
    return <div className="container">Loading...</div>;
  }

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
    </Routes>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
