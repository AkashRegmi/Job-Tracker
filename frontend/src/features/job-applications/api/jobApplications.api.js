import api from "../../../lib/axios";

const basePath = "/job";

export async function getJobApplications(params = {}) {
  const response = await api.get(basePath, { params });
  return response.data;
}

export async function getJobApplication(applicationId) {
  const response = await api.get(`${basePath}/${applicationId}`);
  return response.data;
}

export async function getJobApplicationDashboard(params = {}) {
  const response = await api.get(`${basePath}/dashboard`, { params });
  return response.data;
}

export async function createJobApplication(data) {
  const response = await api.post(basePath, data);
  return response.data;
}

export async function updateJobApplication({ applicationId, data }) {
  const response = await api.put(`${basePath}/${applicationId}`, data);
  return response.data;
}

export async function updateJobApplicationStatus({ applicationId, status }) {
  const response = await api.patch(`${basePath}/${applicationId}/status`, {
    status,
  });
  return response.data;
}

export async function deleteJobApplication(applicationId) {
  const response = await api.delete(`${basePath}/${applicationId}`);
  return response.data;
}
