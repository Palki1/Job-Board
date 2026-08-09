import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import Spinner from "../components/Spinner";
import { useAuth } from "../context/AuthContext";

const formatSalary = (job) => {
  if (!job.salaryMin && !job.salaryMax) return "Not disclosed";
  const fmt = (n) => new Intl.NumberFormat("en-IN").format(n);
  if (job.salaryMin && job.salaryMax) {
    return `${job.currency} ${fmt(job.salaryMin)} - ${fmt(job.salaryMax)} / year`;
  }
  return `${job.currency} ${fmt(job.salaryMin || job.salaryMax)} / year`;
};

const JobDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchJob = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/jobs/${id}`);
        setJob(data.job);
      } catch (err) {
        setError(err.response?.data?.message || "Job not found");
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Spinner />
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="container-page py-24 text-center">
        <p className="text-muted">{error || "Job not found"}</p>
        <Link to="/jobs" className="btn-primary inline-flex mt-4">
          Back to jobs
        </Link>
      </div>
    );
  }

  const handleApplyClick = () => {
    if (!user) {
      navigate("/login", { state: { from: `/jobs/${id}/apply` } });
      return;
    }
    if (user.role !== "candidate") {
      return;
    }
    navigate(`/jobs/${id}/apply`);
  };

  return (
    <div className="container-page py-10">
      <Link to="/jobs" className="text-sm text-teal-600 font-medium mb-4 inline-block">
        ← Back to all jobs
      </Link>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 card p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-xl bg-navy-50 flex items-center justify-center text-navy-700 font-display font-bold text-xl shrink-0">
              {job.companyName?.[0]?.toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-bold">{job.title}</h1>
              <p className="text-muted mt-1">{job.companyName} · {job.location}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mt-5">
            <span className="badge bg-teal-50 text-teal-600">{job.employmentType}</span>
            <span className="badge bg-navy-50 text-navy-700">{job.workType}</span>
            <span className="badge bg-navy-50 text-navy-700">{job.experienceLevel} level</span>
            <span className="badge bg-navy-50 text-navy-700">{job.category}</span>
          </div>

          <div className="mt-8">
            <h2 className="text-lg font-semibold mb-2">Job description</h2>
            <p className="text-ink/90 whitespace-pre-line leading-relaxed">{job.description}</p>
          </div>

          {job.responsibilities?.length > 0 && (
            <div className="mt-8">
              <h2 className="text-lg font-semibold mb-2">Responsibilities</h2>
              <ul className="list-disc pl-5 space-y-1.5 text-ink/90">
                {job.responsibilities.map((r, i) => <li key={i}>{r}</li>)}
              </ul>
            </div>
          )}

          {job.requirements?.length > 0 && (
            <div className="mt-8">
              <h2 className="text-lg font-semibold mb-2">Requirements</h2>
              <ul className="list-disc pl-5 space-y-1.5 text-ink/90">
                {job.requirements.map((r, i) => <li key={i}>{r}</li>)}
              </ul>
            </div>
          )}

          {job.skills?.length > 0 && (
            <div className="mt-8">
              <h2 className="text-lg font-semibold mb-2">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {job.skills.map((s) => (
                  <span key={s} className="badge bg-navy-50 text-navy-700">{s}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        <aside className="lg:col-span-1">
          <div className="card p-6 sticky top-24">
            <div className="text-sm text-muted mb-1">Salary</div>
            <div className="font-display font-semibold text-lg text-navy-900 mb-4">
              {formatSalary(job)}
            </div>

            <div className="space-y-2 text-sm text-ink/80 mb-6">
              <div className="flex justify-between"><span className="text-muted">Applicants</span><span>{job.applicantsCount}</span></div>
              <div className="flex justify-between"><span className="text-muted">Views</span><span>{job.views}</span></div>
              {job.applicationDeadline && (
                <div className="flex justify-between">
                  <span className="text-muted">Deadline</span>
                  <span>{new Date(job.applicationDeadline).toLocaleDateString()}</span>
                </div>
              )}
            </div>

            {(!user || user.role === "candidate") && (
              <button onClick={handleApplyClick} className="btn-accent w-full">
                Apply now
              </button>
            )}
            {user?.role === "employer" && (
              <p className="text-xs text-muted text-center">Employers cannot apply to jobs.</p>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
};

export default JobDetail;
