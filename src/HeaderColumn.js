import React, { Component } from 'react'; 
import Checkbox from './Checkbox';
import DataCell from './DataCell';
import { inject, observer } from 'mobx-react';

@inject('rootStore')
@observer
class HeaderColumn extends Component{
    checkAll(){
        this.props.rootStore.ui.checkAllRows();
    }

    handleCheck(rowIndx){
        this.props.rootStore.ui.checkOneRow(rowIndx);
    }
    render(){
        const data = this.props.data;
        return   <td>
        <div></div>
        <div><button className="btn" onClick={this.checkAll.bind(this)}>Select All</button></div>
        <div>{
            data.map((d,i) => { 
                let checkClass = d.select === true ? 'row-checked' : '';
                return <div key={i} className='col-sm-12'>
                    <div className='col-sm-3'><Checkbox rowIndex={i} onChange={this.handleCheck.bind(this)} status={d.select}/></div>
                    <div className='col-sm-9'><DataCell rowIndex={i}  click={this.handleCheck.bind(this)} class={checkClass} text={d.name}/></div>
                    </div>;
            })}</div>
        </td>;
    }
}


export default HeaderColumn;