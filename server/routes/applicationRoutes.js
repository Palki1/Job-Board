import express from "express";
import {
  applyToJob,
  getMyApplications,
  getApplicationsForJob,
  getEmployerApplications,
  updateApplicationStatus,
} from "../controllers/applicationController.js";
import { protect, authorize } from "../middleware/auth.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.post(
  "/:jobId",
  protect,
  authorize("candidate"),
  upload.single("resume"),
  applyToJob
);
router.get("/mine", protect, authorize("candidate"), getMyApplications);
router.get(
  "/employer/all",
  protect,
  authorize("employer", "admin"),
  getEmployerApplications
);
router.get(
  "/job/:jobId",
  protect,
  authorize("employer", "admin"),
  getApplicationsForJob
);
router.put(
  "/:id/status",
  protect,
  authorize("employer", "admin"),
  updateApplicationStatus
);

export default router;
