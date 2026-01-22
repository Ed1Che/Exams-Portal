const express = require('express');
const router = express.Router();
const lecturerController = require('../controllers/lecturerController');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const upload = require('../middleware/upload');
const validate = require('../middleware/validate');
const {
  createCourseValidator,
  createSubmissionValidator
} = require('../utils/validators');

router.use(authenticate);
router.use(authorize('lecturer'));

router.get('/dashboard', lecturerController.getDashboard);
router.get('/courses', lecturerController.getCourses);
router.post('/courses', validate(createCourseValidator), lecturerController.createCourse);
router.post('/results/upload', upload.single('file'), validate(createSubmissionValidator), lecturerController.uploadResults);
router.get('/submissions', lecturerController.getSubmissions);
router.get('/results/template', lecturerController.downloadTemplate);

module.exports = router;
