'use strict'

var base = module.superModule;

module.exports = function productListItem(productListItemObject) {

    base.call(this, productListItemObject)
    this.productListItem.timeToLeave = productListItemObject.custom.timeToLeave

}