'use strict'

var base = module.superModule;

function addItem(list, pid, config) {
  var Transaction = require('dw/system/Transaction');
  var Site = require('dw/system/Site');

  if (!list) {
    return false;
  }

  var itemExist = base.itemExists(list, pid, config);

  if (!itemExist) {
    var ProductMgr = require('dw/catalog/ProductMgr');

    var apiProduct = ProductMgr.getProduct(pid);

    if (apiProduct.variationGroup) {
      return false;
    }

    if (apiProduct && list && config.qty) {

      Transaction.wrap(function () {


        var productlistItem = list.createProductItem(apiProduct);

        if (apiProduct.optionProduct) {
          var optionModel = apiProduct.getOptionModel();
          var option = optionModel.getOption(config.optionId);
          var optionValue = optionModel.getOptionValue(option, config.optionValue);

          optionModel.setSelectedOptionValue(option, optionValue);
          productlistItem.setProductOptionModel(optionModel);
        }

        if (config.type === 10) {
          productlistItem.custom.timeToLeave = +Site.getCurrent().getCustomPreferenceValue('TimeToLeave')
        }
        if (apiProduct.master) {
          productlistItem.setPublic(false);
        }

        productlistItem.setQuantityValue(config.qty);
      });

    }

    if (config.type === 10) {
      base.updateWishlistPrivacyCache(config.req.currentCustomer.raw, config.req, config);
    }

    return true;
  } else if (itemExist && config.type === 11) {
    Transaction.wrap(function () {
      itemExist.setQuantityValue(itemExist.quantityValue + config.qty);
    });

    return true;
  }

  return false;
}

function getList(customer, config) {
  var productListMgr = require('dw/customer/ProductListMgr');
  var Transaction = require('dw/system/Transaction');
  var type = config.type;
  var list;
  if (type === 10) {
    var productLists = productListMgr.getProductLists(customer, type);
    list = productLists.length > 0 ?
      productLists[0] :
      null;
    if (!!list) {

      for (var i = 0; i < list.items.length; i++) {
        var timeToLeave = +list.items[i].custom.timeToLeave
        var today = new Date()
        today = Date.parse(today)
        var creationDateMs = Date.parse(list.items[i].creationDate)
        var gap = today - creationDateMs
        var updatedTimeToLeave = timeToLeave * 24 * 60 * 60 * 1000 - gap

        Transaction.wrap(function () {
          if (updatedTimeToLeave <= 0) {
            list.removeItem(list.items[i])
            i--
          } else {
            list.items[i].custom.timeToLeave = updatedTimeToLeave / 1000 / 60 / 60 / 24
          }
        });
      }

    }
  } else if (type === 11) {
    list = productListMgr.getProductList(config.id);
  } else {
    list = null;
  }
  return list;
}

module.exports = {
  getList: getList,
  updateWishlistPrivacyCache: base.updateWishlistPrivacyCache,
  addItem: addItem,
  removeItem: base.removeItem,
  createList: base.createList,
  removeList: base.removeList,
  itemExists: base.itemExists,
  mergelists: base.mergelists,
  getItemFromList: base.getItemFromList,
  toggleStatus: base.toggleStatus,
  getCurrentOrNewList: base.getCurrentOrNewList
};