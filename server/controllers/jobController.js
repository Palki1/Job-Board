import Job from "../models/Job.js";
import Application from "../models/Application.js";

// @desc    Get all jobs (search, filter, paginate) + featured jobs for home page
// @route   GET /api/jobs
// @access  Public
export const getJobs = async (req, res, next) => {
  try {
    const {
      keyword,
      location,
      category,
      employmentType,
      workType,
      experienceLevel,
      featured,
      page = 1,
      limit = 10,
      sort = "-createdAt",
    } = req.query;

    const query = { status: "open" };

    if (keyword) {
      query.$text = { $search: keyword };
    }
    if (location) {
      query.location = { $regex: location, $options: "i" };
    }
    if (category) query.category = category;
    if (employmentType) query.employmentType = employmentType;
    if (workType) query.workType = workType;
    if (experienceLevel) query.experienceLevel = experienceLevel;
    if (featured === "true") query.isFeatured = true;

    const pageNum = Math.max(parseInt(page), 1);
    const limitNum = Math.min(parseInt(limit) || 10, 50);
    const skip = (pageNum - 1) * limitNum;

    const [jobs, total] = await Promise.all([
      Job.find(query)
        .populate("employer", "name companyName companyLogoUrl")
        .sort(sort)
        .skip(skip)
        .limit(limitNum),
      Job.countDocuments(query),
    ]);

    res.json({
      jobs,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
      totalResults: total,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get a single job by id (increments view count)
// @route   GET /api/jobs/:id
// @access  Public
export const getJobById = async (req, res, next) => {
  try {
    const job = await Job.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    ).populate("employer", "name companyName companyLogoUrl companyWebsite companyDescription");

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    res.json({ job });
  } catch (err) {
    next(err);
  }
};

// @desc    Create a job posting
// @route   POST /api/jobs
// @access  Private (employer)
export const createJob = async (req, res, next) => {
  try {
    const job = await Job.create({
      ...req.body,
      employer: req.user._id,
      companyName: req.body.companyName || req.user.companyName,
      companyLogoUrl: req.body.companyLogoUrl || req.user.companyLogoUrl,
    });
    res.status(201).json({ job });
  } catch (err) {
    next(err);
  }
};

// @desc    Update a job posting
// @route   PUT /api/jobs/:id
// @access  Private (employer who owns it)
export const updateJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    if (job.employer.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to edit this job" });
    }

    Object.assign(job, req.body);
    await job.save();
    res.json({ job });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete a job posting
// @route   DELETE /api/jobs/:id
// @access  Private (employer who owns it)
export const deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    if (job.employer.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to delete this job" });
    }

    await job.deleteOne();
    await Application.deleteMany({ job: job._id });
    res.json({ message: "Job deleted successfully" });
  } catch (err) {
    next(err);
  }
};

// @desc    Get jobs posted by the logged-in employer
// @route   GET /api/jobs/employer/mine
// @access  Private (employer)
export const getMyJobs = async (req, res, next) => {
  try {
    const jobs = await Job.find({ employer: req.user._id }).sort("-createdAt");
    res.json({ jobs });
  } catch (err) {
    next(err);
  }
};

// @desc    Get distinct categories/locations to power filter dropdowns
// @route   GET /api/jobs/meta/filters
// @access  Public
export const getFilterMeta = async (req, res, next) => {
  try {
    const [categories, locations] = await Promise.all([
      Job.distinct("category", { status: "open" }),
      Job.distinct("location", { status: "open" }),
    ]);
    res.json({ categories, locations });
  } catch (err) {
    next(err);
  }
};
