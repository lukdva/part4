const logger = require('./logger')
const jwt = require('jsonwebtoken')

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
    req.token = null;
  next();
}

const userExtractor = (req, res, next) => {
  if(!req.token)
    res.status(401).json({error: 'token is missing or invalid'});
  const decodedToken = jwt.verify(req.token, process.env.SECRET);
  const userId = decodedToken.id
  
  if(!userId)
    res.status(401).json({error: 'token is missing or invalid'});
  req.user = decodedToken;
  next();
}
module.exports = 
{
  requestLogger,
  handleBadRequests,
  tokenExtractor,
  userExtractor
}