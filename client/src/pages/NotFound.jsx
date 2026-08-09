import { Link } from "react-router-dom";

const NotFound = () => (
  <div className="container-page py-24 text-center">
    <h1 className="text-5xl font-display font-bold text-navy-800">404</h1>
    <p className="text-muted mt-3 mb-6">The page you're looking for doesn't exist.</p>
    <Link to="/" className="btn-primary inline-flex">Back to home</Link>
  </div>
);

export default NotFound;
