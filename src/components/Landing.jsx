import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

@inject('rootStore')
@observer
class Landing extends Component {
    constructor(props) {
        super(props);
        this.fetchSession = this.fetchSession.bind(this);
        this.handleTextChange = this.handleTextChange.bind(this);
    }

    fetchSession(e) {
        // check if session exists, if so redirect to session page
        e.preventDefault();
        const { rootStore } = this.props;
        rootStore.data.validateSession().then(() => {
            if (!rootStore.ui.sessionLoaded) {
                // for some reason session isnt loaded, display error msg
                rootStore.ui.warning = true;
            } else {
                this.props.history.push('/stream');
            }
        });
    }

    handleTextChange(e) {
        const { rootStore } = this.props;
        rootStore.ui.sessionID = e.target.value;
    }

    render() {
        const { rootStore } = this.props;
        const errMsg = <div className="not-found">Session not found<br /></div>;
        return (
          <div className="row landing-bg">
            <div className="center-block">
              <div className="center-logo">
                <img src="/images/Logo.png" alt="logo" />
              </div>
              <form onSubmit={this.fetchSession} className="center-form">
                <p className="text-center">LiveStream ID:</p>
                <input
                  type="text"
                  name="id"
                  className="form-control"
                  value={rootStore.ui.sessionID}
                  onChange={this.handleTextChange}
                />
                <br />
                <input type="submit" name="submit" value="View Session" className="btn btn-default form-control-sm center-block" />
                {rootStore.ui.warning ? errMsg : ''}
              </form>
            </div>
          </div>
);
    }
}

export default Landing;
