import React, { Component } from 'react';  
import { inject, observer } from 'mobx-react'; 

@inject('rootStore') 
@observer
class Landing extends Component{
    fetchSession(e) {
        //check if session exists, if so redirect to session page
        e.preventDefault();
        console.log(this.props.rootStore.ui.sessionID);
    }

    handleTextChange(e) {
        this.props.rootStore.ui.sessionID = e.target.value;
    }

    render(){
        return <div className="row">
        <div className="center-block">
            <div className="center-logo"><img src="/images/Logo.png" alt="logo" /></div>
                <form onSubmit={this.fetchSession.bind(this)} className="center-form">
                    <p className="text-center">LiveStream ID:</p>
                    <input type="text" name="id" className="form-control" value={this.props.rootStore.ui.sessionID}
                    onChange={this.handleTextChange.bind(this)}/>
                    <br/>
                    <input type="submit" name="submit" value="View Session" className="btn btn-default form-control-sm center-block" />
                </form>
        </div>
    </div>
    }
}

export default Landing;