const ROLES = {
  STUDENT: 'student',
  LECTURER: 'lecturer',
  ADMIN: 'admin'
};

const SUBMISSION_STATUS = {
  DRAFT: 'draft',
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected'
};

const PRIORITY_LEVELS = {
  LOW: 'low',
  NORMAL: 'normal',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent'
};

const VERIFICATION_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  REJECTED: 'rejected'
};

const VERIFICATION_TYPES = {
  EMPLOYMENT: 'employment',
  ADMISSION: 'admission',
  SCHOLARSHIP: 'scholarship',
  OTHER: 'other'
};

const GRADE_POINTS = {
  'A': 4.0,
  'A-': 3.7,
  'B+': 3.3,
  'B': 3.0,
  'B-': 2.7,
  'C+': 2.3,
  'C': 2.0,
  'C-': 1.7,
  'D+': 1.3,
  'D': 1.0,
  'F': 0.0
};

const GRADE_RANGES = {
  'A': { min: 90, max: 100 },
  'A-': { min: 85, max: 89 },
  'B+': { min: 80, max: 84 },
  'B': { min: 75, max: 79 },
  'B-': { min: 70, max: 74 },
  'C+': { min: 65, max: 69 },
  'C': { min: 60, max: 64 },
  'C-': { min: 55, max: 59 },
  'D+': { min: 50, max: 54 },
  'D': { min: 45, max: 49 },
  'F': { min: 0, max: 44 }
};

const NOTIFICATION_TYPES = {
  INFO: 'info',
  SUCCESS: 'success',
  WARNING: 'warning',
  ERROR: 'error'
};

module.exports = {
  ROLES,
  SUBMISSION_STATUS,
  PRIORITY_LEVELS,
  VERIFICATION_STATUS,
  VERIFICATION_TYPES,
  GRADE_POINTS,
  GRADE_RANGES,
  NOTIFICATION_TYPES
};