import React, { Component } from 'react'; 
import { inject, observer } from 'mobx-react';

@inject('rootStore')
@observer
export default class ProgressiveMetricSelection extends Component{
    
    render() { 
        return(
           <div>Prog Popup!</div>
        );
    }
}