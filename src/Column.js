import React, { Component } from 'react';  
import DataCell from './DataCell';
import ToggleButton from './ToggleButton';
import { ColumnType, ColumnStatus} from './Enum';


class Column extends Component{
    constructor(props){
        super(props);
        this.state = {
            status: this.props.colStatus,
            type: this.props.colType,
            title: this.props.title,
            data: this.props.data
        };
    }

    startStop(toggle){  
        this.setState({status: ColumnStatus.Processing});
        this.props.toggle(toggle, this.state.title); // call parent handler
    }

    nextTrim(){

    }
    checkChanged(){

    }
    hideSplit(){

    }     
    componentWillReceiveProps(nextProps){
        this.setState({status: nextProps.status});
    }
 
    render(){ 
        const type = this.state.type;
        const data = this.state.data;
        const title = this.state.title;
        let header = null;
        const toggles = <div><ToggleButton text='start' status = {this.state.status}  toggle={this.startStop.bind(this)}>start</ToggleButton>
        <ToggleButton  text='stop' status = {this.state.status} toggle={this.startStop.bind(this)}/></div>;
        if(type === ColumnType.Trim){
            header = <div><span className="col-sm-3" onClick={this.nextTrim.bind(this)}>
            <i className="fas fa-check"  ></i></span><span className="col-sm-6">{title}</span><span className="col-sm-3"></span></div>;
        }else if(type === ColumnType.Split){
            header = <div><span className="col-sm-3"><i className="fas fa-eye" ></i></span><span className="col-sm-6">{title}</span><span className="col-sm-3" onClick={this.hideSplit.bind(this)}><i className="fas fa-times" ></i></span></div>; //split cant complete...
        }else{
            header = <div></div>; // first two columns empty header
        }
        return  <td>
                <div>{header}</div>
                <div>{toggles}</div>
                <div>{
                    data.map((d,i) => {
                        let className = d.status === 'Running'? 'running' : d.status === 'Stopped'? 'stopped': d.status === 'Not Started' ? 'italic' : '';
                        let checkClass = true; // === true ? 'row-checked' : '';
                        return <DataCell key={i} rowIndex={i} click={this.checkChanged.bind(this)} class={className + ' ' + checkClass} text={d.status}/>;
                    })}
                </div>
                </td>;
 
    }



}

export default Column;