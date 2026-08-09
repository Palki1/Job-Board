import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import Spinner from "../components/Spinner";
import Alert from "../components/Alert";

const statusColors = {
  applied: "bg-navy-50 text-navy-700",
  reviewed: "bg-amber-50 text-amber-600",
  shortlisted: "bg-teal-50 text-teal-600",
  hired: "bg-emerald-50 text-emerald-600",
  rejected: "bg-rose-50 text-rose-600",
};

const EmployerDashboard = () => {
  const { user, updateUser } = useAuth();
  const [tab, setTab] = useState("jobs");
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [profile, setProfile] = useState({
    companyName: user?.companyName || "",
    companyWebsite: user?.companyWebsite || "",
    companyDescription: user?.companyDescription || "",
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [jobsRes, appsRes] = await Promise.all([
        api.get("/jobs/employer/mine"),
        api.get("/applications/employer/all"),
      ]);
      setJobs(jobsRes.data.jobs);
      setApplications(appsRes.data.applications);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDeleteJob = async (id) => {
    if (!confirm("Delete this job posting? This cannot be undone.")) return;
    await api.delete(`/jobs/${id}`);
    setJobs((prev) => prev.filter((j) => j._id !== id));
  };

  const handleToggleStatus = async (job) => {
    const newStatus = job.status === "open" ? "closed" : "open";
    const { data } = await api.put(`/jobs/${job._id}`, { status: newStatus });
    setJobs((prev) => prev.map((j) => (j._id === job._id ? data.job : j)));
  };

  const handleApplicationStatus = async (id, status) => {
    const { data } = await api.put(`/applications/${id}/status`, { status });
    setApplications((prev) => prev.map((a) => (a._id === id ? data.application : a)));
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    const { data } = await api.put("/auth/me", profile);
    updateUser(data.user);
    setMessage("Company profile updated.");
    setTimeout(() => setMessage(""), 3000);
  };

  const totalApplicants = applications.length;
  const openJobs = jobs.filter((j) => j.status === "open").length;

  return (
    <div className="container-page py-10">
      <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold">Employer dashboard</h1>
          <p className="text-muted">{user?.companyName}</p>
        </div>
        <Link to="/employer/post-job" className="btn-accent">+ Post a new job</Link>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="card p-5">
          <div className="text-2xl font-display font-bold">{jobs.length}</div>
          <div className="text-sm text-muted">Total jobs posted</div>
        </div>
        <div className="card p-5">
          <div className="text-2xl font-display font-bold">{openJobs}</div>
          <div className="text-sm text-muted">Open jobs</div>
        </div>
        <div className="card p-5">
          <div className="text-2xl font-display font-bold">{totalApplicants}</div>
          <div className="text-sm text-muted">Total applicants</div>
        </div>
      </div>

      <div className="flex gap-2 border-b border-navy-50 mb-6">
        {[
          { id: "jobs", label: "My jobs" },
          { id: "applicants", label: "Applicants" },
          { id: "profile", label: "Company profile" },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition ${
              tab === t.id ? "border-teal-500 text-teal-600" : "border-transparent text-muted hover:text-navy-700"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Spinner /></div>
      ) : tab === "jobs" ? (
        <div className="space-y-3">
          {jobs.length === 0 && (
            <div className="card p-10 text-center text-muted">
              You haven't posted any jobs yet.{" "}
              <Link to="/employer/post-job" className="text-teal-600 font-medium">Post your first job</Link>.
            </div>
          )}
          {jobs.map((job) => (
            <div key={job._id} className="card p-5 flex items-center justify-between flex-wrap gap-3">
              <div>
                <Link to={`/jobs/${job._id}`} className="font-semibold text-navy-900 hover:text-teal-600">
                  {job.title}
                </Link>
                <div className="text-sm text-muted mt-1">
                  {job.location} · {job.applicantsCount} applicant{job.applicantsCount === 1 ? "" : "s"} · {job.views} views
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`badge ${job.status === "open" ? "bg-teal-50 text-teal-600" : "bg-navy-50 text-navy-700"}`}>
                  {job.status}
                </span>
                <button className="btn-outline text-xs px-3 py-1.5" onClick={() => handleToggleStatus(job)}>
                  {job.status === "open" ? "Close" : "Reopen"}
                </button>
                <button
                  className="btn-outline text-xs px-3 py-1.5 border-rose-200 text-rose-600 hover:bg-rose-50"
                  onClick={() => handleDeleteJob(job._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : tab === "applicants" ? (
        <div className="space-y-3">
          {applications.length === 0 && (
            <div className="card p-10 text-center text-muted">No applicants yet.</div>
          )}
          {applications.map((app) => (
            <div key={app._id} className="card p-5 flex items-center justify-between flex-wrap gap-3">
              <div>
                <div className="font-semibold text-navy-900">{app.fullName}</div>
                <div className="text-sm text-muted mt-1">
                  Applied for <span className="font-medium text-navy-800">{app.job?.title}</span> · {app.email}
                </div>
                <a
                  href={`${import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:5000"}${app.resumeUrl}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-teal-600 text-sm font-medium mt-1 inline-block"
                >
                  View resume ↗
                </a>
              </div>
              <select
                className="input w-auto"
                value={app.status}
                onChange={(e) => handleApplicationStatus(app._id, e.target.value)}
              >
                {Object.keys(statusColors).map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          ))}
        </div>
      ) : (
        <form onSubmit={handleProfileSave} className="card p-6 sm:p-8 max-w-xl space-y-4">
          <Alert type="success">{message}</Alert>
          <div>
            <label className="label">Company name</label>
            <input
              className="input"
              value={profile.companyName}
              onChange={(e) => setProfile({ ...profile, companyName: e.target.value })}
            />
          </div>
          <div>
            <label className="label">Company website</label>
            <input
              className="input"
              value={profile.companyWebsite}
              onChange={(e) => setProfile({ ...profile, companyWebsite: e.target.value })}
              placeholder="https://"
            />
          </div>
          <div>
            <label className="label">Company description</label>
            <textarea
              className="input"
              rows={5}
              value={profile.companyDescription}
              onChange={(e) => setProfile({ ...profile, companyDescription: e.target.value })}
            />
          </div>
          <button type="submit" className="btn-primary">Save changes</button>
        </form>
      )}
    </div>
  );
};

export default EmployerDashboard;
