import { observable, computed, action } from 'mobx';
import { ColumnType, ColumnStatus } from './Enum';


export default class UIStore {
    @observable allChecked = false;

    @observable showAddSplit = false;

    @observable showEndTrim = false;

    @observable sessionID = '';

    @observable allChecked = false;

    @observable showAddSplit = false;

    @observable showEndTrim = false;

    @observable sessionStatus = 'Running';

    @observable sessionLoaded = false;

    @observable warning = false;

    @observable unitsConnected = '5';

    @observable loading = true;

    @observable groupSelectedOption = 1;

    @observable newSplitName = '';

    @observable preSelectGrp = '';

    @observable hideAlertMsg = true;

    @observable currentTrimName = '';

    @observable formLocked = false;

    @observable currentTable = 'Metric';

    @observable showMetricsModal = false;

    @observable showProgressiveModal = false;

    constructor(rootStore) {
        this.root = rootStore;
    }


    @computed get session() {
        this.sessionID = '277876';
        return this.sessionID; // demo purpose..
    }

    /*
    * Group box section on left =================================================================
    */
    @computed get displayedGroups() {
        switch (this.groupSelectedOption) {
            case 1:
                return this.root.data.positionalGroups;
            case 2:
                return this.root.data.positions;
            case 3:
                return this.root.data.statusGroups;
            default:
                return [];
        }
    }

    @action
    groupSelectionChanged(val) {
        this.groupSelectedOption = parseInt(val, 10);
    }

    @action
    grpSelected(grpName) {
        // select the groups
        const rowIndex = [];
        const newData = this.root.data.data.slice();
        newData[0].data.forEach((d, i) => {
            if (d.group === grpName || d.position === grpName
                || d.statGroup === grpName) rowIndex.push(i);
        });
        newData.forEach((d) => {
            d.data.forEach((dt, i) => {
                if (rowIndex.includes(i)) dt.select = !dt.select;
            });
        });
        this.root.data.data.replace(newData);
    }

    /**
     * Button section on top right ============================================
     */
    @action
    showAllSplits() {
        const newData = this.root.data.data.slice();
        newData.filter(d => d.type === 'split').forEach((d) => { d.show = true; });
        this.root.data.data.replace(newData);
    }

    @action
    handleOverlay(e) {
        const modal = document.getElementById('modal');
        if (modal !== 'undefined' && e.target === modal) {
                this.showAddSplit = false;
                this.showEndTrim = false;
                this.showMetricsModal = false;
                this.showProgressiveModal = false;
        }
    }

    /**
     * Split modal toggle section =======================================
     */
    @action
    addSplit() {
        this.showAddSplit = !this.showAddSplit;
    }

    @action
    setNewSplitName(val) {
        this.newSplitName = val;
    }

    @action
    preSelectGroup(grp) {
        this.preSelectGrp = grp;
    }

    @action
    showAlert() {
        this.hideAlertMsg = false;
    }

    @action
    addNewSplitColumn() {
        const grp = (!this.preSelectedGrp || this.preSelectGroup === '') ? 'All' : this.preSelectedGrp;
        // 1. hide modal
        this.showAddSplit = false;
        this.root.data.addSplit(this.newSplitName, grp);
    }


    /**
     * table clicks etc =============================================================
     */
    @action
    checkAllRows() {
        // check all rows on screen...
        const newData = this.root.data.data.slice();
        this.allChecked = !this.allChecked;
        newData.forEach(d => d.data.forEach((dt) => { dt.select = this.allChecked; }));
        this.root.data.data.replace(newData);
    }

    @action
    checkOneRow(rowIndx) {
        const newData = this.root.data.data.slice();
        newData.forEach((d) => { d.data[rowIndx].select = !d.data[rowIndx].select; });
        this.root.data.data.replace(newData);
    }

    @action
    showNextTrim(title) {
        // show modal
        this.showEndTrim = true;
        this.currentTrimName = title;
    }

    @action
    endCurrentTrim() {
        // 1) find the current trim and then hide it
        const data = this.root.data.data.slice();
        const trims = data.filter(d => d.type === ColumnType.Trim);
        const currentDisplayedTrimIndx = trims.findIndex(t => t.show);
        const currentTrim = trims[currentDisplayedTrimIndx];
        const nextTrimIndx = currentDisplayedTrimIndx + 1;
        // check whether next trim exists or not then set status
        if (trims.length > nextTrimIndx) {
            trims.forEach((c, i) => {
                c.show = false;
                if (i === nextTrimIndx) c.show = true;
            });
        }
        this.showEndTrim = false; // hide trim modal
        this.root.data.data.replace(data); // update table data
        // 2) end current trim by toggle all 'Running' sessions to 'Stop' and send API requests
        const endingTrims = [];
        currentTrim.data.forEach((d, i) => { if (d.status === 'Running') endingTrims.push(i); });
        if (endingTrims) this.root.data.toggleTrimSplit(endingTrims, currentTrim.title, 'stop');
    }

    @action
    hideColumn(title) {
        const newData = this.root.data.data.slice();
        newData.find(d => d.title === title).show = false;
        this.root.data.data.replace(newData);
    }

    @action
    toggleStartStop(toggle, title) {
        // 1. set status of column to processing//
        const newData = this.root.data.data.slice();
        const col = newData.find(d => d.title === title);
        col.status = ColumnStatus.Processing;
        this.root.data.data.replace(newData);
        // 2. get the selected rows and send API request..
        const selectedRows = [];
        col.data.forEach((d, i) => (d.select ? selectedRows.push(i) : ''));
        if (selectedRows.length > 0) this.root.data.toggleTrimSplit(selectedRows, title, toggle);
    }

    // live stream section
    @action
    formLocking() {
        this.root.data.lockForm(this.formLocked);
        this.formLocked = !this.formLocked; // set status after locking
    }


    // depending on which radio button is currently selected, table display will change accordingly
    @action
    tabSelectionChanged(selection) {
        switch (selection) {
            case '1':
                this.currentTable = 'Metric';
                break;
            case '2':
                this.currentTable = 'Progress';
                break;
            case '3':
                this.currentTable = 'LiveTag';
                break;
            default:
            break;
        }
    }

    @action
    showTableColumnSelection() {
        if (this.currentTable === 'Metric') this.showMetricsModal = true;
        else if (this.currentTable === 'Progress') this.showProgressiveModal = true;
        return null; // live tag do nothing when clicked..
    }
}
