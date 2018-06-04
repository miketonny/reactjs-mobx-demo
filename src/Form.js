import React, { Component } from 'react'; 
import Select, {Creatable} from 'react-select';
import 'react-select/dist/react-select.css';

class Form extends Component{
    constructor(props){
        super(props);
        this.state={
            splitNames: this.props.splitNames,
            groups:this.props.groups,
            selected: '',
            selectedGrp: '',
            hideAlert: true
        }
    }
    haneldSplitNameChange(e){  
        if(e===null){     
            return;
        }
        this.setState({selected: e.value});
    }
    handleGroupChange(e){
        this.setState({selectedGrp: e.value});
    }
    handleSubmit(e){
        e.preventDefault(); 
        if (this.state.selected === null || this.state.selected === ''){
            this.setState({hideAlert:false});
            return; //split name must be entered before proceed.. 
        }
        let name = this.state.selected;
        let grp = this.state.selectedGrp===''? "All": this.state.selectedGrp;
        this.props.submit(name, grp);
    }
    render(){ 
        let alertClass = 'alert alert-warning ' + (this.state.hideAlert ? 'hide' : ''); 
        return <div className="panel col-sm-offset-2 col-sm-8 ">
        <div className="panel-heading"><h2><strong>AddSplit</strong></h2></div>
        <hr/>
        <form className="panel-body form-horizontal" onSubmit={this.handleSubmit.bind(this)}>
        <div className="form-group">
            <label className="col-sm-2 control-label">Split Name:</label>
            <div className="col-sm-10">
                <Select.Creatable 
                    name="form-field-name"
                    inputProps={{autoComplete:'off'}}
                    value={this.state.selected}
                    onChange={this.haneldSplitNameChange.bind(this)}
                    options={this.state.splitNames}
                    clearable={false}
                    placeholder="Select or type in your split name..." 
                /> 
            </div>
        </div>
        <div className="form-group">
           <label className="col-sm-2 control-label">Group: </label>
           <div className="col-sm-10">
                <Select 
                    name="form-field-name" 
                    value={this.state.selectedGrp !== ''? this.state.selectedGrp: 'All'}
                    onChange={this.handleGroupChange.bind(this)}
                    options={this.state.groups}
                    searchable={false}
                    clearable={false} 
                /> 
                {/* <select className="form-control" onChange={this.handleGroupChange.bind(this)}>
                        {this.state.groups.map((g,i)=>{
                                return <option key={i} value={g}>{g}</option>
                            })}
                </select> */}
           </div>
        </div> 
        <div className="form-group">
            <div className={alertClass} role="alert">
                please enter a valid split name...
            </div>
            <input type='submit' className="btn" value='Add Split'/>
        </div>
            

        </form>
        </div>

    }

}

export default Form;