require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/config/db');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  const server = app.listen(PORT, () => {
    console.log(`[Server] Running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });

  // Handle Unhandled Promise Rejections 
  process.on('unhandledRejection', (err) => {
    console.error(`[Fatal Error] Unhandled Rejection: ${err.message}`);
    server.close(() => process.exit(1));
  });
};

process.on('uncaughtException', (err) => {
  console.error(`[Fatal Error] Uncaught Exception: ${err.message}`);
  process.exit(1);
});

startServer();