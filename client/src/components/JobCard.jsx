import { Link } from "react-router-dom";

const typeColors = {
  "Full-time": "bg-teal-50 text-teal-600",
  "Part-time": "bg-amber-50 text-amber-600",
  Contract: "bg-navy-50 text-navy-700",
  Internship: "bg-purple-50 text-purple-600",
  Temporary: "bg-rose-50 text-rose-600",
};

const formatSalary = (job) => {
  if (!job.salaryMin && !job.salaryMax) return null;
  const fmt = (n) => new Intl.NumberFormat("en-IN").format(n);
  if (job.salaryMin && job.salaryMax) {
    return `${job.currency || ""} ${fmt(job.salaryMin)} - ${fmt(job.salaryMax)}`;
  }
  return `${job.currency || ""} ${fmt(job.salaryMin || job.salaryMax)}`;
};

const timeAgo = (date) => {
  const diff = Math.floor((Date.now() - new Date(date).getTime()) / (1000 * 60 * 60 * 24));
  if (diff <= 0) return "Today";
  if (diff === 1) return "1 day ago";
  if (diff < 30) return `${diff} days ago`;
  return new Date(date).toLocaleDateString();
};

const JobCard = ({ job }) => {
  const salary = formatSalary(job);

  return (
    <Link
      to={`/jobs/${job._id}`}
      className="card block p-5 hover:shadow-cardHover hover:-translate-y-0.5 transition-all duration-150"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-11 h-11 rounded-xl bg-navy-50 flex items-center justify-center text-navy-700 font-display font-bold shrink-0">
            {job.companyName?.[0]?.toUpperCase() || "?"}
          </div>
          <div className="min-w-0">
            <h3 className="font-display font-semibold text-navy-900 truncate">{job.title}</h3>
            <p className="text-sm text-muted truncate">{job.companyName}</p>
          </div>
        </div>
        {job.isFeatured && <span className="badge bg-amber-50 text-amber-600 shrink-0">Featured</span>}
      </div>

      <div className="flex flex-wrap gap-2 mt-4">
        <span className={`badge ${typeColors[job.employmentType] || "bg-navy-50 text-navy-700"}`}>
          {job.employmentType}
        </span>
        <span className="badge bg-navy-50 text-navy-700">{job.workType}</span>
        <span className="badge bg-navy-50 text-navy-700">{job.location}</span>
      </div>

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-navy-50">
        <span className="text-sm font-medium text-navy-800">{salary || "Salary not disclosed"}</span>
        <span className="text-xs text-muted">{timeAgo(job.createdAt)}</span>
      </div>
    </Link>
  );
};

export default JobCard;
