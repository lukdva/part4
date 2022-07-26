const logger = require('./logger')

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Body:  ', request.body)
  logger.info('---')
  next()
}

const handleBadRequests = (err ,req, res, next) => {
  if (err.message.includes('bad request') || err.message.includes('validation failed')) {
    res.status(400);
    res.json({ error: err.message });
  }
  if (err.message === 'not found') {
    res.status(404);
    res.json({ err: err.message });
  }
  next(err)
}

const tokenExtractor = (req, res, next) => {
  const auth = req.get('authorization');
  if (auth && auth.toLowerCase().startsWith('bearer '))
    req.token = auth.substr(7);
  else
    req.token = null
  next();
}

module.exports = 
{
  requestLogger,
  handleBadRequests,
  tokenExtractor
}