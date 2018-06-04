import React, { Component } from 'react'; 

//customized checkboxes, rounded===
class DataCell extends Component{
    handleClick(){
        this.props.click(this.props.rowIndex);   
    } 
    render(){
        return <td key={this.props.colIndx} onClick={this.handleClick.bind(this)} className={this.props.class}>{this.props.text}</td>;
    }
}

export default DataCell;