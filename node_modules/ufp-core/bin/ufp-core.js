#!/usr/bin/env node
const logger = require('../ext/build/lib/Logger2')('ufp-core-cli')
const package = require('../package.json')

logger.mark('UfpCore ', package.version)
logger.mark(package.description)
logger.mark('')
logger.mark('For now use the following commands for init')
logger.mark('Install ')
logger.mark(package.scripts['ufp-install'])
logger.mark('Update ')
logger.mark(package.scripts['ufp-update'])
