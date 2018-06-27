import React, { Component } from 'react'; 
import { inject, observer } from 'mobx-react';
 
export default class MetricDataColumn extends Component{ 
    render() { 
    const hide = this.props.show ? '' : 'hide-column';
       return <div className={hide} data-test='metric-data-column'>
            <div>{this.props.title}</div>
            {this.props.data.map((d, i) => {
                return <div key={i}>{d}</div>
            })}
       </div>;
    }
}