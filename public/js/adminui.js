var _ = require('underscore');
_.str = require('underscore.string');

var $ = require('jquery');
require('jquery.chosen');
require('jquery.serializeObject');
require('bootstrap');

$.fn.bootstrapTypeahead = $.fn.typeahead.noConflict();

require('bootstrap.tags');
require('typeahead');

var Backbone = require('backbone');
Backbone.$ = require('jquery');
require('backbone.stickit');
require('backbone.marionette');
require('caliper');

var Pinger = require('./ping');

/* Extend jQuery with functions for PUT and DELETE requests. */
function _ajax_request(url, data, callback, type, method) {
    if (jQuery.isFunction(data)) {
        callback = data;
        data = {};
    }
    return jQuery.ajax({
        type: method,
        url: url,
        data: data,
        success: callback,
        dataType: type
    });
}

jQuery.extend({
    put: function(url, data, callback, type) {
        return _ajax_request(url, data, callback, type, 'PUT');
    },
    delete_: function(url, data, callback, type) {
        return _ajax_request(url, data, callback, type, 'DELETE');
    }
});


var adminui = window.$a = module.exports = new Backbone.Marionette.Application();
adminui.addInitializer(function(options) {
    var Router = require('./router');
    this.addRegions({chrome:"#chrome"});
    this.pinger = new Pinger();
    this.router = new Router({app: adminui});
    this.state = new Backbone.Model();
});

adminui.on('start', function() {
    this.pinger.start();
    this.router.start();
    Backbone.history.start({pushState: true});
});

