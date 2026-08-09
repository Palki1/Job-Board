import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import Alert from "../components/Alert";

const initialForm = {
  title: "",
  description: "",
  responsibilities: "",
  requirements: "",
  location: "",
  workType: "On-site",
  employmentType: "Full-time",
  category: "",
  experienceLevel: "Entry",
  salaryMin: "",
  salaryMax: "",
  currency: "USD",
  skills: "",
  applicationDeadline: "",
  isFeatured: false,
};

const PostJob = () => {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const payload = {
        ...form,
        responsibilities: form.responsibilities.split("\n").map((s) => s.trim()).filter(Boolean),
        requirements: form.requirements.split("\n").map((s) => s.trim()).filter(Boolean),
        skills: form.skills.split(",").map((s) => s.trim()).filter(Boolean),
        salaryMin: form.salaryMin ? Number(form.salaryMin) : undefined,
        salaryMax: form.salaryMax ? Number(form.salaryMax) : undefined,
      };
      const { data } = await api.post("/jobs", payload);
      navigate(`/jobs/${data.job._id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Could not post job. Please check the form.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-page py-10 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-1">Post a new job</h1>
      <p className="text-muted mb-6">Fill in the details below — you can edit or close this listing anytime.</p>

      <form onSubmit={handleSubmit} className="card p-6 sm:p-8 space-y-5">
        <Alert type="error">{error}</Alert>

        <div>
          <label className="label">Job title</label>
          <input name="title" required className="input" value={form.title} onChange={handleChange} placeholder="e.g. Senior Frontend Engineer" />
        </div>

        <div>
          <label className="label">Description</label>
          <textarea name="description" required rows={4} className="input" value={form.description} onChange={handleChange} />
        </div>

        <div>
          <label className="label">Responsibilities (one per line)</label>
          <textarea name="responsibilities" rows={3} className="input" value={form.responsibilities} onChange={handleChange} />
        </div>

        <div>
          <label className="label">Requirements (one per line)</label>
          <textarea name="requirements" rows={3} className="input" value={form.requirements} onChange={handleChange} />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="label">Location</label>
            <input name="location" required className="input" value={form.location} onChange={handleChange} placeholder="City or 'Remote'" />
          </div>
          <div>
            <label className="label">Category</label>
            <input name="category" required className="input" value={form.category} onChange={handleChange} placeholder="e.g. Engineering" />
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className="label">Work type</label>
            <select name="workType" className="input" value={form.workType} onChange={handleChange}>
              <option>On-site</option>
              <option>Remote</option>
              <option>Hybrid</option>
            </select>
          </div>
          <div>
            <label className="label">Employment type</label>
            <select name="employmentType" className="input" value={form.employmentType} onChange={handleChange}>
              <option>Full-time</option>
              <option>Part-time</option>
              <option>Contract</option>
              <option>Internship</option>
              <option>Temporary</option>
            </select>
          </div>
          <div>
            <label className="label">Experience level</label>
            <select name="experienceLevel" className="input" value={form.experienceLevel} onChange={handleChange}>
              <option>Entry</option>
              <option>Mid</option>
              <option>Senior</option>
              <option>Lead</option>
              <option>Executive</option>
            </select>
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className="label">Min salary</label>
            <input name="salaryMin" type="number" className="input" value={form.salaryMin} onChange={handleChange} />
          </div>
          <div>
            <label className="label">Max salary</label>
            <input name="salaryMax" type="number" className="input" value={form.salaryMax} onChange={handleChange} />
          </div>
          <div>
            <label className="label">Currency</label>
            <input name="currency" className="input" value={form.currency} onChange={handleChange} />
          </div>
        </div>

        <div>
          <label className="label">Skills (comma-separated)</label>
          <input name="skills" className="input" value={form.skills} onChange={handleChange} placeholder="React, Node.js, MongoDB" />
        </div>

        <div className="grid sm:grid-cols-2 gap-4 items-end">
          <div>
            <label className="label">Application deadline</label>
            <input name="applicationDeadline" type="date" className="input" value={form.applicationDeadline} onChange={handleChange} />
          </div>
          <label className="flex items-center gap-2 text-sm font-medium text-navy-800 pb-2.5">
            <input type="checkbox" name="isFeatured" checked={form.isFeatured} onChange={handleChange} className="w-4 h-4 accent-teal-500" />
            Feature this job on the homepage
          </label>
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? "Posting…" : "Post job"}
        </button>
      </form>
    </div>
  );
};

export default PostJob;
