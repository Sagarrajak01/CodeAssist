const mongoose = require('mongoose');

const getSystemHealth = () => {
  const dbStatusMap = {
    0: 'Disconnected',
    1: 'Connected',
    2: 'Connecting',
    3: 'Disconnecting',
    99: 'Uninitialized'
  };

  const dbState = mongoose.connection.readyState;

  return {
    status: dbState === 1 ? 'OK' : 'DEGRADED',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    database: {
      status: dbStatusMap[dbState] || 'Unknown',
      host: mongoose.connection.host || 'N/A'
    }
  };
};

module.exports = {
  getSystemHealth
};