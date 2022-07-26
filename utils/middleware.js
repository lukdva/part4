const logger = require('./logger')

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Body:  ', request.body)
  logger.info('---')
  next()
}

const handleBadRequests = (error ,request, response, next) => {
  if (error.message.includes('bad request') || error.message.includes('validation failed')) {
    response.status(400);
    response.json({ error: error.message });
  }
  if (error.message === 'not found') {
    response.status(404);
    response.json({ error: error.message });
  }
  next(error)
}

module.exports = 
{
  requestLogger,
  handleBadRequests
}