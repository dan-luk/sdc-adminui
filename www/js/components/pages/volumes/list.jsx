var React = require('react');
var UserLink = require('../../user-link');
var adminui = require('../../../adminui');

var VolumesList = React.createClass({
    propTypes: {
        'volumes': React.PropTypes.object.isRequired
    },
    componentDidMount: function () {
        var volumes = this.props.volumes;
        this._requests = [];
        volumes.on('request', this.onRequest, this);
        volumes.on('sync', this.onSynchronize, this);
        volumes.on('error', function (model, xhr) {
            var appendedText = '';
            if (xhr.statusText === 'timeout') {
                appendedText = 'Connection timed out - please try again.';
            } else {
                try {
                    appendedText = JSON.parse(xhr.responseText).message;
                } catch (ex) {
                    appendedText = ex;
                }
            }
            adminui.vent.trigger('notification', {
                level: 'error',
                message: 'Failed to fetch volumes: ' + appendedText
            });
            this.setState({loading: false});
        }, this);
    },
    getInitialState: function () {
        return {
            loading: true
        };
    },
    onRequest: function () {
        this.setState({loading: true});
    },
    onSynchronize: function () {
        this.setState({loading: false});
    },
    navigateToOwnerDetailsPage: function () {
        adminui.vent.trigger('showcomponent', 'user', {user: user});
    },
    renderVolumes: function (volume) {
        var volume = volume.toJSON();
        return (
            <tr key={volume.uuid}>
                <td className="alias">
                    <a href={'/volumes/' + volume.uuid}
                       data-volume-uuid={volume.uuid}>
                        {volume.name ? volume.name : volume.uuid}
                    </a>
                    <span className="uuid"><span className="selectable">{volume.uuid}</span></span>
                </td>
                <td>
                    <span>{volume.type}</span>
                </td>
                <td className="owned-by">
                    <div className="owner">
                        <UserLink icon company userUuid={volume.owner_uuid} handleClick={this.navigateToOwnerDetailsPage} />
                    </div>
                </td>
            </tr>
        );
    },
    render: function () {
        var volumes = this.props.volumes;
        if (this.state.loading) {
            return <div className="volumes-list">
                <div className="zero-state">Retrieving Volumes</div>
            </div>;
        }

        if (!volumes.length) {
            return <div className="zero-state">No Volumes were found matching specified criteria</div>;
        }

        return (
            <div className="volumes-list">
                <div className="volumes-list-header">
                    <div className="title">
                        Showing <span className="current-count">{volumes.length}</span> of <span className="record-count">{volumes.objectCount}</span> Volumes<br/>
                    </div>
                </div>
                <table className="table">
                    <tbody>{volumes.map(this.renderVolumes, this)}</tbody>
                </table>
            </div>
        );
    }
});

module.exports = VolumesList;
 