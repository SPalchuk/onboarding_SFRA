'use strict'

var base = module.superModule;
var Site = require('dw/system/Site');
var txn = require('dw/system/Transaction');

module.exports = function productListItem(productListItemObject) {

    base.call(this, productListItemObject)
    var timeToLeaveBase = Site.getCurrent().getCustomPreferenceValue('TimeToLeave')
    var today = new Date();
    today = Date.parse(today)
    var creationDate = Date.parse(productListItemObject.creationDate)
    var gap = today - creationDate
    var timeToLeave = (timeToLeaveBase * 24 * 60 * 60 * 1000 - gap) / 1000 / 60 / 60 / 24
    if (Math.floor(timeToLeave) - 100 < 0) {
        txn.wrap(function () {
            productListItemObject.getList().removeItem(productListItemObject)
        });
    } else {
        this.productListItem.timeToLeave = Math.floor(timeToLeave)
    }
}