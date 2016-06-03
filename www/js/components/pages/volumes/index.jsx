var React = require('react');
var app = require('../../../adminui');

var VolumesListComponent = require('./list');
var utils = require('../../../lib/utils');
var FilterForm = require('./../../filter-form');

var Volumes = require('../../../models/volumes');
var REQUEST_TIMEOUT = 120 * 1000;

var VolumesPage = React.createClass({
    getInitialState: function () {
        return {
            filterTypes: ['name', 'owner_uuid', 'type', 'tag']
        };
    },
    statics: {
        sidebar: 'volumes',
        url: function () {
            var url = 'volumes';
            return location.pathname === '/volumes' ? (url + location.search || '') : url;
        }
    },
    componentWillMount: function () {
        this.collection = new Volumes(null, {perPage: 20});
        this.query(this.props.params);
        app.vent.trigger('settitle', 'vms');
    },
    render: function () {
        return (
            <div className="page" id="page-volumes">
                <div className="page-header">
                    <h1>Volumes
                        { app.user.role('operators') ?
                            <div className="actions">
                                <button onClick={this.provision} className="provision-button btn btn-info"><i className="fa fa-plus"></i> Create Volume</button>
                            </div> : null
                        }
                    </h1>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <section className="filter-form">
                            <FilterForm initialParams={this.props.params} handleSearch={this.query} buttonTitle='Search Volumes' types={this.state.filterTypes} />
                        </section>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <div className="list-region">
                            <VolumesListComponent volumes={this.collection} />
                        </div>
                    </div>
                </div>
            </div>
        );
    },
    query: function (params) {
        this.collection.params = utils.getVmSearchParams(params);
        this.collection.firstPage();
        this.collection.fetch({
            reset: true,
            timeout: REQUEST_TIMEOUT
        });
    },
    next: function () {
        if (this.collection.hasNext()) {
            this.collection.next();
            this.collection.fetch({
                remove: false,
                timeout: REQUEST_TIMEOUT
            });
        }
    }
});

module.exports = VolumesPage;
