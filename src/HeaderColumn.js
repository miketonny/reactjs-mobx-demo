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
 
 
    componentWillReceiveProps(nextProps){
        this.setState({data: nextProps.data});
    }

    render(){
        const data = this.state.data;
        return   <td>
        <div></div>
        <div><button className="btn" onClick={this.props.checkAll}>Select All</button></div>
        <div>{
            data.map((d,i) => { 
                let checkClass = d.select === true ? 'row-checked' : '';
                return <div key={i} className='col-sm-12'>
                    <div className='col-sm-3'><Checkbox rowIndex={i} onChange={this.props.handleCheck} status={d.select}/></div>
                    <div className='col-sm-9'><DataCell rowIndex={i}  click={this.props.handleCheck} class={checkClass} text={d.name}/></div>
                    </div>;
            })}</div>
        </td>;
    }
}


export default HeaderColumn;