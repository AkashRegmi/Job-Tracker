import { JobApplicationStatus } from "../enum/jobAplicationStatus.enum";
import {
  IJobApplication,
  IJobApplicationQuery,
  IJobDashboardQuery,
} from "../interface/jobApplication.interface";
import { JobApplication } from "../models/jobApplication.model";
import { User } from "../models/user.model";
import { AppError } from "../utils/appError";
import { sendEmail } from "../utils/email";

export const createJobApplication = async (userId: string, data: any) => {
  console.log(userId);
  const jobApplication = await JobApplication.create({
    ...data,
    user: userId,
  });

  return jobApplication;
};
export const getJobApplicationById = async (
  userId: string,
  applicationId: string,
) => {
  const application = await JobApplication.findOne({
    _id: applicationId,
    user: userId,
  });

  if (!application) {
    throw new AppError("Job application not found.", 404);
  }

  return application;
};
export const updateJobApplication = async (
  userId: string,
  applicationId: string,
  data: Partial<IJobApplication>,
) => {
  const existingApplication = await JobApplication.findOne({
    _id: applicationId,
    user: userId,
  });

  if (!existingApplication) {
    throw new AppError("Job application not found.", 404);
  }

  if (
    existingApplication.status === JobApplicationStatus.OFFER &&
    data.status &&
    data.status !== JobApplicationStatus.OFFER
  ) {
    throw new AppError(
      "An offered job application cannot be moved to another status.",
      400,
    );
  }

  const statusChangedToOffer =
    data.status === JobApplicationStatus.OFFER &&
    existingApplication.status !== JobApplicationStatus.OFFER;

  Object.assign(existingApplication, data);
  const application = await existingApplication.save();

  if (statusChangedToOffer) {
    await sendOfferEmail(userId, application.companyName, application.jobTitle);
  }

  return application;
};

export const updateJobApplicationStatus = async (
  userId: string,
  applicationId: string,
  status: JobApplicationStatus,
) => {
  const existingApplication = await JobApplication.findOne({
    user: userId,
    _id: applicationId,
  });
  if (!existingApplication) {
    throw new AppError("Application not found", 400);
  }
  if (existingApplication.status === "OFFER") {
    throw new AppError(`cannot change  status OFFER to ${status}`, 400);
  }
  return updateJobApplication(userId, applicationId, { status });
};

const sendOfferEmail = async (
  userId: string,
  companyName: string,
  jobTitle: string,
) => {
  const user = await User.findById(userId).select("name email");

  if (!user) {
    throw new AppError("User not found.", 404);
  }

  await sendEmail(
    user.email,
    "Congratulations on your job offer!",
    "job.offer",
    {
      name: user.name,
      companyName,
      jobTitle,
      year: new Date().getFullYear(),
    },
  );
};
export const deleteJobApplication = async (
  userId: string,
  applicationId: string,
) => {
  const application = await JobApplication.findOneAndDelete({
    _id: applicationId,
    user: userId,
  });

  if (!application) {
    throw new AppError("Job application not found.", 404);
  }
  if (application.user.toString() === userId.toString()) {
    throw new AppError(
      "you are not allowed to delete this job application ",
      401,
    );
  }

  return application;
};
export const getAllJobApplication = async (
  userId: string,
  query: IJobApplicationQuery,
) => {
  const {
    page = 1,
    limit = 10,
    search,
    status,
    employmentType,
    source,
    startDate,
    endDate,
  } = query;
  const filter: any = { user: userId };
  if (search) {
    filter.$or = [
      {
        companyName: {
          $regex: search,
          $options: "i",
        },
      },
      {
        jobTitle: {
          $regex: search,
          $options: "i",
        },
      },
      {
        location: {
          $regex: search,
          $options: "i",
        },
      },
    ];
  }
  if (status) {
    filter.status = status;
  }
  if (employmentType) {
    filter.employmentType = employmentType;
  }
  if (source) {
    filter.source = source;
  }
  const skip = Number((page - 1) * limit);
  const [application, total] = await Promise.all([
    JobApplication.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    JobApplication.countDocuments(filter),
  ]);
  const totalPages = Math.ceil(total / limit);
  return {
    application,
    page,
    limit,
    total,
    totalPages,
  };
};
export const getJobApplicationDashboard = async (
  userId: string,
  query: IJobDashboardQuery,
) => {
  const { startDate, endDate } = query;

  const filter: Record<string, unknown> = {
    user: userId as string,
  };

  // Date filter
  if (startDate || endDate) {
    const appliedDate: Record<string, Date> = {};

    if (startDate) {
      appliedDate.$gte = new Date(startDate);
    }

    if (endDate) {
      const end = new Date(endDate);

      // Include the complete end date
      end.setHours(23, 59, 59, 999);

      appliedDate.$lte = end;
    }

    filter.appliedDate = appliedDate;
  }

  const [
    totalJobs,
    wishlist,
    applied,
    screening,
    interviews,
    assessments,
    offers,
    rejected,
    withdrawn,
    applicationTrend,
  ] = await Promise.all([
    JobApplication.countDocuments(filter),

    JobApplication.countDocuments({
      ...filter,
      status: JobApplicationStatus.WISHLIST,
    }),

    JobApplication.countDocuments({
      ...filter,
      status: JobApplicationStatus.APPLIED,
    }),

    JobApplication.countDocuments({
      ...filter,
      status: JobApplicationStatus.SCREENING,
    }),

    JobApplication.countDocuments({
      ...filter,
      status: JobApplicationStatus.INTERVIEW,
    }),

    JobApplication.countDocuments({
      ...filter,
      status: JobApplicationStatus.ASSESSMENT,
    }),

    JobApplication.countDocuments({
      ...filter,
      status: JobApplicationStatus.OFFER,
    }),

    JobApplication.countDocuments({
      ...filter,
      status: JobApplicationStatus.REJECTED,
    }),

    JobApplication.countDocuments({
      ...filter,
      status: JobApplicationStatus.WITHDRAWN,
    }),

    JobApplication.aggregate([
      { $match: filter },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: { $ifNull: ["$appliedDate", "$createdAt"] },
            },
          },
          applications: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          _id: 0,
          date: "$_id",
          applications: 1,
        },
      },
    ]),
  ]);

  return {
    totalJobs,
    wishlist,
    applied,
    screening,
    interviews,
    assessments,
    offers,
    rejected,
    withdrawn,
    applicationTrend,
  };
};
