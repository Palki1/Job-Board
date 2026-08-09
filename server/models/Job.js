import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    employer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    companyName: { type: String, required: true },
    companyLogoUrl: { type: String, default: "" },
    description: { type: String, required: true },
    responsibilities: [{ type: String }],
    requirements: [{ type: String }],
    location: { type: String, required: true, trim: true },
    workType: {
      type: String,
      enum: ["Remote", "On-site", "Hybrid"],
      default: "On-site",
    },
    employmentType: {
      type: String,
      enum: ["Full-time", "Part-time", "Contract", "Internship", "Temporary"],
      default: "Full-time",
    },
    category: { type: String, default: "General", trim: true },
    experienceLevel: {
      type: String,
      enum: ["Entry", "Mid", "Senior", "Lead", "Executive"],
      default: "Entry",
    },
    salaryMin: { type: Number },
    salaryMax: { type: Number },
    currency: { type: String, default: "USD" },
    skills: [{ type: String }],
    applicationDeadline: { type: Date },
    status: {
      type: String,
      enum: ["open", "closed", "draft"],
      default: "open",
    },
    isFeatured: { type: Boolean, default: false },
    views: { type: Number, default: 0 },
    applicantsCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Text index for search functionality
jobSchema.index({
  title: "text",
  description: "text",
  companyName: "text",
  skills: "text",
  location: "text",
});

export default mongoose.model("Job", jobSchema);
