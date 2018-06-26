import React, { Component } from 'react'; 
import { inject, observer } from 'mobx-react';


@inject('rootStore')
@observer
class StreamHeader extends Component{
    handleLock(){
        this.props.rootStore.ui.formLocking();
    }
    render() {
        return <div data-test='header-component'>
            <img />
            <div data-test='session-idtag'>{this.props.sessionID}</div>
            <div> 
                <div data-test='group-selection'></div>
                <button data-test='lock-button' onClick={this.handleLock.bind(this)}>Lock <i className='fa fa-lock'></i></button>
            </div>
        </div>
    }
}
 
export default StreamHeader;