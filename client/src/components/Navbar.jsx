import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const navLinkClass = ({ isActive }) =>
  `text-sm font-medium transition-colors ${
    isActive ? "text-teal-600" : "text-navy-700 hover:text-teal-600"
  }`;

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate("/");
  };

  const dashboardPath = user?.role === "employer" ? "/employer/dashboard" : "/candidate/dashboard";

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-navy-50">
      <nav className="container-page flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2 font-display font-bold text-lg text-navy-800">
          <span className="w-8 h-8 rounded-lg bg-navy-700 text-white flex items-center justify-center text-sm">JB</span>
          JobBoard
        </Link>

        <div className="hidden md:flex items-center gap-7">
          <NavLink to="/jobs" className={navLinkClass}>
            Find jobs
          </NavLink>
          {user?.role === "employer" && (
            <NavLink to="/employer/post-job" className={navLinkClass}>
              Post a job
            </NavLink>
          )}
          {user && (
            <NavLink to={dashboardPath} className={navLinkClass}>
              Dashboard
            </NavLink>
          )}
        </div>

        <div className="hidden md:flex items-center gap-3">
          {!user ? (
            <>
              <Link to="/login" className="btn-ghost">
                Log in
              </Link>
              <Link to="/register" className="btn-primary">
                Sign up
              </Link>
            </>
          ) : (
            <>
              <span className="text-sm text-muted">Hi, {user.name.split(" ")[0]}</span>
              <button onClick={handleLogout} className="btn-outline">
                Log out
              </button>
            </>
          )}
        </div>

        <button
          className="md:hidden p-2 text-navy-700"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </nav>

      {menuOpen && (
        <div className="md:hidden border-t border-navy-50 bg-white px-4 py-4 flex flex-col gap-3">
          <NavLink to="/jobs" className={navLinkClass} onClick={() => setMenuOpen(false)}>
            Find jobs
          </NavLink>
          {user?.role === "employer" && (
            <NavLink to="/employer/post-job" className={navLinkClass} onClick={() => setMenuOpen(false)}>
              Post a job
            </NavLink>
          )}
          {user && (
            <NavLink to={dashboardPath} className={navLinkClass} onClick={() => setMenuOpen(false)}>
              Dashboard
            </NavLink>
          )}
          {!user ? (
            <div className="flex gap-3 pt-2">
              <Link to="/login" className="btn-ghost flex-1" onClick={() => setMenuOpen(false)}>
                Log in
              </Link>
              <Link to="/register" className="btn-primary flex-1" onClick={() => setMenuOpen(false)}>
                Sign up
              </Link>
            </div>
          ) : (
            <button onClick={handleLogout} className="btn-outline w-full">
              Log out
            </button>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
