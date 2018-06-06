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
 
    render(){
        const columns = this.state.columns; 
        return  <table id='test-table' className='table col-md-10'>
            <tbody>
                <tr>
                    {columns.map((col, i) => {
                        if(i === 0) return <HeaderColumn key={i} data={col.data} handleCheck = {this.props.checkChanged} />;
                        else return <Column key={i} colStatus = {col.status} 
                        colType = {col.type} title = {col.title} data = {col.data} toggle={this.props.handleToggle}/>;
                    })}
                </tr>
            </tbody>
        </table>;
    }
}

export default Table;