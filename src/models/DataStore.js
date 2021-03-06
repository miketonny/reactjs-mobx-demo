import { observable, action } from 'mobx';
import { ColumnType, ColumnStatus } from './Enum';
import { updatePeriods, checkSession } from './Transport';

export default class DataStore {
    @observable data = [];

    @observable positionalGroups = [];

    @observable statusGroups = [];

    @observable positions = [];

    @observable modalGrps = [];

    @observable metricAthletes = [];

    @observable allMetricData = [];

    @observable session = {};

    athletes = [];

    splitNames = [];

    constructor(rootStore) {
        this.root = rootStore;
        this.splitNames.push({ 'value': 'Running Drill', 'label': 'Running Drill' });
        this.splitNames.push({ 'value': 'Split 1', 'label': 'Split 1' });
        this.splitNames.push({ 'value': 'Split 2', 'label': 'Split 2' });
        this.splitNames.push({ 'value': 'Split 3', 'label': 'Split 3' });
        this.splitNames.push({ 'value': 'Drill', 'label': 'Drill' });
       
    }

    initAthleteData() {
        this.allMetricData.replace([{title: 'sig', name: 'SignalStrength', data:[], show:true}, {title: 'sticker', name:'sticker', data: [], show:true},
        {title: 'Athlete', name:'Athlete', data:[], show:true}, {title: 'Position', name:'Position', data:[], show:true}, {title: 'Heart Rate', name:'HR', data:[], show:true},
        {title: 'Total Distance', name:'Distance', data:[], show:true}, {title: 'Total Sprints', name:'Sprints', data:[], show:true},  {title: 'HR Hi Dur', name:'HiintHRDuration', data:[], show:true},
        {title: 'HR Hi Dist', name:'HiintHRDistance', data:[], show:true},{title: 'Sp Hi Dur', name:'HiintSpDuration', data:[], show:true},
        {title: 'Sp Hi Dist', name:'HiintSpDistance', data:[], show:true},{title: 'Energy Cons.', name:'EC', data:[], show:true}, 
        {title: 'Total Duration', name:'Duration', data:[], show:true},{title: 'Avg Speed', name:'AvgSpeed', data:[], show:true},
        {title: 'Max Speed', name:'MaxSpeed', data:[], show:true},{title: 'Avg HR', name:'AvgHR', data:[], show:true},
        {title: 'Max HR', name:'MaxHR', data:[], show:true},{title: 'Jump Rate', name:'JumpRate', data:[], show:true},
        {title: 'Jumps', name:'Jumps', data:[], show:true},{title: 'Impact Rate', name:'ImpactRate', data:[], show:true},   
        {title: 'Body Impacts', name:'BodyImpacts', data:[], show:true},{title:  'Distance Rate', name:'DistanceRate', data:[], show:true},
        {title: 'StatsGroup', name:'StatsGroup', data:[], show:true},{title: 'PositionalGroup', name:'PositionalGroup', data:[], show:true},
        {title: 'type', name:'type', data:[], show:true}]);
    }

    // digest the api returned data =================================================
   @action
    getLiveTagData(aths) {
        // get 2-dimentional array of athletes cols => data in each column
        // first column in array has 'checkboxes/athlete name'
        let columns = [], rows = [];            
        if (!aths || aths.length === 0) return;
        rows = this.processHeaderColumn(aths);
        columns = this.processDataColumn(aths);
        columns.unshift({title: 'header', type: ColumnType.Other, show: true, data: rows}); 
        // compare and update data
        this.updateDataStatus(columns);
        // this.data = columns;
        this.getAllGroups();
        this.athletes = aths;
        this.root.ui.loading = false;
    }

    @action
    updateDataStatus(newData){
        if(this.data.length === 0) return this.data = newData ; //initial load...
        this.data.replace(newData);
    }


    processHeaderColumn(aths){ 
        let rows = [];
        aths.forEach((ath, i) => {
            rows.push({select: this.getSelectStat(0, i, aths.length), name: ath.name, group: ath.group, position: ath.position, 
                statGroup: ath.statGroup, id:ath.id});
        });
        return rows;
    }

    processDataColumn(aths){
        let periods = [], cols = [];
        aths[0].periods.forEach((p, i) => {
            let show = true;
            if (p.type.toLowerCase() === 'trim' && i !== 0) {
                show = false; //initially only the first trim period is shown, rest arent..
            }
            const colType = p.type.toLowerCase() === 'trim'? ColumnType.Trim : ColumnType.Split;
            if(!periods.find(period => period.title === p.name )){
                periods.push({ title: p.name, type: colType, show: show, status: ColumnStatus.Idle });
            }               
        }); //get unique period names...
        //3. add new column into column list.. 
        periods.forEach((p,i) => {
            if (!cols.find((c) => c.title === p.title))
            cols.push({title: p.title, type: p.type, show: this.getColumnShowStat(i, p.type), status: p.status, data: this.getColumnData(p.title, i, aths) }); //get the unique columns, ignore existing columns and its status??
        });
        return cols;

    }

