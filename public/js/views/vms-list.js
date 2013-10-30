var Backbone = require('backbone');
var ItemTemplate = require('../tpl/vms-list-item.hbs');
var adminui = require('../adminui');

var Images = require('../models/images');

var ItemView = Backbone.Marionette.ItemView.extend({
    tagName: 'tr',
    template: ItemTemplate,

    events: {
        'click .alias a': 'navigateToVmDetails'
    },


    serializeData: function() {
        var data = this.model.toJSON();
        data.image = this.images.get(data.image_uuid);
        if (data.image) {
            data.image = data.image.toJSON();
        }
        data.ips = data.nics.map(function(n) {
            return n.ip;
        });
        return data;
    },

    navigateToVmDetails: function(e) {
        if (e.metaKey || e.ctrlKey) {
            return;
        }
        e.preventDefault();
        adminui.vent.trigger('showview', 'vm', { vm: this.model });
    }
});

module.exports = require('./composite').extend({
    itemView: ItemView,
    itemViewContainer: 'tbody',
    attributes: {
        'class':'vms-list'
    },
    events: {
        'click a.more': 'onNext'
    },
    collectionEvents: {
        'sync': 'onSync'
    },

    template: require('../tpl/vms-list.hbs'),
    emptyView: require('./empty').extend({
        loadingMessage: 'Loading Virtual Machines...',
        emptyMessage: 'No Virtual Machines found',
        columns: 4
    }),
    itemViewOptions: function() {
        return {
            emptyViewModel: this.collection
        };
    },

    initialize: function() {
        var self = this;
        this.images = new Images();
        this.images.fetch().done(function() {
            self.render();
        });

    },

    onBeforeItemAdded: function(iv) {
        iv.images = this.images;
    },

    onNext: function() {
        this.next();
    },

    onRender: function() {
        if (this.collection.length) {
            this.$('caption').show();
        } else {
            this.$('caption').hide();
        }
    },

    next: function() {
        if (this.collection.hasNext()) {
            this.collection.next();
            this.collection.fetch({remove: false});
        }
    },


    onSync: function() {
        this.$('caption').show();
        if (this.collection.objectCount === this.collection.length) {
            this.$('.more').hide();
        } else {
            this.$('.more').show();
        }
        this.$('.record-count').html(this.collection.objectCount);
        this.$('.current-count').html(this.collection.length);
    }

});
