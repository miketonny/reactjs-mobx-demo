import React, { Component } from 'react'; 
import { inject, observer } from 'mobx-react';
import './App.css';
// import TagTable from './TagTable';
import Form from './components/Form';
import GroupBox from './components/GroupBox';
import Modal from './components/Modal';
import EndTrimForm from './components/EndTrimForm'; 
import Table from './components/Table';  
 
@inject('rootStore') 
@observer
class App extends Component {
    /*
    Component state change events =====================================================================================
    */
    // componentWillReceiveProps(nextProps){
    //     console.log(nextProps.sessionStatus);
    //     //this.setState({sessionStatus:nextProps.sessionStatus});
    // }

    //API looping call =============
    componentDidMount() {
        //api call to fetch athlete data from server DB every 5 sec............  
        setInterval(() => this.props.rootStore.data.getData(), 5000);
    }

    handleAddSplit(){
        this.props.rootStore.ui.addSplit();
    }
    showAllSplits(){
        this.props.rootStore.ui.showAllSplits();
    }

        //hanle overlay clicks to hide modal when not clicked on modal
    handleOverlay(e) {
        this.props.rootStore.ui.handleOverlay(e);
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
            <div className="App row" data-test="component-app" onClick={this.handleOverlay.bind(this)}>
                <div className="col-md-12">
                    <div className="control-buttons pull-right">
                        <button className="btn" onClick={this.showAllSplits.bind(this)}>Show All</button>
                        <button className="btn" onClick={this.handleAddSplit.bind(this)}>Add Split</button>
                    </div>
                </div>
                <div className="col-md-2"><GroupBox groups={this.props.rootStore.positionalGroups} 
                positions={this.props.rootStore.positions} 
                statusGrps={this.props.rootStore.statusGroups}
                    /></div>
                <Table columns={this.props.rootStore.data.data}/> 
                <Modal show={this.props.rootStore.ui.showAddSplit} 
                children={<Form />} />
                <Modal show={this.props.rootStore.ui.showEndTrim} 
                children={<EndTrimForm name={this.props.rootStore.ui.currentTrimName}/>} />

            </div>
        );
    }
}


export default App;
