import Application from "../models/Application.js";
import Job from "../models/Job.js";
import {
  sendEmail,
  applicationConfirmationEmail,
  newApplicantEmail,
  applicationStatusUpdateEmail,
} from "../utils/sendEmail.js";

// @desc    Apply to a job (with resume upload)
// @route   POST /api/applications/:jobId
// @access  Private (candidate)
export const applyToJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.jobId).populate("employer", "name email");
    if (!job) return res.status(404).json({ message: "Job not found" });
    if (job.status !== "open") {
      return res.status(400).json({ message: "This job is no longer accepting applications" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Resume file is required" });
    }

    const alreadyApplied = await Application.findOne({
      job: job._id,
      candidate: req.user._id,
    });
    if (alreadyApplied) {
      return res.status(400).json({ message: "You have already applied to this job" });
    }

    const { fullName, email, phone, coverLetter } = req.body;

    const application = await Application.create({
      job: job._id,
      candidate: req.user._id,
      employer: job.employer._id,
      fullName: fullName || req.user.name,
      email: email || req.user.email,
      phone: phone || req.user.phone,
      coverLetter,
      resumeUrl: `/uploads/resumes/${req.file.filename}`,
      resumeOriginalName: req.file.originalname,
    });

    job.applicantsCount += 1;
    await job.save();

    // Fire-and-forget email notifications
    const confirmation = applicationConfirmationEmail(
      application.fullName,
      job.title,
      job.companyName
    );
    sendEmail({ to: application.email, ...confirmation });

    const employerNotice = newApplicantEmail(
      job.employer.name,
      job.title,
      application.fullName
    );
    sendEmail({ to: job.employer.email, ...employerNotice });

    res.status(201).json({ application });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: "You have already applied to this job" });
    }
    next(err);
  }
};

// @desc    Get all applications submitted by the logged-in candidate
// @route   GET /api/applications/mine
// @access  Private (candidate)
export const getMyApplications = async (req, res, next) => {
  try {
    const applications = await Application.find({ candidate: req.user._id })
      .populate("job", "title companyName location status employmentType")
      .sort("-createdAt");
    res.json({ applications });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all applications for a specific job (employer view)
// @route   GET /api/applications/job/:jobId
// @access  Private (employer who owns the job)
export const getApplicationsForJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });

    if (job.employer.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to view these applications" });
    }

    const applications = await Application.find({ job: req.params.jobId })
      .populate("candidate", "name email headline skills")
      .sort("-createdAt");

    res.json({ applications });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all applications across all of an employer's jobs
// @route   GET /api/applications/employer/all
// @access  Private (employer)
export const getEmployerApplications = async (req, res, next) => {
  try {
    const applications = await Application.find({ employer: req.user._id })
      .populate("job", "title")
      .populate("candidate", "name email headline")
      .sort("-createdAt");
    res.json({ applications });
  } catch (err) {
    next(err);
  }
};

// @desc    Update application status (e.g. shortlist, reject, hire)
// @route   PUT /api/applications/:id/status
// @access  Private (employer who owns the job)
export const updateApplicationStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = ["applied", "reviewed", "shortlisted", "rejected", "hired"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const application = await Application.findById(req.params.id).populate("job", "title companyName");
    if (!application) return res.status(404).json({ message: "Application not found" });

    if (application.employer.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to update this application" });
    }

    application.status = status;
    await application.save();

    const notice = applicationStatusUpdateEmail(
      application.fullName,
      application.job.title,
      application.job.companyName,
      status
    );
    sendEmail({ to: application.email, ...notice });

    res.json({ application });
  } catch (err) {
    next(err);
  }
};
