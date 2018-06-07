import React, { Component } from 'react'; 
import Column from './Column';
import HeaderColumn from './HeaderColumn';


class Table extends Component{
    constructor(props){
        super(props);
        this.state = { 
            columns: this.props.columns
        };
    }

    componentWillReceiveProps(nextProps){
        this.setState({columns: nextProps.columns});
    }
    handleCellClick(indx){
        this.props.cellChecked(indx);
    }
    handleHideSplit(title){
        this.props.handleHideSplit(title);
    }
    handleNextTrim(title){
        this.props.handleNextTrim(title);
    }
 
    render(){
        const columns = this.state.columns; 
        return  <div className = 'col-md-10' ><table id='test-table' className='table'>
            <tbody>
                <tr>
                    {columns.map((col, i) => {
                        if(i === 0) return <HeaderColumn key={i} data={col.data} handleCheck = {this.props.checkChanged} checkAll={this.props.checkAll} />;
                        else return <Column key={i} colStatus = {col.status} show = {col.show} nextTrim = {this.handleNextTrim.bind(this)}
                        colType = {col.type} title = {col.title} data = {col.data} toggle={this.props.handleToggle} 
                        handleCellClick={this.handleCellClick.bind(this)} hideSplit={this.handleHideSplit.bind(this)}/>;
                    })}
                </tr>
            </tbody>
        </table></div>;
    }
}

export default Table;