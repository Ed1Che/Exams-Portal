// src/api/admin.js
import api from './axios';

const adminAPI = {
  // Get dashboard data
  getDashboard: async () => {
    const response = await api.get('/admin/dashboard');
    return response.data;
  },

  // Get all submissions
  getSubmissions: async (filters = {}) => {
    const { status, page = 1, limit = 20 } = filters;
    const params = new URLSearchParams();
    
    if (status) params.append('status', status);
    params.append('page', page);
    params.append('limit', limit);
    
    const response = await api.get(`/admin/submissions?${params.toString()}`);
    return response.data;
  },

  // Approve a submission
  approveSubmission: async (submissionId, notes = '') => {
    const response = await api.put(`/admin/submissions/${submissionId}/approve`, {
      notes,
    });
    return response.data;
  },

  // Reject a submission
  rejectSubmission: async (submissionId, rejectionReason, notes = '') => {
    const response = await api.put(`/admin/submissions/${submissionId}/reject`, {
      rejectionReason,
      notes,
    });
    return response.data;
  },

  // Get all verification requests
  getVerifications: async () => {
    const response = await api.get('/admin/verifications');
    return response.data;
  },
};

export default adminAPI;
