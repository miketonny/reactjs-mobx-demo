import React, { Component } from 'react'; 
import { inject, observer } from 'mobx-react';

@inject('rootStore')
@observer
export default class StreamControl extends Component{

    radioSelected(e){  
        this.props.rootStore.ui.tabSelectionChanged(e.target.value);
    }

    handleModalBtnClick(){
        this.props.rootStore.ui.showTableColumnSelection();
    }
    
    render() { 
        return(
            <div id="streamControl" className="col-md-12" data-test='stream-control-component'>
                <div className="col-lg-5 col-md-7 col-sm-11">
                    <div className="col-sm-3">VX Live Status</div>
                    <div className="col-sm-3">Units Connected</div>
                    <div className="col-sm-3"></div>
                    <div className="col-sm-3">Table Type</div>
                    <div className="col-sm-3 status" data-test="stream-status">{this.props.rootStore.ui.sessionStatus}</div>
                    <div className="col-sm-3 unit-connected" data-test="stream-units-connected">{this.props.rootStore.ui.unitsConnected}<label className="text-center"></label></div>
                    <div className="col-sm-3 text-center">
                        <button data-test="stream-control-modal-button" onClick={this.handleModalBtnClick.bind(this)} >{this.props.rootStore.ui.currentTable} </button>
                    </div>
                    <div className="col-sm-3 types">
                        <ul className="col-sm-12" data-toggle="buttons">
                            <li className="radio col-sm-6">
                                <input type="radio" id="q156" value="1"
                                 checked={this.props.rootStore.ui.currentTable==='Metric'? true: false}  onChange={this.radioSelected.bind(this)}/>All Metrics
                            </li>
                            <li className="radio col-sm-6">
                                <input type="radio" id="q157" value="2" checked={this.props.rootStore.ui.currentTable==='Progress'? true: false}
                                data-test="progress-radio" onChange={this.radioSelected.bind(this)} />Progress
                            </li>
                            <li className="radio col-sm-6">
                                <input type="radio" id="q158" value="3" 
                                checked={this.props.rootStore.ui.currentTable==='LiveTag'? true: false} onChange={this.radioSelected.bind(this)} />Trim/Split
                            </li>
                        </ul>
                    </div>
                </div>

            <div id="connectionWarning" className="col-sm-12 text-center"><p className="alert-danger">connection to server is slow...</p></div>
        </div>
        );
    }
}