const express = require('express');
const router = express.Router();
const { uploadRepo, cloneRepo, getRepos, updateRepoStatus } = require('../controllers/repoController');
const { protect } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

// Internal Webhook from Python AI Service 
router.patch('/:id/status', updateRepoStatus);

// All repository routes require authentication
router.use(protect);

router.post('/upload', upload.single('repoZip'), uploadRepo);
router.post('/clone', cloneRepo);
router.get('/', getRepos);

module.exports = router;