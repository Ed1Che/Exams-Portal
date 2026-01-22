const jwt = require('jsonwebtoken');
const { User, Student, Lecturer } = require('../models');
const { Op } = require('sequelize');

class AuthService {
  /**
   * Generate JWT tokens
   */
  generateTokens(userId, role) {
    const accessToken = jwt.sign(
      { userId, role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '24h' }
    );

    const refreshToken = jwt.sign(
      { userId },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: process.env.JWT_REFRESH_EXPIRE || '7d' }
    );

    return { accessToken, refreshToken };
  }

  /**
   * Verify refresh token
   */
  verifyRefreshToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }

  /**
   * Create new user with profile
   */
  async createUser(userData) {
    const { role, ...otherData } = userData;

    // Check for existing user
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [
          { username: userData.username },
          { email: userData.email }
        ]
      }
    });

    if (existingUser) {
      throw new Error('Username or email already exists');
    }

    // Create user
    const user = await User.create({
      username: userData.username,
      email: userData.email,
      passwordHash: userData.password,
      role,
      firstName: userData.firstName,
      lastName: userData.lastName
    });

    // Create role-specific profile
    if (role === 'student') {
      await Student.create({
        userId: user.id,
        studentId: userData.studentId,
        program: userData.program,
        department: userData.department,
        academicYear: userData.academicYear || new Date().getFullYear()
      });
    } else if (role === 'lecturer') {
      await Lecturer.create({
        userId: user.id,
        staffId: userData.staffId,
        department: userData.department,
        title: userData.title,
        specialization: userData.specialization
      });
    }

    return user;
  }

  /**
   * Authenticate user
   */
  async authenticateUser(username, password, role) {
    const user = await User.findOne({
      where: { username, role, isActive: true }
    });

    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isValid = await user.comparePassword(password);
    if (!isValid) {
      throw new Error('Invalid credentials');
    }

    return user;
  }
}

module.exports = new AuthService();