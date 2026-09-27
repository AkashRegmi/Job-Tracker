import z from "zod";
import {
  EmploymentType,
  JobApplicationStatus,
  JobSource,
} from "../enum/jobAplicationStatus.enum";
const salarySchema = z
  .object({
    min: z.number().min(0, "Minimum salary cannot be negative").optional(),

    max: z.number().min(0, "Maximum salary cannot be negative").optional(),

    currency: z
      .string()
      .trim()
      .length(3, "Currency must be a 3-letter code")
      .optional(),
  })
  .refine(
    (data) =>
      data.min === undefined || data.max === undefined || data.min <= data.max,
    {
      message: "Minimum salary cannot be greater than maximum salary",
      path: ["min"],
    },
  );
export const createJobApplicationSchema = z.object({
  companyName: z
    .string("Company name is required")
    .trim()
    .min(2, "Company name must be at least 2 characters")
    .max(100, "Company name cannot exceed 100 characters"),

  jobTitle: z
    .string("job title is required ")
    .trim()
    .min(2, "Job title must be at least 2 characters")
    .max(150, "Job title cannot exceed 150 characters"),

  jobUrl: z
    .string("Job url is required")
    .trim()
    .url("Please provide a valid job URL")
    .optional(),

  location: z
    .string()
    .trim()
    .max(150, "Location cannot exceed 150 characters")
    .optional(),

  employmentType: z.enum(EmploymentType, {
    message: "Please provide the valid employment types ",
  }),

  salary: salarySchema.optional(),

  status: z
    .enum(JobApplicationStatus, {
      message: "please provide the valid job application status",
    })
    .default(JobApplicationStatus.WISHLIST),

  appliedDate: z.coerce.date().optional(),

  deadline: z.coerce.date().optional(),

  source: z
    .enum(JobSource, {
      message: "Please provide the valid job source",
    })
    .optional(),

  notes: z
    .string()
    .trim()
    .max(5000, "Notes cannot exceed 5000 characters")
    .optional(),
});

export const updateJobApplicationSchema = createJobApplicationSchema.partial();

export const updateJobApplicationStatusSchema = z.object({
  status: z.enum(JobApplicationStatus, {
    message: "Please provide a valid job application status",
  }),
});
