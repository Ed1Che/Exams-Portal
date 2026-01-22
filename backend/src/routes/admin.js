const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const validate = require('../middleware/validate');
const {
  approveSubmissionValidator,
  rejectSubmissionValidator
} = require('../utils/validators');

router.use(authenticate);
router.use(authorize('admin'));

router.get('/dashboard', adminController.getDashboard);
router.get('/submissions', adminController.getSubmissions);
router.put('/submissions/:id/approve', validate(approveSubmissionValidator), adminController.approveSubmission);
router.put('/submissions/:id/reject', validate(rejectSubmissionValidator), adminController.rejectSubmission);
router.get('/verifications', adminController.getVerifications);

module.exports = router;