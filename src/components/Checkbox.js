import React, { Component } from 'react'; 

//customized checkboxes, rounded===
class Checkbox extends Component{
    handleCheck(){
        this.props.onChange(this.props.rowIndex);    
    } 
    render(){
        return <div className={'pretty p-default p-round'}>
            <input type='checkbox' checked={this.props.status} onChange={this.handleCheck.bind(this)} />
            <div className="state p-primary">
                <label></label>
            </div>
        </div>
    }
}
 
export default Checkbox;