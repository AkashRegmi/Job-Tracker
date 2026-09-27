import { z } from "zod";

export const jobApplicationStatuses = [
  "WISHLIST",
  "APPLIED",
  "SCREENING",
  "INTERVIEW",
  "ASSESSMENT",
  "OFFER",
  "REJECTED",
  "WITHDRAWN",
];

export const employmentTypes = [
  "FULL_TIME",
  "PART_TIME",
  "CONTRACT",
  "INTERNSHIP",
  "FREELANCE",
];

export const jobSources = [
  "LINKEDIN",
  "INDEED",
  "COMPANY_WEBSITE",
  "REFERRAL",
  "JOB_BOARD",
  "OTHER",
];

const optionalText = (schema) =>
  z.preprocess(
    (value) => (value === "" ? undefined : value),
    schema.optional(),
  );

const optionalDate = z.preprocess(
  (value) => (value === "" ? undefined : value),
  z.coerce.date().optional(),
);

const optionalNumber = z.preprocess(
  (value) => (value === "" || value === undefined ? undefined : Number(value)),
  z.number().min(0, "Salary cannot be negative").optional(),
);

const salarySchema = z
  .object({
    min: optionalNumber,
    max: optionalNumber,
    currency: z.string().length(3).default("NPR"),
  })
  .refine(
    (salary) =>
      salary.min === undefined ||
      salary.max === undefined ||
      salary.min <= salary.max,
    {
      message: "Minimum salary cannot be greater than maximum salary",
      path: ["min"],
    },
  );

export const jobApplicationSchema = z
  .object({
    companyName: z.string().trim().min(2, "Company name is required").max(100),
    jobTitle: z.string().trim().min(2, "Job title is required").max(150),
    jobUrl: optionalText(z.string().url("Please provide a valid job URL")),
    location: optionalText(z.string().trim().max(150)),
    employmentType: z.enum(employmentTypes),
    status: z.enum(jobApplicationStatuses),
    appliedDate: optionalDate,
    deadline: optionalDate,
    source: z.preprocess(
      (value) => (value === "" ? undefined : value),
      z.enum(jobSources).optional(),
    ),
    notes: optionalText(z.string().trim().max(5000)),
    salary: salarySchema,
  })
  .refine(
    (application) =>
      !application.appliedDate ||
      !application.deadline ||
      application.appliedDate <= application.deadline,
    {
      message: "Deadline cannot be before the applied date",
      path: ["deadline"],
    },
  );
