import React, { Component } from 'react'; 

class GroupBox extends Component{
    constructor(props){
        super(props);
        this.state={
            Groups: this.props.groups,
            StatGrps: this.props.statusGrps,
            Positions: this.props.positions,
            DisplayedItems:[],
            SelectedOption:'1'
        }
    } 
    handleClick(e){
     //gets the group name selected 
        this.props.grpSelected(e.target.innerHTML, this.state.SelectedOption);
    }
    componentWillMount(){
        //initial load of options?? 
        if(this.state.Groups.length > 0){
            this.setState({DisplayedItems:this.state.Groups.slice()});
        }
    }
    handleSelectChange(e){ 
        let option = e.target.value;
        if(option==="1"){
            //show positional groups
            this.setState({DisplayedItems: this.state.Groups.slice(), SelectedOption:'1'});
        }else if(option==="2"){
            //show positions
            this.setState({DisplayedItems: this.state.Positions.slice(), SelectedOption:'2'});
        }else{
            //show status groups
            this.setState({DisplayedItems: this.state.StatGrps.slice(), SelectedOption:'3'});
        }
    }
    render(){
        let items = this.state.DisplayedItems;  
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
        </div>
    }
}

export default GroupBox;