import winston from 'winston';

// Create a winston logger
const logger = winston.createLogger({
  level: 'info', // Default logging level
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `${timestamp} ${level}: ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console({ format: winston.format.simple() }), // Logs to the console
    new winston.transports.File({ filename: 'logs/app.log' }), // Logs to a file
  ],
});

export default logger;