const logger = require('../utils/logger');
const { ResultSubmission, VerificationRequest, Course, Lecturer, Student, User, Result } = require('../models');
const emailService = require('../services/emailService');
const notificationService = require('../services/notificationService');
const calculationService = require('../services/calculationService');

class AdminController {
  /**
   * Get admin dashboard
   */
  async getDashboard(req, res, next) {
    try {
      const pendingSubmissions = await ResultSubmission.count({
        where: { status: 'pending' }
      });

      const approvedSubmissions = await ResultSubmission.count({
        where: { status: 'approved' }
      });

      const pendingVerifications = await VerificationRequest.count({
        where: { status: 'pending' }
      });

      const stats = {
        pendingSubmissions,
        approvedSubmissions,
        pendingVerifications,
        totalStudents: await Student.count(),
        totalLecturers: await Lecturer.count()
      };

      res.json({
        success: true,
        data: { stats }
      });
    } catch (error) {
      logger.error('Get admin dashboard error:', error);
      next(error);
    }
  }

  /**
   * Get all submissions
   */
  async getSubmissions(req, res, next) {
    try {
      const { status, page = 1, limit = 20 } = req.query;
      const offset = (page - 1) * limit;

      const where = {};
      if (status) where.status = status;

      const { rows: submissions, count } = await ResultSubmission.findAndCountAll({
        where,
        include: [
          { model: Course },
          { model: Lecturer, include: [User] }
        ],
        order: [['submissionDate', 'DESC']],
        limit: parseInt(limit),
        offset
      });

      res.json({
        success: true,
        data: {
          submissions,
          pagination: {
            total: count,
            page: parseInt(page),
            limit: parseInt(limit),
            totalPages: Math.ceil(count / limit)
          }
        }
      });
    } catch (error) {
      logger.error('Get submissions error:', error);
      next(error);
    }
  }

  /**
   * Approve submission
   */
  async approveSubmission(req, res, next) {
    try {
      const { id } = req.params;
      const { notes } = req.validatedBody;

      const submission = await ResultSubmission.findByPk(id, {
        include: [
          { model: Course },
          { model: Lecturer, include: [User] }
        ]
      });

      if (!submission) {
        return res.status(404).json({
          success: false,
          error: 'Submission not found'
        });
      }

      await submission.update({
        status: 'approved',
        approvedBy: req.userId,
        approvedAt: new Date(),
        notes
      });

      // Get affected students
      const results = await Result.findAll({
        where: { courseId: submission.courseId },
        include: [{ model: Student, include: [User] }]
      });

      // Send notifications and emails
      for (const result of results) {
        await notificationService.createNotification(
          result.Student.userId,
          'Results Published',
          `Your results for ${submission.Course.courseName} have been published`,
          'success',
          '/student/results'
        );

        // Update student CGPA
        await calculationService.updateStudentCGPA(result.studentId);
      }

      // Notify lecturer
      await emailService.sendSubmissionStatusEmail(
        submission.Lecturer.User.email,
        submission.Lecturer.User.firstName,
        submission.Course.courseName,
        'approved',
        notes
      );

      logger.info(`Submission approved: ${id}`);

      res.json({
        success: true,
        message: 'Submission approved successfully'
      });
    } catch (error) {
      logger.error('Approve submission error:', error);
      next(error);
    }
  }

  /**
   * Reject submission
   */
  async rejectSubmission(req, res, next) {
    try {
      const { id } = req.params;
      const { rejectionReason, notes } = req.validatedBody;

      const submission = await ResultSubmission.findByPk(id, {
        include: [
          { model: Course },
          { model: Lecturer, include: [User] }
        ]
      });

      if (!submission) {
        return res.status(404).json({
          success: false,
          error: 'Submission not found'
        });
      }

      await submission.update({
        status: 'rejected',
        approvedBy: req.userId,
        approvedAt: new Date(),
        rejectionReason,
        notes
      });

      // Notify lecturer
      await emailService.sendSubmissionStatusEmail(
        submission.Lecturer.User.email,
        submission.Lecturer.User.firstName,
        submission.Course.courseName,
        'rejected',
        rejectionReason
      );

      logger.info(`Submission rejected: ${id}`);

      res.json({
        success: true,
        message: 'Submission rejected'
      });
    } catch (error) {
      logger.error('Reject submission error:', error);
      next(error);
    }
  }

  /**
   * Get verification requests
   */
  async getVerifications(req, res, next) {
    try {
      const verifications = await VerificationRequest.findAll({
        include: [{ model: Student, include: [User] }],
        order: [['createdAt', 'DESC']]
      });

      res.json({
        success: true,
        data: verifications
      });
    } catch (error) {
      logger.error('Get verifications error:', error);
      next(error);
    }
  }
}

module.exports = new AdminController();