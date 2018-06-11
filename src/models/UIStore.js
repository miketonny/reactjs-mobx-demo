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
        this.root.data.data[0].data.forEach(d => {
            if(d.group === grpName || d.position === grpName || d.statGroup === grpName) d.select = true;
        });
    }

    @action
    showAll(){

    }

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

}