import { observable, computed, action, autorun } from "mobx";
import {ColumnType, ColumnStatus } from '../Enum';
import {fetchAthletes} from './Transport';

export default class DataStore { 
    @observable data = []; 
    @observable positionalGroups = [];
    @observable statusGroups = [];
    @observable positions = [];
    @observable modalGrps = [];
    splitNames = [];

    constructor(rootStore){
        this.root = rootStore; 
        this.splitNames.push({ 'value': 'Running Drill', 'label': 'Running Drill' });
        this.splitNames.push({ 'value': 'Split 1', 'label': 'Split 1' });
        this.splitNames.push({ 'value': 'Split 2', 'label': 'Split 2' });
        this.splitNames.push({ 'value': 'Split 3', 'label': 'Split 3' });
        this.splitNames.push({ 'value': 'Drill', 'label': 'Drill' });
    }

   //digest the api returned data ========================================================================
     getData(){
        //get 2-dimentional array of athletes cols => data in each column
        //first column in array has 'checkboxes/athlete name'         
        let columns = [], rows = []; 
        fetchAthletes(this.root.ui.session).then(res => {
            let aths = res.data;             
            if (!aths || aths.length === 0) return;
            rows = this.processHeaderColumn(aths);
            columns = this.processDataColumn(aths);
            columns.unshift({title: 'header', type: ColumnType.Other, show: true, data: rows}); 
            //compare and update data
            this.updateDataStatus(columns);
            //this.data = columns; 
            this.getAllGroups();
        });
    }
    
    @action
    updateDataStatus(newData){
        if(this.data.length === 0) return this.data = newData ; //initial load...
        this.data.replace(newData);
        // if(this.data[0].data.length < newData[0].data.length){
        //     //new athlete found
        //     this.data = newData;
        // }
        // //now only update what's needed to update
        // this.data.forEach((d, i) => {
        //     if(d.show !== newData[i].show) this.data[i].; 
        //     d.data.forEach((dt, k) => {
        //         if(dt.status !== newData[i].data[k].status) dt.status = newData[i].data[k].status; //update status..
        //     });
        // });
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



    
}