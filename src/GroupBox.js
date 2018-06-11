import React, { Component } from 'react';  
import { inject, observer } from 'mobx-react';

import DevTools from 'mobx-react-devtools';

@inject('rootStore') 
@observer
class GroupBox extends Component{
    handleClick(e){
     //gets the group name selected 
        this.props.grpSelected(e.target.innerHTML, this.state.SelectedOption);
    }
    handleSelectChange(){
        this.props.rootStore.ui.groupSelectionChanged;
    }
    render(){
        let items = this.props.rootStore.ui.displayedGroups; 
        console.log(this.props);
        return <div className={'group-box col-md-10 col-md-offset-1 panel'}>
            <div className={'panel-heading'}>Quick Filters</div>
            <div className="panel-body">
            <select className="form-control" onChange={this.handleSelectChange.bind(this)}>
                <option value={1}>Positional Group</option>
                <option value={2}>Position</option>
                <option value={3}>Status Group</option>
            </select>
            </div>
            <div className="panel-body"> 
            {items.map((item, i)=>{
                return <button key={i} className="btn" onClick={this.handleClick.bind(this)}>{item}</button>
            })}
            </div>
            
        <DevTools />
        </div>
    }
}

export default GroupBox;