import { observable, computed, action, autorun, reaction } from "mobx";
import {ColumnType, ColumnStatus } from '../Enum';


export default class UIStore {
    @observable allChecked = false; 
    @observable showAddSplit = false;
    @observable showEndTrim = false;
    @observable sessionID = '';
    @observable sessionStatus = 'Running';
    @observable loading = false;
    @observable groupSelectedOption = 1;
    @observable newSplitName = '';
    @observable preSelectGrp = '';
    @observable hideAlertMsg = true;

    constructor(rootStore){
        this.root = rootStore;
    }


    @computed get session(){
        return this.sessionID = '277876';
    }

    @computed get displayedGroups(){    
        switch (this.groupSelectedOption) {
            case 1:
                return this.root.data.positionalGroups; 
            case 2:
                return this.root.data.positions;  
            case 3:
                return this.root.data.statusGroups;  
            default:
                break;
        }
    }

    @action
    groupSelectionChanged(val) { 
        this.groupSelectedOption = parseInt(val, 10);
    }
  
    @action
    grpSelected(grpName){
        //select the groups 
        let rowIndex = [];
        let newData = this.root.data.data.slice();
        newData[0].data.forEach((d,i) => {
            if(d.group === grpName || d.position === grpName || d.statGroup === grpName) rowIndex.push(i);
        });
        newData.forEach(d => {
            d.data.forEach((dt, i) => {
                if(rowIndex.includes(i)) dt.select = !dt.select;
            })
        });
        this.root.data.data.replace(newData);
    }

    @action
    showAllSplits(){
        let newData = this.root.data.data.slice();
        newData.filter(d => d.type === 'split').forEach(d => d.show = true);
        this.root.data.data.replace(newData);
    }


    /**
     * Split modal toggle section =======================================
     */
    @action
    addSplit(){
        this.showAddSplit = !this.showAddSplit;
    }

    @action
    setNewSplitName(val){
        this.newSplitName = val;
    }

    @action
    preSelectGroup(grp){
        this.preSelectGrp = grp;
    }

    @action
    showAlert(){
        this.hideAlertMsg = false;
    }
    @action
    addNewSplitColumn(name, preSelectedGrp){
        let grp = this.preSelectGrp===''? "All": this.preSelectGrp;
        //data processing...
    }


    /**
     * table clicks etc
     */
    @action
    checkAllRows() {
        //check all rows on screen...
        let newData = this.root.data.data.slice();
        this.allChecked = !this.allChecked;
        newData.forEach(d => d.data.forEach(dt => dt.select = this.allChecked));
        this.root.data.data.replace(newData);
    }
    @action
    checkOneRow(rowIndx){
        let newData = this.root.data.data.slice();
        newData.forEach(d => d.data[rowIndx].select = !d.data[rowIndx].select);
        this.root.data.data.replace(newData);
    }

    @action
    showNextTrim(title){
        //show modal

    }
    @action
    hideColumn(title){
        let newData = this.root.data.data.slice();
        newData.find(d => d.title === title).show = false;
        this.root.data.data.replace(newData);
    }

}