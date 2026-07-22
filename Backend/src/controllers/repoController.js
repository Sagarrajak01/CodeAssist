const repoService = require('../services/repoService');

const uploadRepo = async (req, res, next) => {
  try {
    if (!req.file) {
      const error = new Error('No ZIP file provided');
      error.statusCode = 400;
      throw error;
    }

    const { name, description } = req.body;
    const userId = req.user._id;

    const repository = await repoService.processAndStoreRepository(userId, req.file, name, description);

    res.status(201).json({
      success: true,
      data: repository,
      message: 'Repository uploaded and extracted successfully'
    });
  } catch (error) {
    next(error);
  }
};

const cloneRepo = async (req, res, next) => {
  try {
    const { repoUrl, name, description } = req.body;
    const userId = req.user._id;

    if (!repoUrl) {
      const error = new Error('GitHub URL is required');
      error.statusCode = 400;
      throw error;
    }

    const repository = await repoService.cloneAndStoreRepository(userId, repoUrl, name, description);

    res.status(201).json({
      success: true,
      data: repository,
      message: 'Repository cloned successfully'
    });
  } catch (error) {
    next(error);
  }
};

const getRepos = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const repos = await repoService.getUserRepositories(userId);
    
    res.status(200).json({
      success: true,
      data: repos
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadRepo,
  cloneRepo,
  getRepos
};
