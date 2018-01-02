
const logger = require('../../ext/build/lib/Logger2')('ufp-start')

logger.info('Starting server...')
require('../../server/main')
  .listen(3000, () => {
    logger.success('Server is running at http://localhost:3000')
  })
