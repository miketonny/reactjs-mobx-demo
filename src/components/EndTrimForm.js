import React, { Component } from 'react'; 
import { inject, observer } from 'mobx-react';

@inject('rootStore')
@observer
class EndTrimForm extends Component{
    handleConfirm(e){
        e.preventDefault(); 
        this.props.rootStore.ui.endCurrentTrim();
    }
    render(){
        return  <div className="col-sm-offset-2 col-sm-8 ">
            <div className="panel-heading"><h2>Confirm End Trim</h2></div>
            <form className="panel-body" onSubmit={this.handleConfirm.bind(this)}>   
            <br/>
            <h4>End {this.props.name}</h4>
            <hr/>
            <input className="btn" type='submit' value='Confirm'/> 
            </form>
            </div>
            
    }
}

export default EndTrimForm;