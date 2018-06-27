import React, { Component } from 'react'; 
import Column from './Column';
import HeaderColumn from './HeaderColumn';
import { inject, observer } from 'mobx-react';

@inject('rootStore')
@observer
class Table extends Component{
    render(){
        const columns = this.props.rootStore.data.data;  
        return  <div className = 'col-md-10' >
        <div><table id='test-table' className='table'>
            <tbody>
                <tr>
                    {columns.map((col, i) => {
                        if(i === 0) return <td><HeaderColumn key={i} data={col.data}/></td>;
                        else return <td><Column key={i} colStatus = {col.status} show = {col.show}
                        colType = {col.type} title = {col.title} data = {col.data}
                        /></td>;
                    })}
                </tr>
            </tbody>
        </table></div></div>;
    }
}

export default Table;