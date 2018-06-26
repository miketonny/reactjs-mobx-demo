import React, { Component } from 'react'; 
import { inject, observer } from 'mobx-react';



@inject('rootStore')
@observer
export default class ProgressTable extends Component{
 
    
    render() { 
        return(
            <div>Metric table </div>
        );
    }
}