    //no update to select status as its local state..
    getSelectStat(colIndx, i, rowCnt){
        if(this.data.length === 0) return false;     
        if(this.data[colIndx].data.length === rowCnt) return this.data[colIndx].data[i].select;
        else return false;
    }

    getColumnData(title, indx, aths){
        let data = [];
        aths.forEach((ath, i) => {
            let periods = ath.periods.filter(p=> p.name === title);
            let status = 'Not Started';
            if(periods) status = this.getTrimSplitStatus(periods); 
            data.push({status: status, select: this.getSelectStat(indx, i, aths.length)});
        })
        return data;
    }

    getColumnShowStat(colIndx, type){
        if(this.data.length === 0) {
            if(type === ColumnType.Trim && colIndx !== 0) return false;
            return true; 
        } 
        
        if(this.data[colIndx+1]) return this.data[colIndx+1].show; 
        else return true; //new column added on another pc..     
    }

    getTrimSplitStatus(periods) {
        let status = 'Not Started';
        periods.forEach((p) => {
            if (p.startTime !== null && p.endTime === null) {
                //started but not end, so running..
                status = 'Running';
            } else if (p.startTime !== null && p.endTime !== null) {
                //started & ended.. so stop
                status = 'Stopped';
            } else {
                status = 'Not Started';
            }
        });
        return status;
    }

    getAllGroups() {
        //fetch all the groups in all rows =====================
        let grps = [], statGrps = [], positions = [], modalgrps = [];
        modalgrps.push({ 'value': 'All', 'label': 'All' });
        if(!this.data || this.data.length === 0) return; //no data yet.
        this.data[0].data.forEach((r) => {
            if (r.group !== null) {
                if (!grps.includes(r.group)) {
                    grps.push(r.group);
                    modalgrps.push({ 'value': r.group, 'label': r.group });
                }
            }
            if (r.statGroup !== null) {
                if (!statGrps.includes(r.statGroup)) {
                    statGrps.push(r.statGroup);
                    modalgrps.push({ 'value': r.statGroup, 'label': r.statGroup });
                 }
            }
            if (r.position !== null) {
                if (!positions.includes(r.position)) {
                    positions.push(r.position);
                }            
            }
        });
        this.positionalGroups = grps;
        this.statusGroups = statGrps;
        this.positions = positions;
        this.modalGrps = modalgrps;
    }

