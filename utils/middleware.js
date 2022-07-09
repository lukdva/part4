const logger = require('./logger')

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Body:  ', request.body)
  logger.info('---')
  next()
}

const handleBadRequests = (error ,request, response, next) => {
  if (error.message === 'bad request') {
    response.status(400);
    response.json({ error: error.message });
  }
  next()
}

module.exports = 
{
  requestLogger,
  handleBadRequests
}