window.jQuery = window.$ = require('jquery');
$('body').on('click', function name(params) {

})
var processInclude = require('base/util');

$(document).ready(function () {
    processInclude(require('base/components/menu'));
    processInclude(require('base/components/cookie'));
    processInclude(require('base/components/consentTracking'));
    processInclude(require('base/components/footer'));
    processInclude(require('./components/miniCart'));
    processInclude(require('base/components/collapsibleItem'));
    processInclude(require('base/components/search'));
    processInclude(require('base/components/clientSideValidation'));
    processInclude(require('base/components/countrySelector'));
    processInclude(require('base/components/toolTip'));
});

require('../../../../../../node_modules/bootstrap/js/src/util.js');
require('../../../../../../node_modules/bootstrap/js/src/alert.js');
require('../../../../../../node_modules/bootstrap/js/src/carousel.js');
require('../../../../../../node_modules/bootstrap/js/src/collapse.js');
require('../../../../../../node_modules/bootstrap/js/src/modal.js');
require('../../../../../../node_modules/bootstrap/js/src/scrollspy.js');
require('../../../../../../node_modules/bootstrap/js/src/tab.js');
require('../../../../../../node_modules/bootstrap/js/src/carousel')
require('../../../../../../../storefront-reference-architecture-master/cartridges/app_storefront_base/cartridge/client/default/js/thirdParty/bootstrap');
require('../../../../../../../storefront-reference-architecture-master/cartridges/app_storefront_base/cartridge/client/default/js/components/spinner');