const styles = {
  error: "bg-rose-50 text-rose-700 border-rose-100",
  success: "bg-teal-50 text-teal-700 border-teal-100",
  info: "bg-navy-50 text-navy-700 border-navy-100",
};

const Alert = ({ type = "info", children }) => {
  if (!children) return null;
  return (
    <div className={`rounded-lg border px-4 py-3 text-sm ${styles[type]}`} role="alert">
      {children}
    </div>
  );
};

export default Alert;
