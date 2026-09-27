import { model } from "mongoose";
import { IJobApplication } from "../interface/jobApplication.interface";
import { EmploymentType, JobApplicationStatus, JobSource } from "../enum/jobAplicationStatus.enum";
import { Schema } from "mongoose";

const jobApplicationSchema = new Schema<IJobApplication>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    companyName: {
      type: String,
      required: true,
      trim: true,
    },

    jobTitle: {
      type: String,
      required: true,
      trim: true,
    },

    jobUrl: {
      type: String,
      trim: true,
    },

    location: {
      type: String,
      trim: true,
    },

    employmentType: {
      type: String,
      enum: Object.values(EmploymentType),
      required: true,
    },

    salary: {
      min: {
        type: Number,
        min: 0,
      },

      max: {
        type: Number,
        min: 0,
      },

      currency: {
        type: String,
        default: "NPR",
        uppercase: true,
        trim: true,
      },
    },

    status: {
      type: String,
      enum: Object.values(JobApplicationStatus),
      default: JobApplicationStatus.WISHLIST,
      required: true,
      index: true,
    },

    appliedDate: {
      type: Date,
    },

    deadline: {
      type: Date,
    },

    source: {
      type: String,
      enum: Object.values(JobSource),
    },

    notes: {
      type: String,
      trim: true,
      maxlength: 5000,
    },
  },
  {
    timestamps: true,
  },
);

export const JobApplication = model<IJobApplication>(
  "JobApplication",
  jobApplicationSchema,
);