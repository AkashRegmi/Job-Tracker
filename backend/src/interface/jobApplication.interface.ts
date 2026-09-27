import { Types } from "mongoose";
import {
  EmploymentType,
  JobApplicationStatus,
  JobSource,
} from "../enum/jobAplicationStatus.enum";

export interface IJobApplication {
  user: Types.ObjectId;

  companyName: string;
  jobTitle: string;
  jobUrl?: string;

  location?: string;

  employmentType: EmploymentType;

  salary?: {
    min?: number;
    max?: number;
    currency?: string;
  };

  status: JobApplicationStatus;

  appliedDate?: Date;
  deadline?: Date;

  source?: JobSource;

  notes?: string;
}
export interface IJobApplicationQuery {
  page?: number;
  limit?: number;
  search?: string;
  status?: JobApplicationStatus;
  employmentType?: EmploymentType;
  source?: JobSource;
  startDate?: string;
  endDate?: string;
}
export interface IJobDashboardQuery {
  startDate?: string;
  endDate?: string;
}
