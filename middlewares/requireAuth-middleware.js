const logger = require('../services/logger-service')

async function requireAuth(req, res, next) {
  if (!req.session || !req.session.user) {
    res.status(401).end('Unauthorized! Please login!')
    return
  }
  next()
}

async function requireHost(req, res, next) {
  const user = req.session.user
  if (!user.stays || !user.stays.length) {
    logger.warn(user.fullname + ' Attempt to perform host action')
    res.status(403).end('Unauthorized To Perform That Action.')
    return
  }
  next()
}


// module.exports = requireAuth

module.exports = {
  requireAuth,
  requireHost
}
