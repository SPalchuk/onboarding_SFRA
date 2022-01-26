'use strict'

function isMobile() {
  var userAgent = request.httpHeaders.get('user-agent')
  return isMobile = userAgent.indexOf('Mobile') !== -1
}

module.exports = isMobile