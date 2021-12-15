'use strict'

var base = module.superModule



function ColorRefinementValueWrapper(productSearch, refinementDefinition, refinementValue) {
  var isMobile = require("../../utils")
  base.call(this, productSearch, refinementDefinition, refinementValue)
  this.hitCount = refinementValue.hitCount
  this.isMobile = isMobile

}
module.exports = ColorRefinementValueWrapper;