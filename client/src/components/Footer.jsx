import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="bg-navy-900 text-navy-100 mt-20">
    <div className="container-page py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
      <div className="col-span-2 md:col-span-1">
        <div className="flex items-center gap-2 font-display font-bold text-lg text-white mb-3">
          <span className="w-8 h-8 rounded-lg bg-teal-500 text-navy-900 flex items-center justify-center text-sm">
            JB
          </span>
          JobBoard
        </div>
        <p className="text-sm text-navy-100/70 max-w-xs">
          Connecting candidates and employers with a faster, friendlier hiring process.
        </p>
      </div>
      <div>
        <h4 className="text-white text-sm font-semibold mb-3">For candidates</h4>
        <ul className="space-y-2 text-sm text-navy-100/70">
          <li><Link to="/jobs" className="hover:text-teal-400">Browse jobs</Link></li>
          <li><Link to="/register" className="hover:text-teal-400">Create profile</Link></li>
          <li><Link to="/candidate/dashboard" className="hover:text-teal-400">My applications</Link></li>
        </ul>
      </div>
      <div>
        <h4 className="text-white text-sm font-semibold mb-3">For employers</h4>
        <ul className="space-y-2 text-sm text-navy-100/70">
          <li><Link to="/employer/post-job" className="hover:text-teal-400">Post a job</Link></li>
          <li><Link to="/employer/dashboard" className="hover:text-teal-400">Manage listings</Link></li>
        </ul>
      </div>
      <div>
        <h4 className="text-white text-sm font-semibold mb-3">Company</h4>
        <ul className="space-y-2 text-sm text-navy-100/70">
          <li>Jaipur, India</li>
          <li>support@jobboard.demo</li>
        </ul>
      </div>
    </div>
    <div className="border-t border-white/10 py-5 text-center text-xs text-navy-100/50">
      © {new Date().getFullYear()} JobBoard. All rights reserved.
    </div>
  </footer>
);

export default Footer;
