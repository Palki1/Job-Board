// Populates the database with a demo employer, candidate, and job listings.
// Run with: npm run seed  (make sure MONGO_URI is set in .env)
import dotenv from "dotenv";
import connectDB from "../config/db.js";
import User from "../models/User.js";
import Job from "../models/Job.js";

dotenv.config();

const run = async () => {
  await connectDB();

  await Promise.all([User.deleteMany({}), Job.deleteMany({})]);

  const employer = await User.create({
    name: "Alex Rivera",
    email: "employer@demo.com",
    password: "password123",
    role: "employer",
    companyName: "Nimbus Technologies",
    companyWebsite: "https://nimbus.example.com",
    companyDescription: "Nimbus builds cloud tooling for fast-moving product teams.",
  });

  const candidate = await User.create({
    name: "Jordan Lee",
    email: "candidate@demo.com",
    password: "password123",
    role: "candidate",
    headline: "Frontend Developer",
    skills: ["React", "JavaScript", "CSS", "Node.js"],
    location: "Remote",
  });

  const jobsData = [
    {
      title: "Frontend Engineer (React)",
      description:
        "Build delightful, accessible user interfaces for our flagship analytics dashboard used by thousands of teams daily.",
      responsibilities: ["Build reusable React components", "Collaborate with design on UX", "Write unit tests"],
      requirements: ["3+ years with React", "Strong CSS skills", "Experience with REST APIs"],
      location: "Bengaluru, India",
      workType: "Hybrid",
      employmentType: "Full-time",
      category: "Engineering",
      experienceLevel: "Mid",
      salaryMin: 1200000,
      salaryMax: 1800000,
      currency: "INR",
      skills: ["React", "JavaScript", "CSS", "Redux"],
      isFeatured: true,
    },
    {
      title: "Backend Engineer (Node.js)",
      description:
        "Design and scale the APIs and services powering our job matching engine.",
      responsibilities: ["Design REST APIs", "Optimize MongoDB queries", "Own service reliability"],
      requirements: ["3+ years Node.js", "Experience with MongoDB", "Understanding of system design"],
      location: "Remote",
      workType: "Remote",
      employmentType: "Full-time",
      category: "Engineering",
      experienceLevel: "Mid",
      salaryMin: 1400000,
      salaryMax: 2000000,
      currency: "INR",
      skills: ["Node.js", "Express", "MongoDB"],
      isFeatured: true,
    },
    {
      title: "Product Designer",
      description:
        "Shape the end-to-end experience for candidates and employers using our platform.",
      responsibilities: ["Own design systems", "Run user research", "Prototype new flows"],
      requirements: ["Portfolio required", "Figma proficiency", "3+ years product design experience"],
      location: "Jaipur, India",
      workType: "On-site",
      employmentType: "Full-time",
      category: "Design",
      experienceLevel: "Mid",
      salaryMin: 1000000,
      salaryMax: 1600000,
      currency: "INR",
      skills: ["Figma", "UX Research", "Prototyping"],
      isFeatured: true,
    },
    {
      title: "Marketing Intern",
      description: "Support campaign planning and content creation for our growth team.",
      responsibilities: ["Draft social content", "Analyze campaign metrics", "Assist with events"],
      requirements: ["Currently pursuing a degree", "Strong writing skills"],
      location: "Remote",
      workType: "Remote",
      employmentType: "Internship",
      category: "Marketing",
      experienceLevel: "Entry",
      skills: ["Content Writing", "Social Media"],
      isFeatured: false,
    },
    {
      title: "DevOps Engineer",
      description: "Own our CI/CD pipelines and cloud infrastructure across environments.",
      responsibilities: ["Manage Kubernetes clusters", "Automate deployments", "Monitor uptime"],
      requirements: ["Experience with AWS/GCP", "Docker & Kubernetes", "IaC tools like Terraform"],
      location: "Pune, India",
      workType: "Hybrid",
      employmentType: "Full-time",
      category: "Engineering",
      experienceLevel: "Senior",
      salaryMin: 1800000,
      salaryMax: 2600000,
      currency: "INR",
      skills: ["AWS", "Kubernetes", "Terraform"],
      isFeatured: false,
    },
  ];

  await Job.insertMany(
    jobsData.map((j) => ({
      ...j,
      employer: employer._id,
      companyName: employer.companyName,
    }))
  );

  console.log("Seed complete.");
  console.log("Employer login: employer@demo.com / password123");
  console.log("Candidate login: candidate@demo.com / password123");
  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
