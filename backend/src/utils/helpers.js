const { GRADE_RANGES, GRADE_POINTS } = require('./constants');

/**
 * Calculate grade from score
 */
const calculateGrade = (score) => {
  for (const [grade, range] of Object.entries(GRADE_RANGES)) {
    if (score >= range.min && score <= range.max) {
      return grade;
    }
  }
  return 'F';
};

/**
 * Calculate GPA from results
 */
const calculateGPA = (results) => {
  if (!results || results.length === 0) return 0;

  let totalPoints = 0;
  let totalCredits = 0;

  results.forEach(result => {
    const gradePoint = GRADE_POINTS[result.grade] || 0;
    const credits = result.Course?.credits || 0;
    totalPoints += gradePoint * credits;
    totalCredits += credits;
  });

  return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : 0;
};

/**
 * Calculate CGPA from all semesters
 */
const calculateCGPA = (semesterGPAs) => {
  if (!semesterGPAs || semesterGPAs.length === 0) return 0;
  
  const total = semesterGPAs.reduce((sum, gpa) => sum + parseFloat(gpa), 0);
  return (total / semesterGPAs.length).toFixed(2);
};

/**
 * Generate verification code
 */
const generateVerificationCode = () => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `VER-${timestamp}-${random}`.toUpperCase();
};

/**
 * Format file size
 */
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

/**
 * Sanitize filename
 */
const sanitizeFilename = (filename) => {
  return filename.replace(/[^a-zA-Z0-9.-]/g, '_');
};

/**
 * Generate pagination metadata
 */
const getPaginationMeta = (page, limit, total) => {
  const totalPages = Math.ceil(total / limit);
  return {
    currentPage: page,
    totalPages,
    totalItems: total,
    itemsPerPage: limit,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1
  };
};

module.exports = {
  calculateGrade,
  calculateGPA,
  calculateCGPA,
  generateVerificationCode,
  formatFileSize,
  sanitizeFilename,
  getPaginationMeta
};
