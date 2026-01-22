const { User, Student, Lecturer } = require('../models');
const authService = require('../services/authService');
const logger = require('../utils/logger');
const { createAuditLog } = require('../middleware/auditLog');

class AuthController {
  /**
   * Register new user
   * POST /api/v1/auth/register
   */
  async register(req, res, next) {
    try {
      const user = await authService.createUser(req.validatedBody);

      await createAuditLog(
        user.id,
        'USER_REGISTERED',
        'User',
        user.id,
        null,
        { username: user.username, role: user.role },
        req
      );

      logger.info(`New user registered: ${user.username} (${user.role})`);

      res.status(201).json({
        success: true,
        message: 'Registration successful',
        data: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role
        }
      });
    } catch (error) {
      logger.error('Registration error:', error);
      next(error);
    }
  }

  /**
   * Login user
   * POST /api/v1/auth/login
   */
  async login(req, res, next) {
    try {
      const { username, password, role } = req.validatedBody;

      const user = await authService.authenticateUser(username, password, role);
      const tokens = authService.generateTokens(user.id, user.role);

      // Get role-specific profile
      let profile = null;
      if (role === 'student') {
        profile = await Student.findOne({ where: { userId: user.id } });
      } else if (role === 'lecturer') {
        profile = await Lecturer.findOne({ where: { userId: user.id } });
      }

      await createAuditLog(
        user.id,
        'USER_LOGIN',
        'User',
        user.id,
        null,
        null,
        req
      );

      logger.info(`User logged in: ${user.username} (${user.role})`);

      res.json({
        success: true,
        message: 'Login successful',
        data: {
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
            firstName: user.firstName,
            lastName: user.lastName
          },
          profile,
          ...tokens
        }
      });
    } catch (error) {
      logger.error('Login error:', error);
      res.status(401).json({
        success: false,
        error: error.message || 'Login failed'
      });
    }
  }

  /**
   * Refresh access token
   * POST /api/v1/auth/refresh-token
   */
  async refreshToken(req, res, next) {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(400).json({
          success: false,
          error: 'Refresh token required'
        });
      }

      const decoded = authService.verifyRefreshToken(refreshToken);
      const user = await User.findByPk(decoded.userId);

      if (!user || !user.isActive) {
        return res.status(401).json({
          success: false,
          error: 'Invalid refresh token'
        });
      }

      const tokens = authService.generateTokens(user.id, user.role);

      res.json({
        success: true,
        data: tokens
      });
    } catch (error) {
      logger.error('Token refresh error:', error);
      res.status(401).json({
        success: false,
        error: 'Invalid refresh token'
      });
    }
  }

  /**
   * Logout user
   * POST /api/v1/auth/logout
   */
  async logout(req, res, next) {
    try {
      await createAuditLog(
        req.userId,
        'USER_LOGOUT',
        'User',
        req.userId,
        null,
        null,
        req
      );

      logger.info(`User logged out: ${req.user.username}`);

      res.json({
        success: true,
        message: 'Logout successful'
      });
    } catch (error) {
      logger.error('Logout error:', error);
      next(error);
    }
  }

  /**
   * Change password
   * POST /api/v1/auth/change-password
   */
  async changePassword(req, res, next) {
    try {
      const { currentPassword, newPassword } = req.validatedBody;
      const user = await User.findByPk(req.userId);

      const isValid = await user.comparePassword(currentPassword);
      if (!isValid) {
        return res.status(400).json({
          success: false,
          error: 'Current password is incorrect'
        });
      }

      user.passwordHash = newPassword;
      await user.save();

      await createAuditLog(
        req.userId,
        'PASSWORD_CHANGED',
        'User',
        req.userId,
        null,
        null,
        req
      );

      logger.info(`Password changed for user: ${user.username}`);

      res.json({
        success: true,
        message: 'Password changed successfully'
      });
    } catch (error) {
      logger.error('Change password error:', error);
      next(error);
    }
  }

  /**
   * Get current user profile
   * GET /api/v1/auth/profile
   */
  async getProfile(req, res, next) {
    try {
      const user = await User.findByPk(req.userId, {
        attributes: { exclude: ['passwordHash'] }
      });

      let profile = null;
      if (req.userRole === 'student') {
        profile = await Student.findOne({ 
          where: { userId: req.userId },
          include: [{ model: User, attributes: ['firstName', 'lastName', 'email'] }]
        });
      } else if (req.userRole === 'lecturer') {
        profile = await Lecturer.findOne({ 
          where: { userId: req.userId },
          include: [{ model: User, attributes: ['firstName', 'lastName', 'email'] }]
        });
      }

      res.json({
        success: true,
        data: {
          user,
          profile
        }
      });
    } catch (error) {
      logger.error('Get profile error:', error);
      next(error);
    }
  }

  /**
   * Update profile
   * PUT /api/v1/auth/profile
   */
  async updateProfile(req, res, next) {
    try {
      const { firstName, lastName, email, ...profileData } = req.validatedBody;

      // Update user table
      if (firstName || lastName || email) {
        await User.update(
          { firstName, lastName, email },
          { where: { id: req.userId } }
        );
      }

      // Update role-specific profile
      if (Object.keys(profileData).length > 0) {
        if (req.userRole === 'student') {
          await Student.update(profileData, { where: { userId: req.userId } });
        } else if (req.userRole === 'lecturer') {
          await Lecturer.update(profileData, { where: { userId: req.userId } });
        }
      }

      await createAuditLog(
        req.userId,
        'PROFILE_UPDATED',
        'User',
        req.userId,
        null,
        req.validatedBody,
        req
      );

      logger.info(`Profile updated for user: ${req.user.username}`);

      res.json({
        success: true,
        message: 'Profile updated successfully'
      });
    } catch (error) {
      logger.error('Update profile error:', error);
      next(error);
    }
  }

  /**
   * Request password reset
   * POST /api/v1/auth/forgot-password
   */
  async forgotPassword(req, res, next) {
    try {
      const { email } = req.body;
      
      const user = await User.findOne({ where: { email } });
      
      // Always return success to prevent email enumeration
      if (!user) {
        return res.json({
          success: true,
          message: 'If the email exists, a reset link has been sent'
        });
      }

      // Generate reset token (expires in 1 hour)
      const resetToken = authService.generateTokens(user.id, user.role).accessToken;
      
      // Send email (implement this based on your email service)
      // await emailService.sendPasswordResetEmail(user.email, user.firstName, resetToken);

      logger.info(`Password reset requested for: ${email}`);

      res.json({
        success: true,
        message: 'If the email exists, a reset link has been sent'
      });
    } catch (error) {
      logger.error('Forgot password error:', error);
      next(error);
    }
  }

  /**
   * Reset password with token
   * POST /api/v1/auth/reset-password
   */
  async resetPassword(req, res, next) {
    try {
      const { token, newPassword } = req.body;

      const decoded = authService.verifyRefreshToken(token);
      const user = await User.findByPk(decoded.userId);

      if (!user) {
        return res.status(400).json({
          success: false,
          error: 'Invalid reset token'
        });
      }

      user.passwordHash = newPassword;
      await user.save();

      await createAuditLog(
        user.id,
        'PASSWORD_RESET',
        'User',
        user.id,
        null,
        null,
        req
      );

      logger.info(`Password reset for user: ${user.username}`);

      res.json({
        success: true,
        message: 'Password reset successfully'
      });
    } catch (error) {
      logger.error('Reset password error:', error);
      res.status(400).json({
        success: false,
        error: 'Invalid or expired reset token'
      });
    }
  }
}

module.exports = new AuthController();
