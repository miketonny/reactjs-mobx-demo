import React, { Component } from 'react'; 
import Checkbox from './Checkbox';
import DataCell from './DataCell';

class HeaderColumn extends Component{
    constructor(props){
        super(props);
        this.state = {
            data: this.props.data

        };
    }

    checkAll(){

    }
 
    componentWillReceiveProps(nextProps){
        this.setState({data: nextProps.data});
    }

    render(){
        const data = this.state.data;
        return   <td>
        <div></div>
        <div><button className="btn" onClick={this.checkAll.bind(this)}>Select All</button></div>
        <div>{
            data.map((d,i) => { 
                let checkClass = ''; // === true ? 'row-checked' : '';
                return <div key={i}>
                    <Checkbox rowIndex={i} onChange={this.props.handleCheck} status={d.select}/> 
                    <DataCell rowIndex={i} click={this.props.handleCheck} class={checkClass} text={d.name}/>
                    </div>;
            })}</div>
        </td>;
    }
}


export default HeaderColumn;