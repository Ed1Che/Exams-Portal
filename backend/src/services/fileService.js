const XLSX = require('xlsx');
const fs = require('fs').promises;
const path = require('path');
const logger = require('../utils/logger');
const { calculateGrade } = require('../utils/helpers');
const { GRADE_POINTS } = require('../utils/constants');

class FileService {
  /**
   * Parse Excel file for results
   */
  async parseResultsFile(filePath) {
    try {
      const workbook = XLSX.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      
      const data = XLSX.utils.sheet_to_json(worksheet, { defval: null });
      
      const results = data.map(row => {
        const score = parseFloat(row.score || row.Score || 0);
        const grade = calculateGrade(score);
        
        return {
          studentId: row.student_id || row.StudentID || row['Student ID'],
          score: score,
          grade: grade,
          gradePoint: GRADE_POINTS[grade] || 0,
          remarks: row.remarks || row.Remarks || null
        };
      });

      return results.filter(r => r.studentId);
    } catch (error) {
      logger.error('File parsing error:', error);
      throw new Error('Failed to parse results file');
    }
  }

  /**
   * Generate results template
   */
  async generateTemplate(courseCode, students) {
    try {
      const data = students.map(student => ({
        'Student ID': student.studentId,
        'Student Name': `${student.User.firstName} ${student.User.lastName}`,
        'Score': '',
        'Remarks': ''
      }));

      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Results');

      const fileName = `${courseCode}_Results_Template.xlsx`;
      const filePath = path.join(process.env.UPLOAD_PATH || './uploads', fileName);
      
      XLSX.writeFile(workbook, filePath);

      return { fileName, filePath };
    } catch (error) {
      logger.error('Template generation error:', error);
      throw new Error('Failed to generate template');
    }
  }

  /**
   * Delete file
   */
  async deleteFile(filePath) {
    try {
      await fs.unlink(filePath);
      logger.info(`File deleted: ${filePath}`);
    } catch (error) {
      logger.error('File deletion error:', error);
    }
  }

  /**
   * Get file info
   */
  async getFileInfo(filePath) {
    try {
      const stats = await fs.stat(filePath);
      return {
        size: stats.size,
        created: stats.birthtime,
        modified: stats.mtime
      };
    } catch (error) {
      return null;
    }
  }
}

module.exports = new FileService();