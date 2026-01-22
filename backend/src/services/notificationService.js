const { Notification } = require('../models');
const logger = require('../utils/logger');

class NotificationService {
  /**
   * Create notification
   */
  async createNotification(userId, title, message, type = 'info', link = null) {
    try {
      const notification = await Notification.create({
        userId,
        title,
        message,
        type,
        link
      });
      return notification;
    } catch (error) {
      logger.error('Notification creation failed:', error);
      throw error;
    }
  }

  /**
   * Create bulk notifications
   */
  async createBulkNotifications(userIds, title, message, type = 'info', link = null) {
    try {
      const notifications = userIds.map(userId => ({
        userId,
        title,
        message,
        type,
        link
      }));
      
      await Notification.bulkCreate(notifications);
    } catch (error) {
      logger.error('Bulk notification creation failed:', error);
      throw error;
    }
  }

  /**
   * Get user notifications
   */
  async getUserNotifications(userId, limit = 50, onlyUnread = false) {
    const where = { userId };
    if (onlyUnread) {
      where.isRead = false;
    }

    return Notification.findAll({
      where,
      order: [['createdAt', 'DESC']],
      limit
    });
  }

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId, userId) {
    const result = await Notification.update(
      { isRead: true },
      { where: { id: notificationId, userId } }
    );
    return result[0] > 0;
  }

  /**
   * Mark all as read
   */
  async markAllAsRead(userId) {
    await Notification.update(
      { isRead: true },
      { where: { userId, isRead: false } }
    );
  }

  /**
   * Get unread count
   */
  async getUnreadCount(userId) {
    return Notification.count({
      where: { userId, isRead: false }
    });
  }

  /**
   * Delete notification
   */
  async deleteNotification(notificationId, userId) {
    const result = await Notification.destroy({
      where: { id: notificationId, userId }
    });
    return result > 0;
  }
}

module.exports = new NotificationService();
