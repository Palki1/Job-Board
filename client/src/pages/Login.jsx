import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Alert from "../components/Alert";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      const redirectTo =
        location.state?.from || (user.role === "employer" ? "/employer/dashboard" : "/candidate/dashboard");
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-page py-16 max-w-md mx-auto">
      <h1 className="text-2xl font-bold text-center">Welcome back</h1>
      <p className="text-muted text-center mt-1 mb-8">Log in to continue to your dashboard</p>

      <form onSubmit={handleSubmit} className="card p-6 sm:p-8 space-y-4">
        <Alert type="error">{error}</Alert>

        <div>
          <label className="label" htmlFor="email">Email address</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="input"
            value={form.email}
            onChange={handleChange}
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label className="label" htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="input"
            value={form.password}
            onChange={handleChange}
            placeholder="••••••••"
          />
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? "Logging in…" : "Log in"}
        </button>

        <p className="text-sm text-center text-muted">
          Don't have an account?{" "}
          <Link to="/register" className="text-teal-600 font-medium">Sign up</Link>
        </p>

        <div className="text-xs text-muted bg-navy-50 rounded-lg p-3 mt-2">
          Demo accounts (after running the seed script): <br />
          employer@demo.com / password123 · candidate@demo.com / password123
        </div>
      </form>
    </div>
  );
};

export default Login;
