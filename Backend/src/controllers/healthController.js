const healthService = require('../services/healthService');

const checkHealth = (req, res) => {
  const healthData = healthService.getSystemHealth();
  
  const httpStatus = healthData.status === 'OK' ? 200 : 503;
  
  res.status(httpStatus).json({
    success: true,
    data: healthData
  });
};

module.exports = {
  checkHealth
};