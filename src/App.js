import React, { Component } from 'react'; 
import './App.css';
import TagTable from './TagTable';
import Form from './Form';
import GroupBox from './GroupBox';
import Modal from './Modal';
import EndTrimForm from './EndTrimForm';
import DataModel from './DataModel';
 
class App extends Component {
  constructor(props) {
      super(props);
      this.state = {
          dataColumns: [],
          dataRows: [],
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
          sessionID: '530243',//hard coded for demo =======
          sessionStatus: 'Running', 
          loading: true //initial state when component initialised to show loading
      }
  }

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
      let columns = JSON.parse(localStorage.getItem('dataColumns'));
      let rows = JSON.parse(localStorage.getItem('dataRows'));
      const splits = [];
      splits.push({ 'value': 'Running Drill', 'label': 'Running Drill' });
      splits.push({ 'value': 'Split 1', 'label': 'Split 1' });
      splits.push({ 'value': 'Split 2', 'label': 'Split 2' });
      splits.push({ 'value': 'Split 3', 'label': 'Split 3' });
      splits.push({ 'value': 'Drill', 'label': 'Drill' });
      this.setState({
          dataColumns: columns === null ? [] : columns,
          dataRows: rows === null ? [] : rows,
          splitNames: splits
      });
  }

  componentDidMount() {
      //api call to fetch athlete data from server DB every 5 sec............  
      this.intervalId = setInterval(() => this.refresh(), 5000);
  }

  //remove interval upon destroy component..
  componentWillUnmount() {
      console.log(this.intervalId);
      clearInterval(this.intervalId);
  }

  refresh() {
      let model = new DataModel(this.state.dataColumns, this.state.dataRows, this.state.sessionID);
      model.getAthletes().then(res => {
          model.athletes = res.data;
          model.digestData();
          this.setState({
              athletes: model.athletes,
              dataColumns: model.columns,
              dataRows: model.rows,
              PositionalGroups: model.groups,
              StatusGroups: model.statGroups,
              modalGrps: model.modalgrps,
              loading: false
          }); 
      }
      );  
  }

  /*
    User interaction events handling/manupilation ===================
  */
  checkAll() {
      this.setState({ allChecked: !this.state.allChecked }, () => {
          let rows = this.state.dataRows.slice();
          rows.forEach((r) => {
              r.select = this.state.allChecked;
          });
          this.setState({ dataRows: rows });
      })
  }
  selectChange(indx) {
      let rows = this.state.dataRows.slice();
      rows[indx].select = !rows[indx].select;
      //check if all rows has been set to checked, if yes then toggle 'allchecked' value 
      let allchecked = rows.filter((r, i) => r.select === true && i > 1).length === (rows.length - 2) ? true : false;
      this.setState({ dataRows: rows, allChecked: allchecked });
  }

  selectedGroupChanged(grpName, option) {
      //selected group name defined...select the rows that matching grps
      let rows = this.state.dataRows.slice();
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
      this.setState({ dataRows: rows, allChecked: allchecked });
  }

  //start & stop a trim or split, depending on the type, do post or put to either create/update trim/splits============================
  startStop(colHead, toggle) {
      //if the session already stopped, then prevent any modification to splits/trims
      if (this.sessionStopped()) return;
      let rows = this.state.dataRows.slice();
      let col = this.state.dataColumns.find(c => c.title === colHead);
      if (col === 'undefined') return; 
      //1) fetch the current selected rows from user
      let selectedRows = rows.filter((r) => r.select === true);
      //2) update UI to reflect button toggles to user 
      //UI is updated instantly here, to prevent confusion if API response took too long to return etc..
      //if API returned response failed, UI should be switched back to previous state in next cycle.
      selectedRows.forEach((r) => {
          if (toggle === 'start') {
              if (col.type === 'trim' && r[colHead] === 'Stopped') {
                  //do nothing..
              } else {
                  r[colHead] = 'Running';
              }
          } else {
              if (r[colHead] !== 'Not Started') {
                  r[colHead] = 'Stopped';
              }
          }
      });
      //3) update data rows and save to localstorage..
      this.setState({ dataRows: rows }, () => localStorage.setItem('dataRows', JSON.stringify(this.state.dataRows)));
      //4) send API request to update the new/updated trim/split to database       ==============================
      if (col.type === 'trim') {
          //5.1) processing Trims ======================================
          //trim only do updates..
          this.updateTrimStatus(selectedRows, colHead, toggle);

      } else {
          //5.2) process splits ================================================================
          //split do both updates and create...
          //get updated first...
          try{
            this.updateSplitStatus(selectedRows, colHead, toggle);
          }catch(err){
            console.log(err);
          }

      }
  }

  updateTrimStatus(selectedRows, colHead, toggle) {
      let updatedAths = [];
      selectedRows.forEach((r) => {
          //trim cannot be restarted ======== 
          if (r[colHead] === 'Not Started' && toggle === 'stop') { return; }
          else if (r[colHead] === 'Stopped' && toggle === 'start') { return; }
          //find row's corresponding athelte.. 
          let ath = this.state.athletes.find(a => a.id === r.id); //find the matching athlete..
          if (!ath) return;
          let period = ath.periods.find(p => p.type.toLowerCase() === 'trim' && p.name === colHead);
          if (toggle === 'start' && period.startTime === null) {
              period.startTime = this.getCurrentDateTime();
          } else if (toggle === 'stop' && period.endTime === null) {
              period.endTime = this.getCurrentDateTime();
          } else { return; }

          updatedAths.push({ id: ath.id, period: { id: period.id, startTime: period.startTime, endTime: period.endTime, type: period.type } });
      });
      // run API ===============================================================
      if (updatedAths.length > 0) { DataModel.updatePeriods(updatedAths, 'PUT'); }
  }

  updateSplitStatus(selectedRows, colHead, toggle) {
      let updatedAths = [], newPeriodsAths = [];
      selectedRows.forEach((r) => {
          let ath = this.state.athletes.find(a => a.id === r.id);
          if (!ath) return;
          let periods = ath.periods.filter(p => p.type === 'split' && p.name === colHead).map((p) => {
              return { id: p.id, startTime: p.startTime, endTime: p.endTime, type: p.type };
          }); //get all splits with this name under athletes
          if (periods.length >= 1) {
              //only apply to the last period
              let lastPeriod = periods[periods.length - 1]; //last period under same split name's list..
              if (toggle === 'start' && lastPeriod.startTime === null) {
                  lastPeriod.startTime = this.getCurrentDateTime();
                  updatedAths.push({ id: ath.id, period: lastPeriod });
              } else if (toggle === 'start' && lastPeriod.startTime !== null && lastPeriod.endTime !== null) {
                  //already started and ended on this period,create a new one..
                  let newPeriod = { startTime: this.getCurrentDateTime(), type: 'split', name: colHead }
                  newPeriodsAths.push({ id: ath.id, period: newPeriod });
              } else if (toggle === 'stop' && lastPeriod.startTime !== null && lastPeriod.endTime === null) {
                  lastPeriod.endTime = this.getCurrentDateTime(); //apply end time 
                  updatedAths.push({ id: ath.id, period: lastPeriod });
              }
          } else {
              //split doesnt exist, create new splits==============
              if (toggle === 'start') {
                  periods[0].startTime = this.getCurrentDateTime();
                  newPeriodsAths.push({ id: ath.id, period: periods[0] });
              } else {
                  //do nothing, only start time will be recorded when a new split is added and toggled..
              }
          }
      });

      //run API ===============================================================
      if (updatedAths.length > 0) { DataModel.updatePeriods(updatedAths, 'PUT'); }
      if (newPeriodsAths.length > 0) { DataModel.updatePeriods(newPeriodsAths, 'POST'); }
  }

  //hide split from UI
  hidingSplit(colIndx) {
      //find the column and hide it
      let cols = this.state.dataColumns.slice();
      let splitCol = cols[colIndx];
      if (splitCol) {
          splitCol.show = false;
          this.setState({ dataColumns: cols });
      }
  }

  sessionStopped() { 
      if (this.state.sessionStatus === 'Stopped') return true;
      else return false;
  }


  /*Modals  ======================================================================================*/
  /*modal add split window ====================================================================== */
  showModal() {
      this.setState({ showAddSplit: true });
  }

  addSplit(name, group) {
      //1. hide modal ======================
      this.setState({ showAddSplit: false });
      //2. process selections===============
      if (this.sessionStopped()) return; //check if session still running..
      //check if split name already exist
      let cols = this.state.dataColumns;
      let existingCol = cols.find((c) => c.title === name);
      if (existingCol) { //only add new split column
          return;
      }
      cols.push({ title: name, type: 'split', show: true }); //only split can be added...
      let rows = this.state.dataRows;
      //3. set default split status when first added (not started)
      rows.forEach((r) => r[name] = 'Not Started');
      let selectedRows = [];
      if (group === 'All') {
          selectedRows = rows; //all rows are selected
      } else {
          selectedRows = rows.filter((r) => r.group === group || r.statGroup === group);
      }
      let newPeriodsAths = [];
      //4. set 'checked' status for each row that matches the selected group
      //then add new period for API request to DB
      selectedRows.filter(r => r.id !== '').forEach((r) => {
          r.select = true;
          let ath = this.state.athletes.find(a => a.id === r.id);
          newPeriodsAths.push({ id: ath.id, period: { type: 'split', name: name } });//new period//
      });
      //5. create new split on db...
      DataModel.updatePeriods(newPeriodsAths, 'POST');
  }


  handleOverlay(e) {
      let modal = document.getElementById('modal');
      if (modal !== 'undefined' && e.target === modal) {
          this.setState({ showAddSplit: false, showEndTrim: false });
      }
  }
  /*modal end current trim window ======================================================================*/
  nextTrim() { 
      let cols = this.state.dataColumns;
      let trimCols = cols.filter((c) => c.type === 'trim');
      let indx = trimCols.findIndex((c) => c.show === true);
      let currentTrim = trimCols[indx];
      let nextTrimIndx = indx + 1;
      if (trimCols.length > nextTrimIndx) { //last trim unhidable..
          trimCols.forEach((c, i) => {
              c.show = false; //hide all trim/// 
              if (i === nextTrimIndx) {
                  c.show = true; //show next trim///
              }
          });
      }
      this.setState({ showEndTrim: false, dataColumns: cols });
      //end the current trim in db stops all the running ones, ignores the 'not started' ones ====================== 
      let rows = this.state.dataRows.slice();
      let selectedRows = rows.filter(r => r[currentTrim.title] === 'Running'); //regardless if row's checked or not here..
      if (selectedRows && selectedRows.length > 0) this.updateTrimStatus(selectedRows, currentTrim.title, 'stop');
  }
  endCurrentTrim(indx) {
      if (this.sessionStopped()) return;
      //get current trim colindx 
      let trimCol = this.state.dataColumns[indx];
      if (trimCol) {
          this.setState({ currentTrimName: trimCol.title }, () => { this.setState({ showEndTrim: true }) });
      }
  }

  showAll() {
      //shows all hidden splits/trims
      let cols = this.state.dataColumns.slice();
      cols.filter(c => c.type === 'split').forEach(c => {
          c.show = true;
      });
      this.setState({ dataColumns: cols });
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
          <div className="row" onClick={this.handleOverlay.bind(this)}>
              <div className="col-md-12">
                  <div className="control-buttons pull-right">
                      <button className="btn" onClick={this.showAll.bind(this)}>Show All</button>
                      <button className="btn" onClick={this.showModal.bind(this)}>Add Split</button>
                  </div>
              </div>
              <div className="col-md-2"><GroupBox groups={this.state.PositionalGroups} positions={this.state.Positions} statusGrps={this.state.StatusGroups}
                  grpSelected={this.selectedGroupChanged.bind(this)} /></div>
              <TagTable columns={this.state.dataColumns} rows={this.state.dataRows} goNext={this.endCurrentTrim.bind(this)}
                  selectAll={this.checkAll.bind(this)} startStopToggle={this.startStop.bind(this)} hideSplit={this.hidingSplit.bind(this)} selectionChanged={this.selectChange.bind(this)} />
              <Modal show={this.state.showAddSplit} children={<Form submit={this.addSplit.bind(this)} splitNames={this.state.splitNames} groups={this.state.modalGrps} />} />
              <Modal show={this.state.showEndTrim} children={<EndTrimForm confirm={this.nextTrim.bind(this)} name={this.state.currentTrimName} />} />

          </div>
      );
  }
}


export default App;
