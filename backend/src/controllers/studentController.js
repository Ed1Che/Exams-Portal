const { Student, User, Result, Course, Lecturer, Notification } = require('../models');
const calculationService = require('../services/calculationService');
const logger = require('../utils/logger');
const { Op } = require('sequelize');

class StudentController {
  /**
   * Get student dashboard data
   */
  async getDashboard(req, res, next) {
    try {
      const student = await Student.findOne({
        where: { userId: req.userId },
        include: [{ model: User }]
      });

      const currentYear = new Date().getFullYear();
      const semester = 'Spring'; // This should be dynamic

      // Get current semester results
      const results = await Result.findAll({
        where: { studentId: student.id },
        include: [{
          model: Course,
          where: { academicYear: currentYear.toString(), semester },
          include: [{ model: Lecturer, include: [User] }]
        }]
      });

      // Calculate statistics
      const semesterGPA = await calculationService.calculateSemesterGPA(
        student.id, semester, currentYear.toString()
      );

      const gpaTrend = await calculationService.getGPATrend(student.id);

      res.json({
        success: true,
        data: {
          student,
          currentSemester: { semester, academicYear: currentYear.toString() },
          results,
          stats: {
            currentGPA: semesterGPA,
            cgpa: student.cgpa,
            totalCourses: results.length,
            completedCourses: results.length
          },
          gpaTrend
        }
      });
    } catch (error) {
      logger.error('Get dashboard error:', error);
      next(error);
    }
  }

  /**
   * Get all results
   */
  async getResults(req, res, next) {
    try {
      const { semester, academicYear } = req.query;
      
      const student = await Student.findOne({ where: { userId: req.userId } });

      const where = { studentId: student.id };
      const courseWhere = {};

      if (semester) courseWhere.semester = semester;
      if (academicYear) courseWhere.academicYear = academicYear;

      const results = await Result.findAll({
        where,
        include: [{
          model: Course,
          where: Object.keys(courseWhere).length > 0 ? courseWhere : undefined,
          include: [{ model: Lecturer, include: [User] }]
        }],
        order: [[Course, 'semester', 'DESC'], [Course, 'academicYear', 'DESC']]
      });

      res.json({
        success: true,
        data: results
      });
    } catch (error) {
      logger.error('Get results error:', error);
      next(error);
    }
  }

  /**
   * Get specific course result
   */
  async getCourseResult(req, res, next) {
    try {
      const { courseId } = req.params;
      const student = await Student.findOne({ where: { userId: req.userId } });

      const result = await Result.findOne({
        where: { studentId: student.id, courseId },
        include: [{
          model: Course,
          include: [{ model: Lecturer, include: [User] }]
        }]
      });

      if (!result) {
        return res.status(404).json({
          success: false,
          error: 'Result not found'
        });
      }

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      logger.error('Get course result error:', error);
      next(error);
    }
  }

  /**
   * Get transcript
   */
  async getTranscript(req, res, next) {
    try {
      const student = await Student.findOne({
        where: { userId: req.userId },
        include: [{ model: User }]
      });

      const results = await Result.findAll({
        where: { studentId: student.id },
        include: [{
          model: Course,
          include: [{ model: Lecturer, include: [User] }]
        }],
        order: [[Course, 'academicYear', 'ASC'], [Course, 'semester', 'ASC']]
      });

      // Group by semester
      const semesters = {};
      results.forEach(result => {
        const key = `${result.Course.semester} ${result.Course.academicYear}`;
        if (!semesters[key]) {
          semesters[key] = [];
        }
        semesters[key].push(result);
      });

      res.json({
        success: true,
        data: {
          student,
          semesters,
          cgpa: student.cgpa,
          totalCredits: results.reduce((sum, r) => sum + r.Course.credits, 0)
        }
      });
    } catch (error) {
      logger.error('Get transcript error:', error);
      next(error);
    }
  }

  /**
   * Get notifications
   */
  async getNotifications(req, res, next) {
    try {
      const notifications = await Notification.findAll({
        where: { userId: req.userId },
        order: [['createdAt', 'DESC']],
        limit: 50
      });

      const unreadCount = await Notification.count({
        where: { userId: req.userId, isRead: false }
      });

      res.json({
        success: true,
        data: {
          notifications,
          unreadCount
        }
      });
    } catch (error) {
      logger.error('Get notifications error:', error);
      next(error);
    }
  }

  /**
   * Mark notification as read
   */
  async markNotificationRead(req, res, next) {
    try {
      const { id } = req.params;

      const updated = await Notification.update(
        { isRead: true },
        { where: { id, userId: req.userId } }
      );

      if (updated[0] === 0) {
        return res.status(404).json({
          success: false,
          error: 'Notification not found'
        });
      }

      res.json({
        success: true,
        message: 'Notification marked as read'
      });
    } catch (error) {
      logger.error('Mark notification read error:', error);
      next(error);
    }
  }
}

module.exports = new StudentController();