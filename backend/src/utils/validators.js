const Joi = require('joi');

// Authentication validators
const registerValidator = Joi.object({
  username: Joi.string().min(3).max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string()
    .min(8)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .required()
    .messages({
      'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    }),
  role: Joi.string().valid('student', 'lecturer', 'admin').required(),
  firstName: Joi.string().max(100).required(),
  lastName: Joi.string().max(100).required(),
  // Student specific
  studentId: Joi.when('role', {
    is: 'student',
    then: Joi.string().required(),
    otherwise: Joi.forbidden()
  }),
  program: Joi.when('role', {
    is: 'student',
    then: Joi.string().required(),
    otherwise: Joi.forbidden()
  }),
  department: Joi.string().when('role', {
    is: Joi.valid('student', 'lecturer'),
    then: Joi.required(),
    otherwise: Joi.forbidden()
  }),
  // Lecturer specific
  staffId: Joi.when('role', {
    is: 'lecturer',
    then: Joi.string().required(),
    otherwise: Joi.forbidden()
  }),
  title: Joi.when('role', {
    is: 'lecturer',
    then: Joi.string().optional(),
    otherwise: Joi.forbidden()
  })
});

const loginValidator = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
  role: Joi.string().valid('student', 'lecturer', 'admin').required()
});

const changePasswordValidator = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: Joi.string()
    .min(8)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .required()
    .messages({
      'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    }),
  confirmPassword: Joi.string().valid(Joi.ref('newPassword')).required()
    .messages({
      'any.only': 'Passwords do not match'
    })
});

// Course validators
const createCourseValidator = Joi.object({
  courseCode: Joi.string().max(20).required(),
  courseName: Joi.string().max(200).required(),
  department: Joi.string().max(100).required(),
  credits: Joi.number().integer().min(1).max(6).required(),
  semester: Joi.string().max(50).required(),
  academicYear: Joi.string().max(20).required(),
  description: Joi.string().optional()
});

const updateCourseValidator = Joi.object({
  courseName: Joi.string().max(200).optional(),
  department: Joi.string().max(100).optional(),
  credits: Joi.number().integer().min(1).max(6).optional(),
  semester: Joi.string().max(50).optional(),
  academicYear: Joi.string().max(20).optional(),
  description: Joi.string().optional(),
  isActive: Joi.boolean().optional()
});

// Result submission validators
const createSubmissionValidator = Joi.object({
  courseId: Joi.number().integer().required(),
  priority: Joi.string().valid('low', 'normal', 'medium', 'high', 'urgent').optional(),
  notes: Joi.string().optional()
});

const updateSubmissionValidator = Joi.object({
  status: Joi.string().valid('draft', 'pending').optional(),
  priority: Joi.string().valid('low', 'normal', 'medium', 'high', 'urgent').optional(),
  notes: Joi.string().optional()
});

const approveSubmissionValidator = Joi.object({
  notes: Joi.string().optional()
});

const rejectSubmissionValidator = Joi.object({
  rejectionReason: Joi.string().required(),
  notes: Joi.string().optional()
});

// Verification request validators
const createVerificationValidator = Joi.object({
  studentId: Joi.number().integer().required(),
  institutionName: Joi.string().max(255).required(),
  institutionEmail: Joi.string().email().optional(),
  institutionContact: Joi.string().max(50).optional(),
  requestType: Joi.string().valid('employment', 'admission', 'scholarship', 'other').required(),
  purpose: Joi.string().required(),
  priority: Joi.string().valid('normal', 'urgent').optional()
});

const processVerificationValidator = Joi.object({
  status: Joi.string().valid('processing', 'completed', 'rejected').required(),
  notes: Joi.string().optional()
});

// Profile update validators
const updateStudentProfileValidator = Joi.object({
  firstName: Joi.string().max(100).optional(),
  lastName: Joi.string().max(100).optional(),
  email: Joi.string().email().optional(),
  program: Joi.string().max(100).optional(),
  academicYear: Joi.string().max(20).optional()
});

const updateLecturerProfileValidator = Joi.object({
  firstName: Joi.string().max(100).optional(),
  lastName: Joi.string().max(100).optional(),
  email: Joi.string().email().optional(),
  title: Joi.string().max(50).optional(),
  specialization: Joi.string().max(200).optional()
});

module.exports = {
  registerValidator,
  loginValidator,
  changePasswordValidator,
  createCourseValidator,
  updateCourseValidator,
  createSubmissionValidator,
  updateSubmissionValidator,
  approveSubmissionValidator,
  rejectSubmissionValidator,
  createVerificationValidator,
  processVerificationValidator,
  updateStudentProfileValidator,
  updateLecturerProfileValidator
};
