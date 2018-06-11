import { observable, computed, action } from "mobx";
import {ColumnType, ColumnStatus } from '../Enum';


export default class UIStore {
    @observable allChecked = false; 
    @observable showAddSplit = false;
    @observable showEndTrim = false;
    @observable sessionID = '';
    @observable sessionStatus = 'Running';
    @observable loading = false;
    @observable groupSelectedOption = 1;

    constructor(rootStore){
        this.root = rootStore;
    }

    @action
    addSplitModalToggle(){
        this.showAddSplit = !this.showAddSplit;
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
    groupSelectionChanged(e){
        console.log(e);
    }
 

}