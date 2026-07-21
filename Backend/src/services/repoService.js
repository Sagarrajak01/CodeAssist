const AdmZip = require('adm-zip');
const fs = require('fs').promises;
const path = require('path');
const simpleGit = require('simple-git');
const Repository = require('../models/Repository');

// Count total files
const countFilesInDirectory = async (dirPath) => {
  let count = 0;
  const entries = await fs.readdir(dirPath, { withFileTypes: true });

  for (const entry of entries) {

    if (entry.name.startsWith('.') || entry.name === 'node_modules') continue;

    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      count += await countFilesInDirectory(fullPath);
    } else {
      count++;
    }
  }
  return count;
};

// Process and extract zip file
const processAndStoreRepository = async (userId, fileData, name, description) => {
  const { path: zipPath, filename } = fileData;
  const extractPath = path.join(__dirname, '../../uploads/extracted', filename.replace('.zip', ''));

  try {
    // 1. Unzip the file
    const zip = new AdmZip(zipPath);
    zip.extractAllTo(extractPath, true);

    // 2. Calculate Metadata
    const fileCount = await countFilesInDirectory(extractPath);

    // 3. Save to MongoDB
    const repository = await Repository.create({
      userId,
      name: name || fileData.originalname.replace('.zip', ''),
      description,
      fileCount,
      status: 'completed', 
      extractedPath: extractPath
    });

    // 4. Cleanup original ZIP to save disk space
    await fs.unlink(zipPath);

    return repository;
  } catch (error) {
    // Cleanup ZIP if something fails
    await fs.unlink(zipPath).catch(() => {});
    throw new Error(`Failed to process repository: ${error.message}`);
  }
};

// Clone git repo
const cloneAndStoreRepository = async (userId, repoUrl, name, description) => {
  const folderName = Date.now() + '-' + Math.round(Math.random() * 1e9);
  const extractPath = path.join(__dirname, '../../uploads/extracted', folderName);

  try {
    // 1. Clone the repository 
    await simpleGit().clone(repoUrl, extractPath, ['--depth', '1']);

    // 2. Remove the .git folder
    await fs.rm(path.join(extractPath, '.git'), { recursive: true, force: true });

    // 3. Calculate Metadata
    const fileCount = await countFilesInDirectory(extractPath);

    // 4. Save to MongoDB
    const repository = await Repository.create({
      userId,
      name: name || repoUrl.split('/').pop().replace('.git', ''), 
      description,
      fileCount,
      status: 'completed', 
      extractedPath: extractPath
    });

    return repository;
  } catch (error) {
    // Cleanup folder if clone fails
    await fs.rm(extractPath, { recursive: true, force: true }).catch(() => {});
    throw new Error(`Failed to clone repository: ${error.message}`);
  }
};

const getUserRepositories = async (userId) => {
  return await Repository.find({ userId }).sort({ createdAt: -1 });
};

module.exports = {
  processAndStoreRepository,
  cloneAndStoreRepository,
  getUserRepositories
};