'use strict'

var base = module.superModule



function ColorRefinementValueWrapper(productSearch, refinementDefinition, refinementValue) {
  var isMobile = function () {
    var userAgent = request.httpHeaders.get('user-agent')
    return isMobile = userAgent.indexOf('Mobile') !== -1
  }

  base.call(this, productSearch, refinementDefinition, refinementValue)

  this.hitCount = refinementValue.hitCount
  this.isMobile = isMobile
}
module.exports = ColorRefinementValueWrapper;