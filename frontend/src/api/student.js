// src/api/student.js
import api from './axios';

const studentAPI = {
  // Get dashboard data
  getDashboard: async () => {
    const response = await api.get('/student/dashboard');
    return response.data;
  },

  // Get all results
  getResults: async (filters = {}) => {
    const { semester, academicYear } = filters;
    const params = new URLSearchParams();
    
    if (semester) params.append('semester', semester);
    if (academicYear) params.append('academicYear', academicYear);
    
    const response = await api.get(`/student/results?${params.toString()}`);
    return response.data;
  },

  // Get specific course result
  getCourseResult: async (courseId) => {
    const response = await api.get(`/student/results/${courseId}`);
    return response.data;
  },

  // Get transcript
  getTranscript: async () => {
    const response = await api.get('/student/transcript');
    return response.data;
  },

  // Get notifications
  getNotifications: async () => {
    const response = await api.get('/student/notifications');
    return response.data;
  },

  // Mark notification as read
  markNotificationRead: async (notificationId) => {
    const response = await api.put(`/student/notifications/${notificationId}/read`);
    return response.data;
  },

  // Download transcript as PDF
  downloadTranscript: async () => {
    const response = await api.get('/student/transcript/download', {
      responseType: 'blob',
    });
    
    // Create download link
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'transcript.pdf');
    document.body.appendChild(link);
    link.click();
    link.remove();
    
    return response.data;
  },

  // Export results to Excel
  exportResults: async (semester, academicYear) => {
    const params = new URLSearchParams();
    if (semester) params.append('semester', semester);
    if (academicYear) params.append('academicYear', academicYear);
    
    const response = await api.get(`/student/results/export?${params.toString()}`, {
      responseType: 'blob',
    });
    
    // Create download link
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `results_${semester}_${academicYear}.xlsx`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    
    return response.data;
  },
};

export default studentAPI;