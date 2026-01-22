const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');

router.use(authenticate);
router.use(authorize('student'));

router.get('/dashboard', studentController.getDashboard);
router.get('/results', studentController.getResults);
router.get('/results/:courseId', studentController.getCourseResult);
router.get('/transcript', studentController.getTranscript);
router.get('/notifications', studentController.getNotifications);
router.put('/notifications/:id/read', studentController.markNotificationRead);

module.exports = router;