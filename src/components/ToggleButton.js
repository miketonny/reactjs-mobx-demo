import React, { Component } from 'react'; 

import { ColumnStatus} from '../models/Enum';

class ToggleButton extends Component{
    handleClick(){
        this.props.toggle(this.props.text); 
    }
    render(){
        const status = this.props.status;
        let startDisabled = false, endDisabled = false;
        switch(status){
            case ColumnStatus.Processing:
                startDisabled = true;
                endDisabled = true;
                break;
            case ColumnStatus.Started:
                startDisabled = true; //user cannot toggle start when split/trim is started
                break;
            case ColumnStatus.Stopped:
                endDisabled = true;
                break;
            case ColumnStatus.Idle:
                break; //do nothing 
            default: 
                break;
        }
        if(this.props.text==='start'){
            return <button data-test="button-toggle-start" className="btn toggle-button" onClick={this.handleClick.bind(this)} disabled={startDisabled}><i className="fas fa-play"></i></button>
        }else{
            return <button data-test="button-toggle-stop" className="btn toggle-button" onClick={this.handleClick.bind(this)} disabled={endDisabled}><i className="fas fa-stop"></i></button>
        } 
    }
}

export default ToggleButton;