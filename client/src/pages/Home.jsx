import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import SearchBar from "../components/SearchBar";
import JobCard from "../components/JobCard";
import Spinner from "../components/Spinner";

const roleTicker = [
  "Frontend Engineer", "Product Designer", "Backend Engineer", "Data Analyst",
  "DevOps Engineer", "Marketing Manager", "UX Researcher", "Sales Executive",
  "Mobile Developer", "QA Engineer",
];

const stats = [
  { label: "Live job openings", value: "2,400+" },
  { label: "Hiring companies", value: "380+" },
  { label: "Candidates placed", value: "12k+" },
];

const Home = () => {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const { data } = await api.get("/jobs", { params: { featured: true, limit: 6 } });
        setFeatured(data.jobs);
      } catch {
        setFeatured([]);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-navy-900">
        <div className="container-page py-16 sm:py-24 relative z-10">
          <p className="inline-block badge bg-teal-500/15 text-teal-300 mb-5">Welcome to JobBoard</p>
          <h1 className="text-white text-3xl sm:text-5xl font-bold max-w-2xl leading-tight">
            Find work that actually fits your next chapter.
          </h1>
          <p className="text-navy-100/70 mt-4 max-w-xl text-base sm:text-lg">
            Search thousands of open roles, apply in minutes, and track every application
            from one dashboard — whether you're hiring or job hunting.
          </p>

          <div className="mt-8 max-w-3xl">
            <SearchBar />
          </div>

          <div className="flex flex-wrap gap-8 mt-10">
            {stats.map((s) => (
              <div key={s.label}>
                <div className="text-white text-2xl font-display font-bold">{s.value}</div>
                <div className="text-navy-100/60 text-sm">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Signature element: scrolling role ticker */}
        <div className="relative border-t border-white/10 bg-navy-800/60 py-3 overflow-hidden">
          <div className="flex whitespace-nowrap animate-marquee">
            {[...roleTicker, ...roleTicker].map((role, i) => (
              <span key={i} className="mx-6 text-sm text-navy-100/50 font-medium">
                {role} <span className="text-teal-400 mx-2">•</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Featured jobs */}
      <section className="container-page py-14">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">Featured job listings</h2>
            <p className="text-muted text-sm mt-1">Hand-picked roles hiring right now</p>
          </div>
          <Link to="/jobs" className="btn-outline hidden sm:inline-flex">
            View all jobs
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <Spinner />
          </div>
        ) : featured.length === 0 ? (
          <div className="card p-10 text-center text-muted">
            No featured jobs yet — check back soon, or{" "}
            <Link to="/jobs" className="text-teal-600 font-medium">
              browse all listings
            </Link>
            .
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {featured.map((job) => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>
        )}

        <Link to="/jobs" className="btn-outline w-full mt-6 sm:hidden">
          View all jobs
        </Link>
      </section>

      {/* For employers CTA */}
      <section className="container-page pb-20">
        <div className="card bg-gradient-to-br from-navy-700 to-navy-900 p-8 sm:p-12 flex flex-col sm:flex-row items-center justify-between gap-6 border-0">
          <div>
            <h3 className="text-white text-2xl font-bold">Hiring for your team?</h3>
            <p className="text-navy-100/70 mt-2 max-w-md">
              Post a job in minutes and start receiving applications with resumes attached.
            </p>
          </div>
          <Link to="/register" className="btn-accent whitespace-nowrap">
            Post a job — it's free
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
