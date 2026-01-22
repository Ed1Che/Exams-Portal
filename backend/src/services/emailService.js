const nodemailer = require('nodemailer');
const logger = require('../utils/logger');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
      }
    });
  }

  /**
   * Send email
   */
  async sendEmail(to, subject, html, text) {
    try {
      const info = await this.transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to,
        subject,
        text,
        html
      });

      logger.info(`Email sent: ${info.messageId}`);
      return info;
    } catch (error) {
      logger.error('Email sending failed:', error);
      throw error;
    }
  }

  /**
   * Send result publication notification
   */
  async sendResultPublishedEmail(studentEmail, studentName, courseName, semester) {
    const subject = 'Examination Results Published';
    const html = `
      <h2>Dear ${studentName},</h2>
      <p>Your examination results for <strong>${courseName}</strong> (${semester}) have been published.</p>
      <p>Please log in to the student portal to view your results.</p>
      <p>
        <a href="${process.env.FRONTEND_URL}/student" 
           style="background-color: #0066cc; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
          View Results
        </a>
      </p>
      <p>Best regards,<br>Examination Office</p>
    `;

    return this.sendEmail(studentEmail, subject, html);
  }

  /**
   * Send submission status notification
   */
  async sendSubmissionStatusEmail(lecturerEmail, lecturerName, courseName, status, notes) {
    const subject = `Result Submission ${status.charAt(0).toUpperCase() + status.slice(1)}`;
    const html = `
      <h2>Dear ${lecturerName},</h2>
      <p>Your result submission for <strong>${courseName}</strong> has been ${status}.</p>
      ${notes ? `<p><strong>Notes:</strong> ${notes}</p>` : ''}
      <p>Please log in to the lecturer portal for more details.</p>
      <p>
        <a href="${process.env.FRONTEND_URL}/lecturer" 
           style="background-color: #198754; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
          View Details
        </a>
      </p>
      <p>Best regards,<br>Examination Office</p>
    `;

    return this.sendEmail(lecturerEmail, subject, html);
  }

  /**
   * Send verification request notification
   */
  async sendVerificationEmail(institutionEmail, studentName, verificationCode, expiryDate) {
    const subject = 'Student Record Verification';
    const html = `
      <h2>Student Record Verification</h2>
      <p>This is to verify the academic records of <strong>${studentName}</strong>.</p>
      <p><strong>Verification Code:</strong> ${verificationCode}</p>
      <p><strong>Valid Until:</strong> ${new Date(expiryDate).toLocaleDateString()}</p>
      <p>You can verify this information at:</p>
      <p>
        <a href="${process.env.FRONTEND_URL}/verification/verify/${verificationCode}"
           style="background-color: #172b4d; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
          Verify Now
        </a>
      </p>
      <p>Best regards,<br>University Examination Office</p>
    `;

    return this.sendEmail(institutionEmail, subject, html);
  }

  /**
   * Send password reset email
   */
  async sendPasswordResetEmail(userEmail, userName, resetToken) {
    const subject = 'Password Reset Request';
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    const html = `
      <h2>Dear ${userName},</h2>
      <p>You have requested to reset your password.</p>
      <p>Click the button below to reset your password. This link will expire in 1 hour.</p>
      <p>
        <a href="${resetUrl}" 
           style="background-color: #0066cc; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
          Reset Password
        </a>
      </p>
      <p>If you did not request this, please ignore this email.</p>
      <p>Best regards,<br>Examination Office</p>
    `;

    return this.sendEmail(userEmail, subject, html);
  }
}

module.exports = new EmailService();
