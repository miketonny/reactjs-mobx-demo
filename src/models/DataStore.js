import { observable, computed, action } from "mobx";
import {ColumnType, ColumnStatus } from './Enum';


export default class DataStore {
  @observable data = [];


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

    
}