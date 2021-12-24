'use strict'

var server = require('server')
var csrfProtection = require('*/cartridge/scripts/middleware/csrf');
var cache = require('*/cartridge/scripts/middleware/cache');
var consentTracking = require('*/cartridge/scripts/middleware/consentTracking');
var pageMetaData = require('*/cartridge/scripts/middleware/pageMetaData');

server.extend(module.superModule)

server.replace('Show', cache.applyPromotionSensitiveCache, csrfProtection.generateToken, consentTracking.consent, function (req, res, next) {
  var productHelper = require('*/cartridge/scripts/helpers/productHelpers');
  var notifyForm = server.forms.getForm('notifyForm');
  var showProductPageHelperResult = productHelper.showProductPage(req.querystring, req.pageMetaData);
  var productType = showProductPageHelperResult.product.productType;
  if (!showProductPageHelperResult.product.online && productType !== 'set' && productType !== 'bundle') {
    res.setStatusCode(404);
    res.render('error/notFound');
  } else {
    var pageLookupResult = productHelper.getPageDesignerProductPage(showProductPageHelperResult.product);

    if ((pageLookupResult.page && pageLookupResult.page.hasVisibilityRules()) || pageLookupResult.invisiblePage) {
      // the result may be different for another user, do not cache on this level
      // the page itself is a remote include and can still be cached
      res.cachePeriod = 0; // eslint-disable-line no-param-reassign
    }
    if (pageLookupResult.page) {
      res.page(pageLookupResult.page.ID, {}, pageLookupResult.aspectAttributes);
    } else {
      res.render(showProductPageHelperResult.template, {
        product: showProductPageHelperResult.product,
        addToCartUrl: showProductPageHelperResult.addToCartUrl,
        resources: showProductPageHelperResult.resources,
        breadcrumbs: showProductPageHelperResult.breadcrumbs,
        canonicalUrl: showProductPageHelperResult.canonicalUrl,
        schemaData: showProductPageHelperResult.schemaData,
        notifyForm: notifyForm
      });
    }
  }
  next();
}, pageMetaData.computedPageMetaData);


server.replace('Variation', function (req, res, next) {
  var productHelper = require('*/cartridge/scripts/helpers/productHelpers');
  var priceHelper = require('*/cartridge/scripts/helpers/pricing');
  var ProductFactory = require('*/cartridge/scripts/factories/product');
  var renderTemplateHelper = require('*/cartridge/scripts/renderTemplateHelper');

  var params = req.querystring;
  var product = ProductFactory.get(params);

  var context = {
    price: product.price
  };

  product.price.html = priceHelper.renderHtml(priceHelper.getHtmlContext(context));

  var attributeContext = {
    product: {
      attributes: product.attributes
    }
  };
  var attributeTemplate = 'product/components/attributesPre';
  product.attributesHtml = renderTemplateHelper.getRenderedHtml(
    attributeContext,
    attributeTemplate
  );

  var promotionsContext = {
    product: {
      promotions: product.promotions
    }
  };
  var promotionsTemplate = 'product/components/promotions';

  product.promotionsHtml = renderTemplateHelper.getRenderedHtml(
    promotionsContext,
    promotionsTemplate
  );

  var optionsContext = {
    product: {
      options: product.options
    }
  };
  var optionsTemplate = 'product/components/options';

  product.optionsHtml = renderTemplateHelper.getRenderedHtml(
    optionsContext,
    optionsTemplate
  );



  product.varId = params.pid

  res.json({
    product: product,
    resources: productHelper.getResources()
  });

  next();
});

server.post('SubmitNotifyForm', server.middleware.https,

  function (req, res, next) {
    var Request = require('dw/system/Request');
    var CustomObjectMgr = require('dw/object/CustomObjectMgr');
    var URLUtils = require('dw/web/URLUtils');
    var formErrors = require('*/cartridge/scripts/formErrors');
    var notifyForm = server.forms.getForm('notifyForm');


    if (notifyForm.valid) {
      var txn = require('dw/system/Transaction');
      txn.wrap(function () {
        var pid = req.querystring.pid
        var test = CustomObjectMgr.getCustomObject('backInStockNotify', pid)

        if (pid) {
          if (!test) {
            test = CustomObjectMgr.createCustomObject('backInStockNotify', pid)
            test.custom.userData = JSON.stringify({
              email: notifyForm.Nemail.htmlValue,
              name: notifyForm.Nname.htmlValue
            })
          } else {

            test.custom.userData += JSON.stringify({
              email: notifyForm.Nemail.htmlValue,
              name: notifyForm.Nname.htmlValue
            })
          }
        }

      })
      res.json({
        success: true
      })
    } else {

      res.json({
        success: false,
        notifyForm: notifyForm
      })

    }
    next()
  })

module.exports = server.exports()