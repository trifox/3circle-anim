const logger = require('../lib/Logger2')('ufp-start')
const port = 3000
process.on('uncaughtException', function (err) {
    if (err.errno === 'EADDRINUSE') {
        logger.error(`The port ${port} on local machine is already in use, please check for any other running node-express or any other server running on your local machine using port ${port}`)
    } else {
        logger.error('Some other error: ', err)
    }
    process.exit(0)
})

logger.info(`Starting ufp-dev server... on port ${port}`)
require('../server/main')
    .listen(port, () => {
        logger.mark(`Server is running at http://localhost:${port}`)
    })
