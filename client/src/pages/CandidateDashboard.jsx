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

const CandidateDashboard = () => {
  const { user, updateUser } = useAuth();
  const [tab, setTab] = useState("applications");
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [profile, setProfile] = useState({
    name: user?.name || "",
    headline: user?.headline || "",
    skills: user?.skills?.join(", ") || "",
    phone: user?.phone || "",
    location: user?.location || "",
    bio: user?.bio || "",
  });

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const { data } = await api.get("/applications/mine");
        setApplications(data.applications);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    const payload = { ...profile, skills: profile.skills.split(",").map((s) => s.trim()).filter(Boolean) };
    const { data } = await api.put("/auth/me", payload);
    updateUser(data.user);
    setMessage("Profile updated successfully.");
    setTimeout(() => setMessage(""), 3000);
  };

  return (
    <div className="container-page py-10">
      <h1 className="text-2xl font-bold mb-1">Candidate dashboard</h1>
      <p className="text-muted mb-8">Welcome back, {user?.name?.split(" ")[0]}</p>

      <div className="flex gap-2 border-b border-navy-50 mb-6">
        {[
          { id: "applications", label: "My applications" },
          { id: "profile", label: "Profile" },
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

      {tab === "applications" ? (
        loading ? (
          <div className="flex justify-center py-16"><Spinner /></div>
        ) : applications.length === 0 ? (
          <div className="card p-10 text-center text-muted">
            You haven't applied to any jobs yet.{" "}
            <Link to="/jobs" className="text-teal-600 font-medium">Browse open roles</Link>.
          </div>
        ) : (
          <div className="space-y-3">
            {applications.map((app) => (
              <div key={app._id} className="card p-5 flex items-center justify-between flex-wrap gap-3">
                <div>
                  <Link to={`/jobs/${app.job?._id}`} className="font-semibold text-navy-900 hover:text-teal-600">
                    {app.job?.title || "Job no longer available"}
                  </Link>
                  <div className="text-sm text-muted mt-1">
                    {app.job?.companyName} · Applied {new Date(app.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <span className={`badge capitalize ${statusColors[app.status]}`}>{app.status}</span>
              </div>
            ))}
          </div>
        )
      ) : (
        <form onSubmit={handleProfileSave} className="card p-6 sm:p-8 max-w-xl space-y-4">
          <Alert type="success">{message}</Alert>
          <div>
            <label className="label">Full name</label>
            <input className="input" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
          </div>
          <div>
            <label className="label">Headline</label>
            <input
              className="input"
              placeholder="e.g. Frontend Developer"
              value={profile.headline}
              onChange={(e) => setProfile({ ...profile, headline: e.target.value })}
            />
          </div>
          <div>
            <label className="label">Skills (comma-separated)</label>
            <input
              className="input"
              placeholder="React, Node.js, SQL"
              value={profile.skills}
              onChange={(e) => setProfile({ ...profile, skills: e.target.value })}
            />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Phone</label>
              <input className="input" value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} />
            </div>
            <div>
              <label className="label">Location</label>
              <input className="input" value={profile.location} onChange={(e) => setProfile({ ...profile, location: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="label">Bio</label>
            <textarea className="input" rows={4} value={profile.bio} onChange={(e) => setProfile({ ...profile, bio: e.target.value })} />
          </div>
          <button type="submit" className="btn-primary">Save changes</button>
        </form>
      )}
    </div>
  );
};

export default CandidateDashboard;
