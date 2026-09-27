import { NextFunction, Request, Response } from "express";
import { sendSuccess, sendSuccessWithPagination } from "../utils/response";
import {
  createJobApplication,
  deleteJobApplication,
  getAllJobApplication,
  getJobApplicationById,
  getJobApplicationDashboard,
  updateJobApplication,
  updateJobApplicationStatus,
} from "../services/jobApplication.service";
import {
  createJobApplicationSchema,
  updateJobApplicationSchema,
  updateJobApplicationStatusSchema,
} from "../validators/jobApplication.validation";
import {
  IJobApplication,
  IJobApplicationQuery,
  IJobDashboardQuery,
} from "../interface/jobApplication.interface";
import {
  EmploymentType,
  JobApplicationStatus,
  JobSource,
} from "../enum/jobAplicationStatus.enum";
export const createJobApplicationController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user.userId;
    const validatedData = createJobApplicationSchema.parse(req.body);

    const jobApplication = await createJobApplication(userId, validatedData);

    sendSuccess(res, 201, "Job application created successfully.", {
      jobApplicationId: jobApplication?._id,
    });
  } catch (error) {
    throw error;
  }
};
export const getJobApplicationByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user.userId;

    const { applicationId } = req.params;

    const application = await getJobApplicationById(
      userId,
      applicationId as string,
    );

    sendSuccess(
      res,
      200,
      "Job application retrieved successfully.",
      application,
    );
  } catch (error) {
    next(error);
  }
};
export const updateJobApplicationController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user.userId;

    const { applicationId } = req.params;

    const validatedData = updateJobApplicationSchema.parse(req.body);

    const application = await updateJobApplication(
      userId,
      applicationId as string,
      validatedData as Partial<IJobApplication>,
    );

    sendSuccess(res, 200, "Job application updated successfully.", application);
  } catch (error) {
    next(error);
  }
};

export const updateJobApplicationStatusController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user.userId;
    const { applicationId } = req.params;
    const { status } = updateJobApplicationStatusSchema.parse(req.body);

    const application = await updateJobApplicationStatus(
      userId,
      applicationId as string,
      status,
    );

    sendSuccess(
      res,
      200,
      "Job application status updated successfully.",
      application,
    );
  } catch (error) {
    next(error);
  }
};
export const deleteJobApplicationController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user.userId;

    const { applicationId } = req.params;

    await deleteJobApplication(userId, applicationId as string);

    sendSuccess(res, 200, "Job application deleted successfully.", null);
  } catch (error) {
    next(error);
  }
};
export const getAllJobApplicationController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user.userId;
    const {
      page,
      limit,
      search,
      status,
      employmentType,
      source,
      startDate,
      endDate,
    } = req.query;
    const result = await getAllJobApplication(userId, {
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      search: search as string | undefined,
      status: status as JobApplicationStatus | undefined,
      employmentType: employmentType as EmploymentType | undefined,
      source: source as JobSource | undefined,
      startDate: startDate as string | undefined,
      endDate: endDate as string | undefined,
    } as IJobApplicationQuery);
    return sendSuccessWithPagination(
      res,
      200,
      "JobApplication fetch successfully",
      result.page,
      result.limit,
      result.totalPages,
      result.application,
    );
  } catch (error) {
    next(error);
  }
};

export const getJobApplicationDashboardController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user.userId;

    const { startDate, endDate } = req.query;

    const dashboard = await getJobApplicationDashboard(userId, {
      startDate: startDate as string | undefined,
      endDate: endDate as string | undefined,
    } as IJobDashboardQuery);

    return sendSuccess(
      res,
      200,
      "Job application dashboard retrieved successfully.",
      dashboard,
    );
  } catch (error) {
    throw error;
  }
};
