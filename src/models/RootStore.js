import { observable, computed, action } from "mobx"; 
import dataStore from './DataStore';
import uiStore from './UIStore';

export default class RootStore { 
    constructor() {
        this.data = new dataStore(this);
        this.ui = new uiStore(this); 
    }

    @computed get isLoading(){
        return this.ui.loading;
    }
 
}
