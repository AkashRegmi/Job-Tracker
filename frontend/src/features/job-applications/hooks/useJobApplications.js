import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createJobApplication,
  deleteJobApplication,
  getJobApplication,
  getJobApplicationDashboard,
  getJobApplications,
  updateJobApplication,
  updateJobApplicationStatus,
} from "../api/jobApplications.api";

const applicationsKey = ["job-applications"];

export function useJobApplications(params) {
  return useQuery({
    queryKey: [...applicationsKey, params],
    queryFn: () => getJobApplications(params),
  });
}

export function useJobApplication(applicationId) {
  return useQuery({
    queryKey: [...applicationsKey, applicationId],
    queryFn: () => getJobApplication(applicationId),
    enabled: Boolean(applicationId),
  });
}

export function useJobApplicationDashboard(params) {
  return useQuery({
    queryKey: ["job-application-dashboard", params],
    queryFn: () => getJobApplicationDashboard(params),
  });
}

function invalidateApplications(queryClient) {
  return Promise.all([
    queryClient.invalidateQueries({ queryKey: applicationsKey }),
    queryClient.invalidateQueries({ queryKey: ["job-application-dashboard"] }),
  ]);
}

export function useCreateJobApplication() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createJobApplication,
    onSuccess: () => invalidateApplications(queryClient),
  });
}

export function useUpdateJobApplication() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateJobApplication,
    onSuccess: () => invalidateApplications(queryClient),
  });
}

export function useUpdateJobApplicationStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateJobApplicationStatus,
    onSuccess: () => invalidateApplications(queryClient),
  });
}

export function useDeleteJobApplication() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteJobApplication,
    onSuccess: () => invalidateApplications(queryClient),
  });
}
