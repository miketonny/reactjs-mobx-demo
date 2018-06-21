import React, { Component } from 'react';  
import DataCell from './DataCell';
import ToggleButton from './ToggleButton';
import { ColumnType, ColumnStatus} from '../models/Enum';
import { inject, observer } from 'mobx-react';


@inject('rootStore')
@observer
class Column extends Component{
    startStop(toggle){  
        if(this.props.colStatus === ColumnStatus.Idle){
            this.props.rootStore.ui.toggleStartStop(toggle, this.props.title);
        }   
    }
    cellClicked(indx){
        this.props.rootStore.ui.checkOneRow(indx);
    }

    nextTrim(){
        this.props.rootStore.ui.showNextTrim(this.props.title); 
    } 
    hideSplit(){
        this.props.rootStore.ui.hideColumn(this.props.title);  
    }     
    render(){ 
        const type = this.props.colType;
        const data = this.props.data;
        const title = this.props.title.length > 16 ? `${this.props.title.slice(0, 15)}...` : this.props.title;
        const hide = this.props.show ? '' : 'hide-column';
        let header = null;
        const toggles = <div className='col-sm-12'><ToggleButton data-test='column-start-button' text='start' status = {this.props.colStatus}  toggle={this.startStop.bind(this)}>start</ToggleButton>
        <ToggleButton data-test='column-stop-button'  text='stop' status = {this.props.colStatus} toggle={this.startStop.bind(this)}/></div>;
        if(type === ColumnType.Trim){
            header = <div data-test='column-header-trim'><span className="col-sm-3" onClick={this.nextTrim.bind(this)}>
            <i className="fas fa-check"  ></i></span><span className="col-sm-6">{title}</span><span className="col-sm-3"></span></div>;
        }else if(type === ColumnType.Split){
            header = <div data-test='column-header-split'><span className="col-sm-3"><i className="fas fa-eye" ></i></span><span className="col-sm-6">{title}</span><span className="col-sm-3" onClick={this.hideSplit.bind(this)}><i className="fas fa-times" ></i></span></div>; //split cant complete...
        }else{
            header = <div></div>; // first two columns empty header
        }
        return  <td className={hide} data-test='component-data-column'> 
                <div>{header}</div>
                <div>{toggles}</div>
                <div>{
                    data.map((d,i) => {
                        let className = d.status === 'Running'? 'running' : d.status === 'Stopped'? 'stopped': d.status === 'Not Started' ? 'italic' : '';
                        let checkClass = d.select === true ? 'row-checked' : '';
                        return <DataCell data-test='component-cell'  key={i} rowIndex={i} click={this.cellClicked.bind(this)} class={`${className} ${checkClass}`} text={d.status}/>;
                    })}
                </div>
                </td>;
 
    }



}

export default Column;