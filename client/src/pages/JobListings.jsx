import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api/axios";
import SearchBar from "../components/SearchBar";
import JobCard from "../components/JobCard";
import Spinner from "../components/Spinner";

const employmentTypes = ["Full-time", "Part-time", "Contract", "Internship", "Temporary"];
const workTypes = ["Remote", "On-site", "Hybrid"];
const experienceLevels = ["Entry", "Mid", "Senior", "Lead", "Executive"];

const JobListings = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalResults, setTotalResults] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const keyword = searchParams.get("keyword") || "";
  const location = searchParams.get("location") || "";
  const employmentType = searchParams.get("employmentType") || "";
  const workType = searchParams.get("workType") || "";
  const experienceLevel = searchParams.get("experienceLevel") || "";
  const page = parseInt(searchParams.get("page") || "1", 10);

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const { data } = await api.get("/jobs", {
          params: { keyword, location, employmentType, workType, experienceLevel, page, limit: 9 },
        });
        setJobs(data.jobs);
        setTotalResults(data.totalResults);
        setTotalPages(data.totalPages);
      } catch {
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyword, location, employmentType, workType, experienceLevel, page]);

  const updateFilter = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set(key, value);
    else params.delete(key);
    params.set("page", "1");
    setSearchParams(params);
  };

  const goToPage = (p) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", p);
    setSearchParams(params);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="container-page py-10">
      <h1 className="text-2xl font-bold mb-1">Find your next job</h1>
      <p className="text-muted mb-6">
        {loading ? "Searching…" : `${totalResults} open role${totalResults === 1 ? "" : "s"} found`}
      </p>

      <SearchBar initialKeyword={keyword} initialLocation={location} />

      <div className="flex flex-wrap gap-3 mt-5">
        <select
          className="input w-auto"
          value={employmentType}
          onChange={(e) => updateFilter("employmentType", e.target.value)}
        >
          <option value="">All employment types</option>
          {employmentTypes.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        <select
          className="input w-auto"
          value={workType}
          onChange={(e) => updateFilter("workType", e.target.value)}
        >
          <option value="">All work types</option>
          {workTypes.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        <select
          className="input w-auto"
          value={experienceLevel}
          onChange={(e) => updateFilter("experienceLevel", e.target.value)}
        >
          <option value="">All experience levels</option>
          {experienceLevels.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        {(employmentType || workType || experienceLevel || keyword || location) && (
          <button className="btn-ghost text-sm" onClick={() => setSearchParams({})}>
            Clear filters
          </button>
        )}
      </div>

      <div className="mt-8">
        {loading ? (
          <div className="flex justify-center py-16">
            <Spinner />
          </div>
        ) : jobs.length === 0 ? (
          <div className="card p-10 text-center text-muted">
            No jobs match your search. Try adjusting your filters.
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {jobs.map((job) => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-10">
          <button
            className="btn-outline"
            disabled={page <= 1}
            onClick={() => goToPage(page - 1)}
          >
            Previous
          </button>
          <span className="text-sm text-muted px-2">
            Page {page} of {totalPages}
          </span>
          <button
            className="btn-outline"
            disabled={page >= totalPages}
            onClick={() => goToPage(page + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default JobListings;
