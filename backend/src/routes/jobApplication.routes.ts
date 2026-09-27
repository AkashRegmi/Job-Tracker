import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import {
  createJobApplicationSchema,
  updateJobApplicationSchema,
  updateJobApplicationStatusSchema,
} from "../validators/jobApplication.validation";
import {
  createJobApplicationController,
  deleteJobApplicationController,
  getAllJobApplicationController,
  getJobApplicationByIdController,
  getJobApplicationDashboardController,
  updateJobApplicationController,
  updateJobApplicationStatusController,
} from "../controller/jobApplication.controller";

const router = Router();
router.post(
  "/",
  authMiddleware,
  validate(createJobApplicationSchema),
  createJobApplicationController,
);
router.get("/dashboard", authMiddleware, getJobApplicationDashboardController);
router.get("/", authMiddleware, getAllJobApplicationController);
router.get("/:applicationId", authMiddleware, getJobApplicationByIdController);
router.put(
  "/:applicationId",
  authMiddleware,
  validate(updateJobApplicationSchema),
  updateJobApplicationController,
);
router.patch(
  "/:applicationId/status",
  authMiddleware,
  validate(updateJobApplicationStatusSchema),
  updateJobApplicationStatusController,
);
router.delete(
  "/:applicationId",
  authMiddleware,
  deleteJobApplicationController,
);

export default router;
