'use strict';

var processInclude = require('base/util');

$(document).ready(function () {
    console.log('custom');
    processInclude(require('base/product/detail'));
    processInclude(require('./product/giftRegistry'));
    processInclude(require('./product/wishlist'));
});