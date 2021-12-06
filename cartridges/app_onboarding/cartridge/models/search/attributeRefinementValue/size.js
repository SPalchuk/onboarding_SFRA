'use strict'

var base = module.superModule

function SizeRefinementValueWrapper(productSearch, refinementDefinition, refinementValue) {
  base.call(this, productSearch, refinementDefinition, refinementValue)

  this.hitCount = refinementValue.hitCount

}

module.exports = SizeRefinementValueWrapper;