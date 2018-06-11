import { observable, computed, action } from "mobx";
import {ColumnType, ColumnStatus } from '../Enum';
import {fetchAthletes} from './Transport';

export default class DataStore {
    @observable athletes = [];
    @observable data = []; 
    @observable positionalGroups = [];
    @observable statusGroups = [];
    @observable positions = [];
    @observable modalGrps = [];

    constructor(rootStore){
        this.root = rootStore;
    }

   //digest the api returned data ========================================================================
   getData(){
    //get 2-dimentional array of athletes cols => data in each column
    //first column in array has 'checkboxes/athlete name'  
    let columns = [], rows = [];
    this.athletes.forEach((ath, i) => { 
        rows.push({select: this.getSelectStat(0, i), name: ath.name, group: ath.group, position: ath.position, 
            statGroup: ath.statGroup, id:ath.id});
    }); 
    columns.push({title: 'header', type: ColumnType.Other, show: true, data: rows});
    this.athletes.forEach(ath => { 
        let periods = [];
        ath.periods.forEach((p, i) => {
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
            if (!columns.find((c) => c.title === p.title))
                columns.push({title: p.title, type: p.type, show: this.getColumnShowStat(i, p.type), status: p.status, data: [] }); //get the unique columns, ignore existing columns and its status??
        });
    });
    
    
    //add data to each column after header column
    columns.filter((c, i) => i>0).forEach((c, i)=>{
        c.data = this.getColumnData(c.title, i);
    });
    this.data = columns;  
    console.log(this.data);
}

        //no update to select status as its local state..
        getSelectStat(colIndx, i){
            if(this.data.length === 0) return false;     
            if(this.data[colIndx].data.length === this.athletes.length) return this.data[colIndx].data[i].select;
            else return false;
        }

    getColumnData(title, indx){
        let data = [];
        this.athletes.forEach((ath, i) => {
            let periods = ath.periods.filter(p=> p.name === title);
            let status = 'Not Started';
            if(periods) status = this.getTrimSplitStatus(periods); 
            data.push({status: status, select: this.getSelectStat(indx, i)});
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