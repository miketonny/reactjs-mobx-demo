import React, { Component } from 'react'; 
import Select, {Creatable} from 'react-select';
import 'react-select/dist/react-select.css';
import { inject, observer } from 'mobx-react';


@inject('rootStore')
@observer
class Form extends Component{
    handleSplitNameChange(e){  
        if(e===null){     
            return;
        }
        this.props.rootStore.ui.setNewSplitName(e.value);
    }
    handleGroupChange(e){
        this.props.rootStore.ui.preSelectGroup(e.value); 
    }
    handleSubmit(e){
        e.preventDefault(); 
      
        if (this.props.rootStore.ui.newSplitName === null || this.props.rootStore.ui.newSplitName === ''){
            this.props.rootStore.ui.showAlert(); 
            return; //split name must be entered before proceed.. 
        }
        this.props.rootStore.ui.addNewSplit();  
        this.props.rootStore.ui.addNewSplitColumn(this.props.rootStore.ui.newSplitName, this.props.rootStore.ui.preSelectGrp);
    }
    render(){ 
        const alertClass = 'alert alert-warning ' + (this.props.rootStore.ui.hideAlertMsg ? 'hide' : ''); 
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
                    value={this.props.rootStore.ui.newSplitName}
                    onChange={this.handleSplitNameChange.bind(this)}
                    options={this.props.rootStore.data.splitNames}
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
                    value={this.props.rootStore.ui.preSelectGrp !== ''? this.props.rootStore.ui.preSelectGrp: 'All'}
                    onChange={this.handleGroupChange.bind(this)}
                    options={this.props.rootStore.data.modalGrps}
                    searchable={false}
                    clearable={false} 
                /> 
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