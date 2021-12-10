'use strict'

var server = require('server');
var page = module.superModule; //inherits functionality from next Product.js found to the right on the cartridge path
server.extend(page);

var consentTracking = require('*/cartridge/scripts/middleware/consentTracking');
var productListHelper = require('*/cartridge/scripts/productList/productListHelpers');
var csrfProtection = require('*/cartridge/scripts/middleware/csrf');
var Resource = require('dw/web/Resource');
var URLUtils = require('dw/web/URLUtils');
var ProductList = require('dw/customer/ProductList');
var PAGE_SIZE_ITEMS = 15;



server.replace('Show', consentTracking.consent, server.middleware.https, csrfProtection.generateToken, server.middleware.get, function (req, res, next) {
  var list = productListHelper.getList(req.currentCustomer.raw, {
    type: 10
  });
  var WishlistModel = require('*/cartridge/models/productList');
  var userName = '';
  var firstName;
  var rememberMe = false;
  if (req.currentCustomer.credentials) {
    rememberMe = true;
    userName = req.currentCustomer.credentials.username;
  }
  var loggedIn = req.currentCustomer.profile;

  var target = req.querystring.rurl || 1;
  var actionUrl = URLUtils.url('Account-Login');
  var createAccountUrl = URLUtils.url('Account-SubmitRegistration', 'rurl', target).relative().toString();
  var navTabValue = req.querystring.action;
  var breadcrumbs = [{
    htmlValue: Resource.msg('global.home', 'common', null),
    url: URLUtils.home().toString()
  }];
  if (loggedIn) {
    firstName = req.currentCustomer.profile.firstName;
    breadcrumbs.push({
      htmlValue: Resource.msg('page.title.myaccount', 'account', null),
      url: URLUtils.url('Account-Show').toString()
    });
  }
  var wishlistModel = new WishlistModel(
    list, {
      type: 'wishlist',
      publicView: false,
      pageSize: PAGE_SIZE_ITEMS,
      pageNumber: 1
    }
  ).productList;
  var profileForm = server.forms.getForm('profile');
  profileForm.clear();

  for (var i = 0; i < wishlistModel.items.length; i++) {
    if (wishlistModel.items[i].timeToLeave < 0) {
      var deleteUrl = 'Wishlist-RemoveProductAccount' + '?' + 'pid=' + wishlistModel.items[i].pid
      res.redirect(URLUtils.url('Wishlist-RemoveProductAccount', 'pid', wishlistModel.items[i].pid, 'timetoleave', 1));
    }

  }

  res.render('/wishlist/wishlistLanding', {
    wishlist: wishlistModel,
    navTabValue: navTabValue || 'login',
    rememberMe: rememberMe,
    userName: userName,
    actionUrl: actionUrl,
    actionUrls: {
      updateQuantityUrl: ''
    },
    profileForm: profileForm,
    breadcrumbs: breadcrumbs,
    oAuthReentryEndpoint: 1,
    loggedIn: loggedIn,
    firstName: firstName,
    socialLinks: loggedIn,
    publicOption: loggedIn,
    createAccountUrl: createAccountUrl
  });
  next();
});


server.replace('RemoveProductAccount', function (req, res, next) {
  productListHelper.removeItem(req.currentCustomer.raw, req.querystring.pid, {
    req: req,
    type: ProductList.TYPE_WISH_LIST
  });
  var wishListAccount = require('*/cartridge/models/account/wishListAccount');
  var apiWishList = productListHelper.getList(req.currentCustomer.raw, {
    type: ProductList.TYPE_WISH_LIST
  });
  var wishlistAccountModel = {};
  wishListAccount(wishlistAccountModel, apiWishList);
  var areItemsPresentInWishlist = wishlistAccountModel.wishlist.length !== 0;
  if (req.querystring.timetoleave) {
    res.redirect(URLUtils.url('Wishlist-Show'))
  }
  res.render('account/wishlist/listCards', {
    account: {
      wishlist: wishlistAccountModel.wishlist
    },
    socialLinks: areItemsPresentInWishlist
  });

  next();
});


module.exports = server.exports();