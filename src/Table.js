import React, { Component } from 'react'; 
import Column from './Column';
import HeaderColumn from './HeaderColumn';
import { inject, observer } from 'mobx-react';

@inject('rootStore')
@observer
class Table extends Component{
    handleHideSplit(title){
        this.props.handleHideSplit(title);
    }
    handleNextTrim(title){
        this.props.handleNextTrim(title);
    }
 
    render(){
        const columns = this.props.rootStore.data.data;  
        return  <div className = 'col-md-10' ><table id='test-table' className='table'>
            <tbody>
                <tr>
                    {columns.map((col, i) => {
                        if(i === 0) return <HeaderColumn key={i} data={col.data}/>;
                        else return <Column key={i} colStatus = {col.status} show = {col.show} nextTrim = {this.handleNextTrim.bind(this)}
                        colType = {col.type} title = {col.title} data = {col.data} toggle={this.props.handleToggle} 
                        hideSplit={this.handleHideSplit.bind(this)}/>;
                    })}
                </tr>
            </tbody>
        </table></div>;
    }
}

export default Table;