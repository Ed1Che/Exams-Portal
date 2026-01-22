const fileService = require('../services/fileService');
const emailService = require('../services/emailService');
const notificationService = require('../services/notificationService');
const { ResultSubmission, CourseEnrollment } = require('../models');
const logger = require('../utils/logger');
const { Lecturer, Course, Student, User, Result } = require('../models');

class LecturerController {
  /**
   * Get lecturer dashboard
   */
  async getDashboard(req, res, next) {
    try {
      const lecturer = await Lecturer.findOne({
        where: { userId: req.userId },
        include: [{ model: User }]
      });

      const courses = await Course.findAll({
        where: { lecturerId: lecturer.id, isActive: true }
      });

      const submissions = await ResultSubmission.findAll({
        where: { lecturerId: lecturer.id },
        include: [{ model: Course }],
        order: [['submissionDate', 'DESC']],
        limit: 10
      });

      const stats = {
        totalCourses: courses.length,
        pendingSubmissions: await ResultSubmission.count({
          where: { lecturerId: lecturer.id, status: 'pending' }
        }),
        approvedSubmissions: await ResultSubmission.count({
          where: { lecturerId: lecturer.id, status: 'approved' }
        })
      };

      res.json({
        success: true,
        data: { lecturer, courses, submissions, stats }
      });
    } catch (error) {
      logger.error('Get lecturer dashboard error:', error);
      next(error);
    }
  }

  /**
   * Get all courses
   */
  async getCourses(req, res, next) {
    try {
      const lecturer = await Lecturer.findOne({ where: { userId: req.userId } });

      const courses = await Course.findAll({
        where: { lecturerId: lecturer.id },
        include: [{
          model: ResultSubmission,
          as: 'ResultSubmissions'
        }]
      });

      res.json({
        success: true,
        data: courses
      });
    } catch (error) {
      logger.error('Get courses error:', error);
      next(error);
    }
  }

  /**
   * Create course
   */
  async createCourse(req, res, next) {
    try {
      const lecturer = await Lecturer.findOne({ where: { userId: req.userId } });

      const course = await Course.create({
        ...req.validatedBody,
        lecturerId: lecturer.id
      });

      logger.info(`Course created: ${course.courseCode}`);

      res.status(201).json({
        success: true,
        message: 'Course created successfully',
        data: course
      });
    } catch (error) {
      logger.error('Create course error:', error);
      next(error);
    }
  }

  /**
   * Upload results
   */
  async uploadResults(req, res, next) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: 'No file uploaded'
        });
      }

      const { courseId, priority, notes } = req.validatedBody;
      const lecturer = await Lecturer.findOne({ where: { userId: req.userId } });

      // Verify course belongs to lecturer
      const course = await Course.findOne({
        where: { id: courseId, lecturerId: lecturer.id }
      });

      if (!course) {
        return res.status(404).json({
          success: false,
          error: 'Course not found or access denied'
        });
      }

      // Parse the uploaded file
      const parsedResults = await fileService.parseResultsFile(req.file.path);

      // Get enrolled students
      const enrollments = await CourseEnrollment.findAll({
        where: { courseId },
        include: [{ model: Student, include: [User] }]
      });

      // Create submission record
      const submission = await ResultSubmission.create({
        courseId,
        lecturerId: lecturer.id,
        filePath: req.file.path,
        fileName: req.file.originalname,
        fileSize: req.file.size,
        status: 'pending',
        priority: priority || 'normal',
        totalStudents: parsedResults.length,
        notes
      });

      // Process results
      for (const resultData of parsedResults) {
        const enrollment = enrollments.find(e => 
          e.Student.studentId === resultData.studentId
        );

        if (enrollment) {
          await Result.upsert({
            studentId: enrollment.studentId,
            courseId,
            score: resultData.score,
            grade: resultData.grade,
            gradePoint: resultData.gradePoint,
            remarks: resultData.remarks
          });
        }
      }

      logger.info(`Results uploaded for course: ${course.courseCode}`);

      res.status(201).json({
        success: true,
        message: 'Results uploaded successfully and pending approval',
        data: submission
      });
    } catch (error) {
      logger.error('Upload results error:', error);
      next(error);
    }
  }

  /**
   * Get submissions
   */
  async getSubmissions(req, res, next) {
    try {
      const { status } = req.query;
      const lecturer = await Lecturer.findOne({ where: { userId: req.userId } });

      const where = { lecturerId: lecturer.id };
      if (status) where.status = status;

      const submissions = await ResultSubmission.findAll({
        where,
        include: [{ model: Course }],
        order: [['submissionDate', 'DESC']]
      });

      res.json({
        success: true,
        data: submissions
      });
    } catch (error) {
      logger.error('Get submissions error:', error);
      next(error);
    }
  }

  /**
   * Download template
   */
  async downloadTemplate(req, res, next) {
    try {
      const { courseId } = req.query;
      const lecturer = await Lecturer.findOne({ where: { userId: req.userId } });

      const course = await Course.findOne({
        where: { id: courseId, lecturerId: lecturer.id }
      });

      if (!course) {
        return res.status(404).json({
          success: false,
          error: 'Course not found'
        });
      }

      const enrollments = await CourseEnrollment.findAll({
        where: { courseId },
        include: [{ model: Student, include: [User] }]
      });

      const { fileName, filePath } = await fileService.generateTemplate(
        course.courseCode,
        enrollments.map(e => e.Student)
      );

      res.download(filePath, fileName);
    } catch (error) {
      logger.error('Download template error:', error);
      next(error);
    }
  }
}

module.exports = new LecturerController();