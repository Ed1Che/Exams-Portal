// src/api/lecturer.js
import api from './axios';

const lecturerAPI = {
  // Get dashboard data
  getDashboard: async () => {
    const response = await api.get('/lecturer/dashboard');
    return response.data;
  },

  // Get all courses
  getCourses: async () => {
    const response = await api.get('/lecturer/courses');
    return response.data;
  },

  // Create new course
  createCourse: async (courseData) => {
    const response = await api.post('/lecturer/courses', courseData);
    return response.data;
  },

  // Update course
  updateCourse: async (courseId, courseData) => {
    const response = await api.put(`/lecturer/courses/${courseId}`, courseData);
    return response.data;
  },

  // Delete course
  deleteCourse: async (courseId) => {
    const response = await api.delete(`/lecturer/courses/${courseId}`);
    return response.data;
  },

  // Upload results file
  uploadResults: async (formData) => {
    const response = await api.post('/lecturer/results/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Get submissions
  getSubmissions: async (status = null) => {
    const params = status ? `?status=${status}` : '';
    const response = await api.get(`/lecturer/submissions${params}`);
    return response.data;
  },

  // Get specific submission
  getSubmission: async (submissionId) => {
    const response = await api.get(`/lecturer/submissions/${submissionId}`);
    return response.data;
  },

  // Update submission
  updateSubmission: async (submissionId, updateData) => {
    const response = await api.put(`/lecturer/submissions/${submissionId}`, updateData);
    return response.data;
  },

  // Delete submission
  deleteSubmission: async (submissionId) => {
    const response = await api.delete(`/lecturer/submissions/${submissionId}`);
    return response.data;
  },

  // Download results template
  downloadTemplate: async (courseId) => {
    const response = await api.get(`/lecturer/results/template?courseId=${courseId}`, {
      responseType: 'blob',
    });
    
    // Create download link
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `results_template_${courseId}.xlsx`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    
    return response.data;
  },

  // Get course statistics
  getCourseStats: async (courseId) => {
    const response = await api.get(`/lecturer/courses/${courseId}/stats`);
    return response.data;
  },

  // Get enrolled students for a course
  getEnrolledStudents: async (courseId) => {
    const response = await api.get(`/lecturer/courses/${courseId}/students`);
    return response.data;
  },
};

export default lecturerAPI;