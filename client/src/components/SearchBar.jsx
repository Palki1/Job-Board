import { useState } from "react";
import { useNavigate } from "react-router-dom";

const SearchBar = ({ initialKeyword = "", initialLocation = "", size = "default" }) => {
  const [keyword, setKeyword] = useState(initialKeyword);
  const [location, setLocation] = useState(initialLocation);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (keyword) params.set("keyword", keyword);
    if (location) params.set("location", location);
    navigate(`/jobs?${params.toString()}`);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`w-full bg-white rounded-2xl shadow-card border border-navy-50 p-2 flex flex-col sm:flex-row gap-2 ${
        size === "compact" ? "sm:p-2" : "sm:p-3"
      }`}
    >
      <div className="flex items-center flex-1 px-3 gap-2">
        <svg width="18" height="18" fill="none" viewBox="0 0 24 24" className="text-muted shrink-0">
          <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
          <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Job title, skill, or company"
          className="w-full py-2.5 text-sm outline-none bg-transparent placeholder:text-muted"
          aria-label="Search jobs"
        />
      </div>
      <div className="hidden sm:block w-px bg-navy-50" />
      <div className="flex items-center flex-1 px-3 gap-2">
        <svg width="18" height="18" fill="none" viewBox="0 0 24 24" className="text-muted shrink-0">
          <path
            d="M12 21s7-6.1 7-11.5A7 7 0 0 0 5 9.5C5 14.9 12 21 12 21z"
            stroke="currentColor"
            strokeWidth="2"
          />
          <circle cx="12" cy="9.5" r="2.5" stroke="currentColor" strokeWidth="2" />
        </svg>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="City or 'Remote'"
          className="w-full py-2.5 text-sm outline-none bg-transparent placeholder:text-muted"
          aria-label="Location"
        />
      </div>
      <button type="submit" className="btn-accent shrink-0 px-6">
        Search jobs
      </button>
    </form>
  );
};

export default SearchBar;
