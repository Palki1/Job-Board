import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import Alert from "../components/Alert";
import Spinner from "../components/Spinner";

const ApplyJob = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    fullName: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    coverLetter: "",
  });
  const [resumeFile, setResumeFile] = useState(null);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const { data } = await api.get(`/jobs/${id}`);
        setJob(data.job);
      } catch {
        setError("This job could not be found.");
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 5 * 1024 * 1024) {
      setError("Resume file must be under 5MB.");
      return;
    }
    setError("");
    setResumeFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!resumeFile) {
      setError("Please attach your resume (PDF, DOC, or DOCX).");
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => formData.append(key, value));
      formData.append("resume", resumeFile);

      await api.post(`/applications/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || "Could not submit application. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center py-24"><Spinner /></div>;
  }

  if (success) {
    return (
      <div className="container-page py-24 max-w-md mx-auto text-center">
        <div className="w-14 h-14 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center mx-auto mb-4 text-2xl">✓</div>
        <h1 className="text-2xl font-bold mb-2">Application submitted!</h1>
        <p className="text-muted mb-6">
          We've sent a confirmation to {form.email}. You can track this application from your dashboard.
        </p>
        <div className="flex gap-3 justify-center">
          <Link to="/candidate/dashboard" className="btn-primary">Go to dashboard</Link>
          <Link to="/jobs" className="btn-outline">Browse more jobs</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-page py-10 max-w-xl mx-auto">
      <Link to={`/jobs/${id}`} className="text-sm text-teal-600 font-medium mb-4 inline-block">
        ← Back to job details
      </Link>
      <h1 className="text-2xl font-bold mb-1">Apply for {job?.title}</h1>
      <p className="text-muted mb-6">at {job?.companyName}</p>

      <form onSubmit={handleSubmit} className="card p-6 sm:p-8 space-y-4">
        <Alert type="error">{error}</Alert>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="label">Full name</label>
            <input
              required
              className="input"
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            />
          </div>
          <div>
            <label className="label">Email</label>
            <input
              required
              type="email"
              className="input"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label className="label">Phone</label>
          <input className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        </div>

        <div>
          <label className="label">Cover letter (optional)</label>
          <textarea
            rows={5}
            className="input"
            value={form.coverLetter}
            onChange={(e) => setForm({ ...form, coverLetter: e.target.value })}
            placeholder="Tell the employer why you're a great fit…"
          />
        </div>

        <div>
          <label className="label">Resume</label>
          <div className="border-2 border-dashed border-navy-100 rounded-lg p-5 text-center">
            <input
              id="resume"
              type="file"
              accept=".pdf,.doc,.docx"
              className="hidden"
              onChange={handleFileChange}
            />
            <label htmlFor="resume" className="btn-outline cursor-pointer inline-flex">
              {resumeFile ? "Change file" : "Choose file"}
            </label>
            <p className="text-sm text-muted mt-2">
              {resumeFile ? resumeFile.name : "PDF, DOC, or DOCX — up to 5MB"}
            </p>
          </div>
        </div>

        <button type="submit" disabled={submitting} className="btn-accent w-full">
          {submitting ? "Submitting…" : "Submit application"}
        </button>
      </form>
    </div>
  );
};

export default ApplyJob;
