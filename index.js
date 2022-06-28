const {PORT} = require('./utils/config')
const {info} = require('./utils/logger');
const app = require('./app');

app.listen(PORT, () => {
  info(`Server running on port ${PORT}`)
})