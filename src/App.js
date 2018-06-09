import React, { Component } from 'react'; 
import './App.css';
// import TagTable from './TagTable';
import Form from './Form';
import GroupBox from './GroupBox';
import Modal from './Modal';
import EndTrimForm from './EndTrimForm';
import DataModel from './DataModel';
import Table from './Table'; 
import { ColumnType, ColumnStatus} from './Enum';
 
class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            PositionalGroups: [],
            StatusGroups: [],
            Positions: [],
            showAddSplit: false,
            showEndTrim: false,
            modalGrps: [],
            splitNames: [],
            allChecked: false,
            athletes: [],
            currentTrimName: '',
            sessionID: '277876',//hard coded for demo =======
            sessionStatus: 'Running', 
            loading: true, //initial state when component initialised to show loading,
            data: []
        }
    }

    /*
    Component state change events =====================================================================================
    */
    componentWillMount() {
        //1) if stored sessionID isnt the same as current state session ID, clear the storage to avoid conflicting...
        let storedSession = localStorage.getItem('sessionID'); 
        if(storedSession !== null && storedSession !== 'undefined') storedSession = JSON.parse(localStorage.getItem('sessionID'));
        if (storedSession !== null && storedSession !== this.state.sessionID && storedSession !== 'undefined') {
            localStorage.clear(); //clear storage when stored session isnt matching current sessionID..
        } else if (storedSession === null) {
            localStorage.setItem('sessionID', JSON.stringify(this.state.sessionID)); //store sessionID in localstorage..
        }  
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
        this.intervalId = setInterval(() => this.refresh(), 5000);
    }

    //updates state data from data store ===================================
    refresh() {
        let model = new DataModel(this.state.sessionID, this.state.data);
        model.getAthletes().then(res => { 
            model.athletes = res.data;
            model.digestData();
            this.setState({
                athletes: model.athletes, 
                PositionalGroups: model.groups,
                StatusGroups: model.statGroups,
                modalGrps: model.modalgrps,
                Positions: model.positions,
                loading: false,
                data: model.data
            }); 
        }
        );  
    }

    /*
        User interaction events handling/manupilation ===================
    */
    //group box selection chagned, select the rows for matching groups, client side only =========================
    selectedGroupChanged(grpName, option) {
        //selected group name defined...select the rows that matching grps
        let rows = [...this.state.data[0]];
        let grpRows = [];
        if (option === "1") {
            grpRows = rows.filter((r) => r.group === grpName);
        } else if (option === "2") {
            grpRows = rows.filter((r) => r.position === grpName);
        } else {
            grpRows = rows.filter((r) => r.statGroup === grpName);
        }
        grpRows.forEach((r) => {
            if (r.select !== true) {
                r.select = true;
            }
        });
        //check if all rows are checked, if so change allchecked to true..
        let allchecked = rows.filter((r, i) => r.select === true && i > 1).length === (rows.length - 2) ? true : false;
        this.setState({allChecked: allchecked });
    }

    //hide split from UI, clicking 'x' on split column ================
    hideSplit(title){ 
        let data = this.state.data.slice();
        let colIndx = data.findIndex(d => d.title === title);
        data[colIndx].show = false;
        this.setState({data: data});
    }

    //check whether the session has been stopped already on vxview's end..
    sessionStopped() { 
        if (this.state.sessionStatus === 'Stopped') return true;
        else return false;
    }

    /*
    manage the toggle start/stop button clicks ===============================================================
    */
    toggleClick(toggle, title){ 
        //1) if the session already stopped, then prevent any modification to splits/trims
        if (this.sessionStopped()) return;
        //2) find all selected rows 
        let selectedRowIndxes = [];
        this.state.data[0].data.forEach((d, i) => {
            if(d.select) selectedRowIndxes.push(i);
        }); 
        //3) send API request to update the new/updated trim/split to database==============================
        if(selectedRowIndxes.length > 0) this.toggleTrimSplit(selectedRowIndxes, title, toggle);
    }

    //does the actual processing of toggling, including UI render/API calls/callbacks
    toggleTrimSplit(rowIndxes, title, toggle){
        let updatedAths = [];
        let newAths = [];
        //1) fetching the new or updated records from selected rows on screen, along with their HTTP method needed
        this.state.athletes.forEach((ath, i) => {
            if (rowIndxes.includes(i)){
                let [period, method] = this.getUpdatedNewPeriod(ath.periods.filter(a => a.name === title), toggle);
                if(period) {
                    if(method === 'PUT') updatedAths.push({id: ath.id, period: period});
                    else newAths.push({id: ath.id, period: period});
                } 
            }
        }); 
        //2)call API ===============================================================
        if (updatedAths && updatedAths.length > 0) { 
            this.processToggle(updatedAths, title, toggle, 'PUT');
        }else if(newAths && newAths.length > 0){
            this.processToggle(newAths, title, toggle, 'POST');
        } 
    } 

    processToggle(athletes, colTitle, toggle, method){
        //1. api call ======================================================
        DataModel.updatePeriods(athletes, method).then(() => { 
            let updatedIndxes = [];
            this.state.athletes.forEach((a, i) => {
                if (athletes.find(ath => ath.id === a.id)) updatedIndxes.push(i);
            });
            //2. render UI when successfully updated to db =================
            this.updateTrimSplitStatus(updatedIndxes, colTitle, toggle); 
        }).catch(err => {
            console.log(err); //update failed to API, log to console -debug
        }); 
    }
    
    updateTrimSplitStatus(indxes, title, toggle){
        let data = this.state.data.slice(); 
        let colIndx = data.findIndex(d => d.title === title);
        //data[colIndx].status = ColumnStatus.Idle; //process finishes 
        data[colIndx].data.forEach((d, i) => {
            if(indxes.includes(i)) d.status = toggle === 'start' ? 'Running' : 'Stopped';
        })
        this.setState({data: data}); //update UI
    }

    //destructuring and return the period object with the post method ======================================
    getUpdatedNewPeriod(periods, toggle){
        //e.g. split 3 for athlete Andrew
        if (!periods) return [null, null];
        const type = periods[0].type;
        let lastPeriod = periods[periods.length - 1];
        if(type === 'Trim'){
            //trim
            if (toggle === 'start' && lastPeriod.startTime === null) {
                lastPeriod.startTime = this.getCurrentDateTime();
            } else if (toggle === 'stop' && lastPeriod.endTime === null) {
                lastPeriod.endTime = this.getCurrentDateTime();
            } else { return [null, null]; }
            return [lastPeriod, 'PUT'];
        }else{
            //split
            if (toggle === 'start' && lastPeriod.startTime === null) {
                lastPeriod.startTime = this.getCurrentDateTime();
                return [lastPeriod, 'PUT'];
            } else if (toggle === 'start' && lastPeriod.startTime !== null && lastPeriod.endTime !== null) {
                //already started and ended on this period,create a new one..
                let newPeriod = { startTime: this.getCurrentDateTime(), type: 'split', name: lastPeriod.name }
                return [newPeriod, 'POST'];
            } else if (toggle === 'stop' && lastPeriod.startTime !== null && lastPeriod.endTime === null) {
                lastPeriod.endTime = this.getCurrentDateTime(); //apply end time 
                return [lastPeriod, 'PUT'];
            } else {
                return [null, null];
            }
        }
    }

    /*
    handle UI interaction on checkboxes/check all selection ===================================
    */
    handleCheck(rowIndx){ 
        let data = this.state.data.slice();
        data.forEach(dt => {
            dt.data.forEach((d, i) => {
                if(i === rowIndx) d.select = !d.select;
            });
            });    
        ;
        this.setState({data: data});
        //check how many rows are checked, if all checked then change value of state allChecked value
        let allChecked = this.state.allChecked;
        if (data[0].data.filter(d => d.select).length === this.state.athletes.length){
            if(allChecked !== true) this.setState({allChecked: true});
        }else{ this.setState({allchecked: false})}
    }

    selectAllRows(){
        this.setState({allChecked: !this.state.allChecked}, () => {
            let data = this.state.data.slice();
            data.forEach(dt => {
                dt.data.forEach((d) => {
                    d.select = this.state.allChecked;
                });
            }); 
            this.setState({data: data});
        });     
    }


    /*Modals  ======================================================================================*/
    /*modal add split window ====================================================================== */
    showModal() {
        this.setState({ showAddSplit: true });
    }

    /**
     * select the pre-selected groups from window param and add split to all athletes with
     * No start/end time only name/type in inital API request 
     * @param {'split name'} name 
     * @param {'selection of group name'} group 
     */
    addSplit(name, group) {
        //1. hide modal ======================
        this.setState({ showAddSplit: false });
        //2. process selections===============
        if (this.sessionStopped()) return; //check if session still running..   if (this.sessionStopped()) return; //check if session still running..
        //3. check if split name already exist
        let data = this.state.data.slice();
        let existingCol = data.find(d => d.title === name);
        if(existingCol) return; //split already exists, dont do anything..
        let selectAths = []; 
        if(group === 'All') selectAths = data[0].data;
        else selectAths = data[0].data.filter(d => d.group === group || d.statGroup === group);
        if(!selectAths) return;
        //4. add new split column, add for all athletes ===============================
        let rows = data[0].data.map(() => {return {status: 'Not Started', select: true}});
        data.push({title: name, type: ColumnType.Split, show:true,
            status: ColumnStatus.Idle, data: rows});
        //select athletes and prepare for API data request models
        let newPeriods = [];
        selectAths.forEach(ath => { 
            newPeriods.push({id: ath.id, period: {type: ColumnType.Split, name: name}}); //new period
        });
        let selectedIndexes = []; 
        let athIDs = selectAths.map(a => a.id);
        this.state.athletes.forEach((ath, i) => {
            if(athIDs.includes(ath.id)) selectedIndexes.push(i);
        });
        if(selectedIndexes && selectedIndexes.length > 0){
            //set all selected athletes selection to true..
            data.forEach(d => {
                d.data.forEach((dt, i) => {
                    if(selectedIndexes.includes(i)) dt.select = true;
                })
            })
        }
        //5. api call ==========================================
        DataModel.updatePeriods(newPeriods, 'POST').then((res) => {
            console.log(res);
            this.setState({data: data});
        }).catch((err) => console.log(err)); 
    }

    //hanle overlay clicks to hide modal when not clicked on modal
    handleOverlay(e) {
        let modal = document.getElementById('modal');
        if (modal !== 'undefined' && e.target === modal) {
            this.setState({ showAddSplit: false, showEndTrim: false });
        }
    }
    /**
     * modal end current trim window and bring up the next trim in line =============
     */
    nextTrim() {   
        //1) find the current trim and then hide it
        let data = this.state.data.slice();
        let trims = data.filter(d => d.type === ColumnType.Trim);
        let currentDisplayedTrimIndx = trims.findIndex(t => t.show);
        let currentTrim = trims[currentDisplayedTrimIndx];
        let nextTrimIndx = currentDisplayedTrimIndx + 1;
        //check whether next trim exists or not then set status
        if (trims.length > nextTrimIndx){
            trims.forEach((c, i) => {
                c.show = false;
                if (i === nextTrimIndx) c.show = true;
            })
        }
        this.setState({showEndTrim: false, data: data});
        //2) end current trim by toggle all 'Running' sessions to 'Stop' and send API requests
        let endingTrims = []; 
        currentTrim.data.forEach((d,i) => {if(d.status === 'Running') endingTrims.push(i)});
        if(endingTrims) this.toggleTrimSplit(endingTrims, currentTrim.title, 'stop'); 
    }

    //open up end trim confirmation modal window
    handleNextTrim(title){
        if (this.sessionStopped()) return;
        this.setState({ currentTrimName: title }, () => { this.setState({ showEndTrim: true }) });
    }

    /*
     *  Shows all hidden split columns ================ 
     */
    showAll() { 
        let data = this.state.data.slice();
        data.forEach(d => {if(d.type === ColumnType.Split) d.show = true});
        this.setState({data: data});
    }


    //get local ISO time string to match database date time format...
    getCurrentDateTime() {
        return new Date().getFullYear() + '-' + ('0' + (new Date().getMonth() + 1)).slice(-2) + '-' + ('0' + new Date().getDate()).slice(-2) + 'T' +
            ('0' + new Date().getHours()).slice(-2) + ':' + ('0' + new Date().getMinutes()).slice(-2) + ':' + ('0' + new Date().getSeconds()).slice(-2) + '.' +
            new Date().getMilliseconds() + 'Z';
    }

    render() {
        const loading = this.state.loading;
        if (loading) { // if your component doesn't have to wait for an async action, remove this block 
            return (
                <div id="tableLoading" className="text-center loading-spinner spinner"><span>Loading please hold...</span>
                </div>
                ); 
        } 
        return (
            <div className="App row" onClick={this.handleOverlay.bind(this)}>
                <div className="col-md-12">
                    <div className="control-buttons pull-right">
                        <button className="btn" onClick={this.showAll.bind(this)}>Show All</button>
                        <button className="btn" onClick={this.showModal.bind(this)}>Add Split</button>
                    </div>
                </div>
                <div className="col-md-2"><GroupBox groups={this.state.PositionalGroups} positions={this.state.Positions} statusGrps={this.state.StatusGroups}
                    grpSelected={this.selectedGroupChanged.bind(this)} /></div>
                <Table columns={this.state.data} handleToggle={this.toggleClick.bind(this)} handleHideSplit={this.hideSplit.bind(this)}
                checkChanged={this.handleCheck.bind(this)} cellChecked={this.handleCheck.bind(this)} checkAll={this.selectAllRows.bind(this)}
                handleNextTrim={this.handleNextTrim.bind(this)}/>
                <Modal show={this.state.showAddSplit} children={<Form submit={this.addSplit.bind(this)} splitNames={this.state.splitNames} groups={this.state.modalGrps} />} />
                <Modal show={this.state.showEndTrim} children={<EndTrimForm confirm={this.nextTrim.bind(this)} name={this.state.currentTrimName} />} />

            </div>
        );
    }
}


export default App;
