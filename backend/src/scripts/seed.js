const bcrypt = require('bcryptjs');
const {
  User,
  Student,
  Lecturer,
  Course,
  CourseEnrollment,
  Result,
  ResultSubmission,
  Notification
} = require('../models');
const sequelize = require('../config/database');
const logger = require('../utils/logger');
const { GRADE_POINTS } = require('../utils/constants');

const seed = async () => {
  try {
    logger.info('Starting database seeding...');

    // Start transaction
    const transaction = await sequelize.transaction();

    try {
      // Clear existing data (in reverse order of dependencies)
      await Notification.destroy({ where: {}, transaction });
      await Result.destroy({ where: {}, transaction });
      await CourseEnrollment.destroy({ where: {}, transaction });
      await ResultSubmission.destroy({ where: {}, transaction });
      await Course.destroy({ where: {}, transaction });
      await Student.destroy({ where: {}, transaction });
      await Lecturer.destroy({ where: {}, transaction });
      await User.destroy({ where: {}, transaction });

      logger.info('Existing data cleared');

      // ==================== CREATE USERS ====================
      
      // Admin User
      const adminUser = await User.create({
        username: 'admin001',
        email: 'admin@university.edu',
        passwordHash: 'Admin@123',
        role: 'admin',
        firstName: 'System',
        lastName: 'Administrator',
        isActive: true
      }, { transaction });

      logger.info('✅ Admin user created');

      // Lecturer Users
      const lecturer1User = await User.create({
        username: 'lect001',
        email: 'j.mwangi@university.edu',
        passwordHash: 'Lect@123',
        role: 'lecturer',
        firstName: 'James',
        lastName: 'Mwangi',
        isActive: true
      }, { transaction });

      const lecturer2User = await User.create({
        username: 'lect002',
        email: 'a.brown@university.edu',
        passwordHash: 'Lect@123',
        role: 'lecturer',
        firstName: 'Alice',
        lastName: 'Brown',
        isActive: true
      }, { transaction });

      const lecturer3User = await User.create({
        username: 'lect003',
        email: 's.davis@university.edu',
        passwordHash: 'Lect@123',
        role: 'lecturer',
        firstName: 'Sarah',
        lastName: 'Davis',
        isActive: true
      }, { transaction });

      logger.info('✅ Lecturer users created');

      // Student Users
      const studentUsers = [];
      for (let i = 1; i <= 30; i++) {
        const user = await User.create({
          username: `student${String(i).padStart(3, '0')}`,
          email: `student${i}@university.edu`,
          passwordHash: 'Student@123',
          role: 'student',
          firstName: `Student${i}`,
          lastName: `Test${i}`,
          isActive: true
        }, { transaction });
        studentUsers.push(user);
      }

      logger.info('✅ 30 Student users created');

      // ==================== CREATE LECTURERS ====================

      const lecturer1 = await Lecturer.create({
        userId: lecturer1User.id,
        staffId: 'STAFF001',
        department: 'Computer Science',
        title: 'Dr.',
        specialization: 'Machine Learning & AI'
      }, { transaction });

      const lecturer2 = await Lecturer.create({
        userId: lecturer2User.id,
        staffId: 'STAFF002',
        department: 'Mathematics',
        title: 'Prof.',
        specialization: 'Applied Mathematics'
      }, { transaction });

      const lecturer3 = await Lecturer.create({
        userId: lecturer3User.id,
        staffId: 'STAFF003',
        department: 'English',
        title: 'Dr.',
        specialization: 'Technical Communication'
      }, { transaction });

      logger.info('✅ Lecturer profiles created');

      // ==================== CREATE STUDENTS ====================

      const students = [];
      for (let i = 0; i < studentUsers.length; i++) {
        const student = await Student.create({
          userId: studentUsers[i].id,
          studentId: `2020/CS/${String(i + 1).padStart(3, '0')}`,
          program: 'Computer Science',
          department: 'Department of Computing',
          academicYear: '2024/2025',
          admissionDate: '2020-09-01',
          cgpa: 0.00
        }, { transaction });
        students.push(student);
      }

      logger.info('✅ 30 Student profiles created');

      // ==================== CREATE COURSES ====================

      const courses = [
        {
          courseCode: 'CSC 401',
          courseName: 'Artificial Intelligence',
          department: 'Computer Science',
          credits: 3,
          semester: 'Spring',
          academicYear: '2024/2025',
          lecturerId: lecturer1.id,
          description: 'Introduction to AI concepts and applications',
          isActive: true
        },
        {
          courseCode: 'CSC 403',
          courseName: 'Machine Learning',
          department: 'Computer Science',
          credits: 3,
          semester: 'Spring',
          academicYear: '2024/2025',
          lecturerId: lecturer1.id,
          description: 'Fundamentals of machine learning algorithms',
          isActive: true
        },
        {
          courseCode: 'CSC 405',
          courseName: 'Computer Security',
          department: 'Computer Science',
          credits: 3,
          semester: 'Spring',
          academicYear: '2024/2025',
          lecturerId: lecturer1.id,
          description: 'Network and system security principles',
          isActive: true
        },
        {
          courseCode: 'MTH 301',
          courseName: 'Advanced Calculus',
          department: 'Mathematics',
          credits: 4,
          semester: 'Spring',
          academicYear: '2024/2025',
          lecturerId: lecturer2.id,
          description: 'Advanced calculus and mathematical analysis',
          isActive: true
        },
        {
          courseCode: 'ENG 201',
          courseName: 'Technical Writing',
          department: 'English',
          credits: 2,
          semester: 'Spring',
          academicYear: '2024/2025',
          lecturerId: lecturer3.id,
          description: 'Professional and technical writing skills',
          isActive: true
        }
      ];

      const createdCourses = [];
      for (const courseData of courses) {
        const course = await Course.create(courseData, { transaction });
        createdCourses.push(course);
      }

      logger.info('✅ 5 Courses created');

      // ==================== CREATE ENROLLMENTS ====================

      let enrollmentCount = 0;
      for (const student of students) {
        for (const course of createdCourses) {
          await CourseEnrollment.create({
            studentId: student.id,
            courseId: course.id,
            enrollmentDate: '2024-09-01',
            status: 'active'
          }, { transaction });
          enrollmentCount++;
        }
      }

      logger.info(`✅ ${enrollmentCount} Course enrollments created`);

      // ==================== CREATE RESULTS ====================

      const gradeOptions = ['A', 'A-', 'B+', 'B', 'B-', 'C+', 'C'];
      let resultCount = 0;

      for (const student of students) {
        for (const course of createdCourses) {
          // Generate random score
          const minScore = 60;
          const maxScore = 100;
          const score = Math.floor(Math.random() * (maxScore - minScore + 1)) + minScore;
          
          // Determine grade based on score
          let grade;
          if (score >= 90) grade = 'A';
          else if (score >= 85) grade = 'A-';
          else if (score >= 80) grade = 'B+';
          else if (score >= 75) grade = 'B';
          else if (score >= 70) grade = 'B-';
          else if (score >= 65) grade = 'C+';
          else grade = 'C';

          await Result.create({
            studentId: student.id,
            courseId: course.id,
            score: score,
            grade: grade,
            gradePoint: GRADE_POINTS[grade],
            remarks: score >= 70 ? 'Good performance' : 'Satisfactory'
          }, { transaction });
          resultCount++;
        }
      }

      logger.info(`✅ ${resultCount} Results created`);

      // ==================== UPDATE STUDENT CGPAs ====================

      for (const student of students) {
        const studentResults = await Result.findAll({
          where: { studentId: student.id },
          include: [{ model: Course, attributes: ['credits'] }],
          transaction
        });

        let totalPoints = 0;
        let totalCredits = 0;

        studentResults.forEach(result => {
          totalPoints += result.gradePoint * result.Course.credits;
          totalCredits += result.Course.credits;
        });

        const cgpa = totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : 0.00;

        await Student.update(
          { cgpa },
          { where: { id: student.id }, transaction }
        );
      }

      logger.info('✅ Student CGPAs calculated and updated');

      // ==================== CREATE RESULT SUBMISSIONS ====================

      const submissions = [
        {
          courseId: createdCourses[0].id,
          lecturerId: lecturer1.id,
          filePath: '/uploads/csc401_results.xlsx',
          fileName: 'CSC401_Results.xlsx',
          fileSize: 45678,
          status: 'approved',
          priority: 'normal',
          totalStudents: 30,
          approvedBy: adminUser.id,
          approvedAt: new Date(),
          notes: 'Results verified and approved'
        },
        {
          courseId: createdCourses[1].id,
          lecturerId: lecturer1.id,
          filePath: '/uploads/csc403_results.xlsx',
          fileName: 'CSC403_Results.xlsx',
          fileSize: 45890,
          status: 'pending',
          priority: 'high',
          totalStudents: 28,
          notes: 'Awaiting verification'
        },
        {
          courseId: createdCourses[2].id,
          lecturerId: lecturer1.id,
          filePath: '/uploads/csc405_results.xlsx',
          fileName: 'CSC405_Results.xlsx',
          fileSize: 46123,
          status: 'approved',
          priority: 'normal',
          totalStudents: 29,
          approvedBy: adminUser.id,
          approvedAt: new Date(),
          notes: 'Approved'
        }
      ];

      for (const submissionData of submissions) {
        await ResultSubmission.create(submissionData, { transaction });
      }

      logger.info('✅ Result submissions created');

      // ==================== CREATE NOTIFICATIONS ====================

      // Create notifications for first 5 students
      for (let i = 0; i < 5; i++) {
        await Notification.create({
          userId: studentUsers[i].id,
          title: 'Results Published',
          message: 'Your examination results have been published. Log in to view.',
          type: 'success',
          isRead: false,
          link: '/student/results'
        }, { transaction });

        await Notification.create({
          userId: studentUsers[i].id,
          title: 'Welcome to Portal',
          message: 'Welcome to the University Examination Results Portal.',
          type: 'info',
          isRead: true,
          link: '/student/dashboard'
        }, { transaction });
      }

      logger.info('✅ Notifications created');

      // Commit transaction
      await transaction.commit();

      logger.info('');
      logger.info('========================================');
      logger.info('✅ DATABASE SEEDING COMPLETED SUCCESSFULLY');
      logger.info('========================================');
      logger.info('');
      logger.info('📊 Summary:');
      logger.info(`   - Users: ${studentUsers.length + 4} (1 admin, 3 lecturers, ${studentUsers.length} students)`);
      logger.info(`   - Courses: ${createdCourses.length}`);
      logger.info(`   - Enrollments: ${enrollmentCount}`);
      logger.info(`   - Results: ${resultCount}`);
      logger.info(`   - Submissions: ${submissions.length}`);
      logger.info('');
      logger.info('🔑 Login Credentials:');
      logger.info('');
      logger.info('   ADMIN:');
      logger.info('   Username: admin001');
      logger.info('   Password: Admin@123');
      logger.info('   Role: admin');
      logger.info('');
      logger.info('   LECTURER:');
      logger.info('   Username: lect001');
      logger.info('   Password: Lect@123');
      logger.info('   Role: lecturer');
      logger.info('');
      logger.info('   STUDENT:');
      logger.info('   Username: student001 to student030');
      logger.info('   Password: Student@123');
      logger.info('   Role: student');
      logger.info('');
      logger.info('========================================');

      process.exit(0);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    logger.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

// Run seeding
seed();