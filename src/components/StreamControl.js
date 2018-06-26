import React, { Component } from 'react'; 
import { inject, observer } from 'mobx-react';

@inject('rootStore')
@observer
export default class StreamControl extends Component{

    render() {
        return(
            <div id="streamControl" class="col-md-12" data-test='stream-control-component'>
                <div class="col-lg-5 col-md-7 col-sm-11">
                    @*header*@
                    <div class="col-sm-3">VX Live Status</div>
                    <div class="col-sm-3">Units Connected</div>
                    <div class="col-sm-3"></div>
                    <div class="col-sm-3">Table Type</div>
                    @*row*@
                    <div class="col-sm-3 status" data-test="stream-status">{this.props.rootStore.ui.sessionStatus}</div>
                    <div class="col-sm-3 unit-connected" data-test="stream-units-connected">{this.props.rootStore.ui.unitsConnected}<label class="text-center"></label></div>
                    <div class="col-sm-3 text-center">
                        <button id="MetricSelection" class="btn btn-default " data-toggle="modal" data-target="#allMetricsModal">Metrics</button>
                        <button id="MonitoredMetrics" class="btn btn-default" data-toggle="modal" data-target="#monitoredModal">Monitored Metrics</button>
                    </div>
                    <div class="col-sm-3 types">
                        <ul class="col-sm-12" data-toggle="buttons">
                            <li class="radio col-sm-6">
                                <input type="radio" id="q156" name="rb" value="1" />All Metrics
                            </li>
                            <li class="radio col-sm-6">
                                <input type="radio" id="q157" name="rb" value="2" />Progress
                            </li>
                            <li class="radio col-sm-6">
                                <input type="radio" id="q158" name="rb" value="3" />Trim/Split
                            </li>
                        </ul>
                    </div>
                </div>

            <div id="connectionWarning" class="col-sm-12 text-center"><p class="alert-danger">connection to server is slow...</p></div>
        </div>
        );
    }
}