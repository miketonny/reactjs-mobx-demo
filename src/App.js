import React, { Component } from 'react'; 
import { inject, observer } from 'mobx-react';
import './App.css';
// import TagTable from './TagTable';
import Form from './Form';
import GroupBox from './GroupBox';
import Modal from './Modal';
import EndTrimForm from './EndTrimForm';
import DataModel from './DataModel';
import Table from './Table'; 
import { ColumnType, ColumnStatus} from './Enum';
 
@inject('rootStore') 
@observer
class App extends Component {
    /*
    Component state change events =====================================================================================
    */
    componentWillMount() {
        //1) if stored sessionID isnt the same as current state session ID, clear the storage to avoid conflicting...
        // let storedSession = localStorage.getItem('sessionID'); 
        // if(storedSession !== null && storedSession !== 'undefined') storedSession = JSON.parse(localStorage.getItem('sessionID'));
        // if (storedSession !== null && storedSession !== this.state.sessionID && storedSession !== 'undefined') {
        //     localStorage.clear(); //clear storage when stored session isnt matching current sessionID..
        // } else if (storedSession === null) {
        //     localStorage.setItem('sessionID', JSON.stringify(this.state.sessionID)); //store sessionID in localstorage..
        // }  
        //2) setup default rows/columns.. fetch from localstorage ======
        const splits = [];
        splits.push({ 'value': 'Running Drill', 'label': 'Running Drill' });
        splits.push({ 'value': 'Split 1', 'label': 'Split 1' });
        splits.push({ 'value': 'Split 2', 'label': 'Split 2' });
        splits.push({ 'value': 'Split 3', 'label': 'Split 3' });
        splits.push({ 'value': 'Drill', 'label': 'Drill' });
        this.setState({
            splitNames: splits
        });
    }
    //remove interval upon destroy component..
    componentWillUnmount() {
        clearInterval(this.intervalId);
    }

    componentWillReceiveProps(nextProps){
        console.log(nextProps.sessionStatus);
        this.setState({sessionStatus:nextProps.sessionStatus});
    }

    //API looping call =============
    componentDidMount() {
        //api call to fetch athlete data from server DB every 5 sec............  
        this.intervalId = setInterval(() => this.props.rootStore.data.getData(), 5000);
    }

    render() {
        const loading = this.props.rootStore.isLoading;
        if (loading) { // if your component doesn't have to wait for an async action, remove this block 
            return (
                <div id="tableLoading" className="text-center loading-spinner spinner"><span>Loading please hold...</span>
                </div>
                ); 
        } 
        return (
            <div className="App row" >
                <div className="col-md-12">
                    <div className="control-buttons pull-right">
                        <button className="btn" onClick={this.props.rootStore.showAll}>Show All</button>
                        <button className="btn" onClick={this.props.rootStore.addSplit}>Add Split</button>
                    </div>
                </div>
                <div className="col-md-2"><GroupBox groups={this.props.rootStore.positionalGroups} 
                positions={this.props.rootStore.positions} 
                statusGrps={this.props.rootStore.statusGroups}
                    /></div>
                <Table columns={this.props.rootStore.data.data}/>
                {/* <Table columns={this.state.data} handleToggle={this.toggleClick.bind(this)} handleHideSplit={this.hideSplit.bind(this)}
                checkChanged={this.handleCheck.bind(this)} cellChecked={this.handleCheck.bind(this)} checkAll={this.selectAllRows.bind(this)}
                handleNextTrim={this.handleNextTrim.bind(this)}/> */}
                <Modal show={this.props.rootStore.ui.showAddSplit} 
                children={<Form />} />
                <Modal show={this.props.rootStore.ui.showEndTrim} 
                children={<EndTrimForm />} />

            </div>
        );
    }
}


export default App;
