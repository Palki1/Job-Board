import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Alert from "../components/Alert";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "candidate",
    companyName: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await register(form);
      navigate(user.role === "employer" ? "/employer/dashboard" : "/candidate/dashboard", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-page py-16 max-w-md mx-auto">
      <h1 className="text-2xl font-bold text-center">Create your account</h1>
      <p className="text-muted text-center mt-1 mb-8">Join as a candidate or an employer</p>

      <form onSubmit={handleSubmit} className="card p-6 sm:p-8 space-y-4">
        <Alert type="error">{error}</Alert>

        <div className="grid grid-cols-2 gap-3">
          {["candidate", "employer"].map((r) => (
            <button
              type="button"
              key={r}
              onClick={() => setForm({ ...form, role: r })}
              className={`rounded-lg border px-4 py-3 text-sm font-medium capitalize transition ${
                form.role === r
                  ? "border-teal-500 bg-teal-50 text-teal-700"
                  : "border-navy-100 text-navy-700 hover:bg-navy-50"
              }`}
            >
              {r === "candidate" ? "I'm looking for a job" : "I'm hiring"}
            </button>
          ))}
        </div>

        <div>
          <label className="label" htmlFor="name">Full name</label>
          <input id="name" name="name" required className="input" value={form.name} onChange={handleChange} />
        </div>

        {form.role === "employer" && (
          <div>
            <label className="label" htmlFor="companyName">Company name</label>
            <input
              id="companyName"
              name="companyName"
              required
              className="input"
              value={form.companyName}
              onChange={handleChange}
            />
          </div>
        )}

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
          />
        </div>

        <div>
          <label className="label" htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            required
            minLength={6}
            className="input"
            value={form.password}
            onChange={handleChange}
            placeholder="At least 6 characters"
          />
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? "Creating account…" : "Create account"}
        </button>

        <p className="text-sm text-center text-muted">
          Already have an account?{" "}
          <Link to="/login" className="text-teal-600 font-medium">Log in</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
