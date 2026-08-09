const Spinner = ({ size = 32 }) => (
  <div
    className="animate-spin rounded-full border-4 border-navy-100 border-t-teal-500"
    style={{ width: size, height: size }}
    role="status"
    aria-label="Loading"
  />
);

export default Spinner;
