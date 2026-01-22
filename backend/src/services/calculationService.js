const { Result, Course, Student } = require('../models');
const { calculateGPA, calculateCGPA } = require('../utils/helpers');
const { Op } = require('sequelize');

class CalculationService {
  /**
   * Calculate student's semester GPA
   */
  async calculateSemesterGPA(studentId, semester, academicYear) {
    const results = await Result.findAll({
      where: { studentId },
      include: [{
        model: Course,
        where: { semester, academicYear },
        attributes: ['credits']
      }]
    });

    return calculateGPA(results);
  }

  /**
   * Calculate student's CGPA
   */
  async calculateStudentCGPA(studentId) {
    const results = await Result.findAll({
      where: { studentId },
      include: [{
        model: Course,
        attributes: ['credits', 'semester', 'academicYear']
      }]
    });

    // Group by semester
    const semesterGroups = {};
    results.forEach(result => {
      const key = `${result.Course.semester}-${result.Course.academicYear}`;
      if (!semesterGroups[key]) {
        semesterGroups[key] = [];
      }
      semesterGroups[key].push(result);
    });

    // Calculate GPA for each semester
    const semesterGPAs = Object.values(semesterGroups).map(semResults => 
      calculateGPA(semResults)
    );

    return calculateCGPA(semesterGPAs);
  }

  /**
   * Update student CGPA
   */
  async updateStudentCGPA(studentId) {
    const cgpa = await this.calculateStudentCGPA(studentId);
    await Student.update({ cgpa }, { where: { id: studentId } });
    return cgpa;
  }

  /**
   * Calculate course statistics
   */
  async calculateCourseStatistics(courseId) {
    const results = await Result.findAll({
      where: { courseId },
      attributes: ['score', 'grade']
    });

    if (results.length === 0) {
      return null;
    }

    const scores = results.map(r => parseFloat(r.score));
    const total = scores.reduce((sum, score) => sum + score, 0);
    const average = total / scores.length;
    const highest = Math.max(...scores);
    const lowest = Math.min(...scores);

    // Grade distribution
    const gradeDistribution = {};
    results.forEach(r => {
      gradeDistribution[r.grade] = (gradeDistribution[r.grade] || 0) + 1;
    });

    return {
      totalStudents: results.length,
      average: average.toFixed(2),
      highest,
      lowest,
      gradeDistribution
    };
  }

  /**
   * Get GPA trend
   */
  async getGPATrend(studentId) {
    const results = await Result.findAll({
      where: { studentId },
      include: [{
        model: Course,
        attributes: ['credits', 'semester', 'academicYear']
      }],
      order: [[Course, 'academicYear', 'ASC'], [Course, 'semester', 'ASC']]
    });

    const semesterGroups = {};
    results.forEach(result => {
      const key = `${result.Course.semester} ${result.Course.academicYear}`;
      if (!semesterGroups[key]) {
        semesterGroups[key] = [];
      }
      semesterGroups[key].push(result);
    });

    return Object.entries(semesterGroups).map(([semester, semResults]) => ({
      semester,
      gpa: parseFloat(calculateGPA(semResults))
    }));
  }
}

module.exports = new CalculationService();