    //does the actual processing of toggling, including UI render/API calls/callbacks
    toggleTrimSplit(rowIndxes, title, toggle){
        let updatedAths = [];
        let newAths = [];
        //1) fetching the new or updated records from selected rows on screen, along with their HTTP method needed
        this.athletes.forEach((ath, i) => {
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
        updatePeriods(athletes, method).then((res) => { 
            console.log(res);
            let updatedIndxes = [];
            this.athletes.forEach((a, i) => {
                if (athletes.find(ath => ath.id === a.id)) updatedIndxes.push(i);
            });
            //2. render UI when successfully updated to db =================
            this.updateTrimSplitStatus(updatedIndxes, colTitle, toggle); 
        }).catch(err => {
            console.log(err); //update failed to API, log to console -debug
        }); 
    }
    
    updateTrimSplitStatus(indxes, title, toggle){
        let data = this.data.slice(); 
        let colIndx = data.findIndex(d => d.title === title);
        data[colIndx].status = ColumnStatus.Idle; //process finishes 
        data[colIndx].data.forEach((d, i) => {
            if(indxes.includes(i)) d.status = toggle === 'start' ? 'Running' : 'Stopped';
        })
        this.data.replace(data);
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

     //get local ISO time string to match database date time format...
     getCurrentDateTime() {
        return new Date().getFullYear() + '-' + ('0' + (new Date().getMonth() + 1)).slice(-2) + '-' + ('0' + new Date().getDate()).slice(-2) + 'T' +
            ('0' + new Date().getHours()).slice(-2) + ':' + ('0' + new Date().getMinutes()).slice(-2) + ':' + ('0' + new Date().getSeconds()).slice(-2) + '.' +
            new Date().getMilliseconds();
    }

    
    addSplit(name, grp){
           //2. check if split name already exist
           let data = this.data.slice();
           let existingCol = data.find(d => d.title === name);
           if(existingCol) return; //split already exists, dont do anything..
           let selectAths = []; 
           if(grp === 'All') selectAths = data[0].data;
           else selectAths = data[0].data.filter(d => d.group === grp || d.statGroup === grp);
           if(!selectAths || selectAths.length === 0) return;
           //3. add new split column, add for all athletes ===============================
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
           this.athletes.forEach((ath, i) => {
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
           //4. api call ==========================================
           if(newPeriods.length > 0){
            updatePeriods(newPeriods, 'POST').then(() => { 
                this.data.replace(data);
            }).catch((err) => console.log(err)); 
           }
    }


    // live stream section
    @action
    lockForm(lock) {
        //send locking form info to server....
    }

    @action
    async validateSession() {
        if (!this.root.ui.sessionID) return;
        this.root.ui.warning = false; // reset warning text upon validation
        // check whether session has admin code
        const sessionArr = this.root.ui.sessionID.split('-');
        let id = '';
        [id] = sessionArr; // first id as the actual 6-digit session id
        console.log(id);
        try {
            const session = await checkSession(id);
            this.session = session.data;
            // console.log(session);
            // set session loaded and redirect to stream page.
            if (session) this.root.ui.sessionLoaded = true;
        } catch (error) {
            console.log(error);
        }
    }

    @action
    refreshAllMetricData(data) {
        this.metricAthletes.replace(data);
        if (this.metricAthletes.length === 0) return;
        this.initAthleteData();
        // get column data, loop through all athletes returned from server,
        // then map each athlete's property with data tables column
        // and assign them into each column data array..
        const nameCol = this.allMetricData.find(a => a.name === 'Athlete');
        const signalCol = this.allMetricData.find(a => a.name === 'SignalStrength');
        const stickerCol = this.allMetricData.find(a => a.name === 'sticker');
        const posCol = this.allMetricData.find(a => a.name === 'Position');
        const hrCol = this.allMetricData.find(a => a.name === 'HR');
        const distCol = this.allMetricData.find(a => a.name === 'Distance');
        const sprintsCol = this.allMetricData.find(a => a.name === 'Sprints');
        const hiintHRDurCol = this.allMetricData.find(a => a.name === 'HiintHRDuration');
        const hiintHRDisCol = this.allMetricData.find(a => a.name === 'HiintHRDistance');
        const hiintSpDurCol = this.allMetricData.find(a => a.name === 'HiintSpDuration');
        const hiintSpDisCol = this.allMetricData.find(a => a.name === 'HiintSpDistance');
        const ecCol = this.allMetricData.find(a => a.name === 'EC');
        const durCol = this.allMetricData.find(a => a.name === 'Duration');
        const avgSpdCol = this.allMetricData.find(a => a.name === 'AvgSpeed');
        const maxSpdCol = this.allMetricData.find(a => a.name === 'MaxSpeed');
        const avgHRCol = this.allMetricData.find(a => a.name === 'AvgHR');
        const maxHRCol = this.allMetricData.find(a => a.name === 'MaxHR');
        const jumpRateCol = this.allMetricData.find(a => a.name === 'JumpRate');
        const jumpsCol = this.allMetricData.find(a => a.name === 'Jumps');
        const impactRateCol = this.allMetricData.find(a => a.name === 'ImpactRate');
        const impactsCol = this.allMetricData.find(a => a.name === 'BodyImpacts');
        const distRateCol = this.allMetricData.find(a => a.name === 'DistanceRate');
        const statGrpCol = this.allMetricData.find(a => a.name === 'StatsGroup');
        const posGrpCol = this.allMetricData.find(a => a.name === 'PositionalGroup');
    //    const posGrpCol = this.allMetricData.find(a => a.name === 'PositionalGroup');

        this.metricAthletes.forEach((ath) => {
            const name = `${ath.lastName}, ${ath.firstName}`;
            nameCol.data.push(name);
            signalCol.data.push(ath.liveMetric.signal);
            stickerCol.data.push(ath.stickerNumber);
            posCol.data.push(ath.positin);
            hrCol.data.push(ath.liveMetric.hr);
            distCol.data.push(ath.liveMetric.distance);
            sprintsCol.data.push(ath.liveMetric.sprints);
            hiintHRDurCol.data.push(ath.liveMetric.highIntensityHRDuration);
            hiintHRDisCol.data.push(ath.liveMetric.highIntensityHRDistance);
            hiintSpDurCol.data.push(ath.liveMetric.highIntensitySpeedDuration);
            hiintSpDisCol.data.push(ath.liveMetric.highIntensitySpeedDistance);
            ecCol.data.push(ath.liveMetric.energyConsumption);
            durCol.data.push(ath.liveMetric.duration);
            avgSpdCol.data.push(ath.liveMetric.avgSpeed);
            maxSpdCol.data.push(ath.liveMetric.maxSpeed);
            avgHRCol.data.push(ath.liveMetric.avgHR);
            maxHRCol.data.push(ath.liveMetric.maxHR);
            jumpRateCol.data.push(ath.liveMetric.jumpRate);
            jumpsCol.data.push(ath.liveMetric.jumps);
            impactRateCol.data.push(ath.liveMetric.impactRate);
            impactsCol.data.push(ath.liveMetric.ibodyImpacts);
            distRateCol.data.push((ath.liveMetric.distance / ath.liveMetric.duration).toFixed(2));
            posGrpCol.data.push(ath.group);
            statGrpCol.data.push(ath.gamingGroup);
        });
        this.root.ui.loading = false;
    }
}
