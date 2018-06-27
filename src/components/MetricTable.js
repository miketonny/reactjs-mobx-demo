import React, { Component } from 'react'; 
import { inject, observer } from 'mobx-react';
import MetricDataColumn from './MetricDataColumn';


@inject('rootStore')
@observer
export default class MetricTable extends Component{ 
    render() {
        return(
            <div data-test='metric-data-table'>
                <table><tbody><tr>
                    {this.props.rootStore.data.allMetricData.map((col, i) => {
                        return<td key={i}> 
                            <MetricDataColumn title={col.title} data={col.data}/>
                            </td>
                    })}
                </tr></tbody></table>
            </div>
        );
    }
}