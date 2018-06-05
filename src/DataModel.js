import axios from 'axios';

const _apiBaseUrl = 'https://vxapi.azurewebsites.net/api';
const _getAthletes = '/athletes/{sessionID}';
const _periodApi = '/athletes/periods';

class DataModel {
    constructor(cols, rows, sessionID) {
        this.athletes = [];
        this.columns = cols;
        this.rows = rows;
        this.groups = [];
        this.statGroups = [];
        this.positions = [];
        this.modalgrps = [];
        this.sessionID = sessionID;
    }

    digestData() {
        this.getDataColumns();
        this.getDataRows();
        this.getAllGroups();
    }

    getAthletes() {
        try { 
            return axios(`${_apiBaseUrl}${_getAthletes.replace('{sessionID}', this.sessionID)}`); 
        } catch (err) {
            console.log(err); 
        }
    }

    getDataColumns() {
        //1. fetch columns from local storage..
        let columns = this.columns;
        if (columns === null && this.athletes.length === 0) return null; //no athletes 
        if (columns.length === 0) {
            //init columns ... 
            columns.push({ 'title': 'select', 'type': '', 'show': true });
            columns.push({ 'title': 'name', 'type': '', 'show': true });
        }
        //2. getting all the unique columns from data retrieved from api .....................
        this.athletes.forEach((ath) => {
            let periods = new Set(ath.periods.map((p, i) => {
                let show = true;
                if (p.type.toLowerCase() === 'trim' && i !== 0) {
                    show = false; //initially only the first trim period is shown, rest arent..
                }
                return { 'title': p.name, 'type': p.type.toLowerCase(), 'show': show }
            })); //get unique period names...
            //3. add new column into column list..
            periods.forEach((p) => {
                if (!columns.find((c) => c.title === p.title))
                    columns.push(p); //get the unique columns, ignore existing columns and its status??
            });
        });
        this.columns = columns;
        //4. persist data in browser
        localStorage.setItem('dataColumns', JSON.stringify(this.columns));
    }

    getDataRows() {
        //1. fetch rows from local storage..
        let rows = this.rows;
        if (rows === null && this.athletes.length === 0) return null; //no athletes 
        if (rows.length === 0) {
            //init rows ......   
            rows.push({ 'id': '', 'select': false, 'name': '', 'group': '', 'statGroup': '', 'position': '' });
            rows.push({ 'id': '', 'select': false, 'name': '', 'group': '', 'statGroup': '', 'position': '' });
        }
        //2. getting all rows from athletes to compare with current stored rows....
        this.athletes.forEach(ath => {
            if (!rows.find((r) => r.name === ath.name)) {
                //add new athlete rows
                let newAth = { 'id': ath.id, 'select': false, 'name': ath.name, 'group': ath.group, 'statGroup': ath.statGroup, 'position': ath.position };
                this.columns.filter(c => c.type !== '').forEach((c) => { //get column rows for UI
                    let currentTrimSplits = ath.periods.filter(p => p.name === c.title);
                    let status = this.getTrimSplitStatus(currentTrimSplits);
                    newAth[c.title] = status; //assign the status to this column.
                });
                rows.push(newAth);
            } else {
                //update existing athlete row with added splits or status...
                let row = rows.find(r => r.id === ath.id);
                this.columns.filter(c => c.type !== '').forEach((c) => { //get column rows for UI
                    //update column status ==========================================
                    let currentTrimSplits = ath.periods.filter(p => p.name === c.title);
                    let status = this.getTrimSplitStatus(currentTrimSplits);
                    row[c.title] = status; //assign the status to this column.
                });
            }
        });
        this.rows = rows;

        //persist data  
        localStorage.setItem('dataRows', JSON.stringify(this.rows));
    }

    getAllGroups() {
        //fetch all the groups in all rows =====================
        let grps = [], statGrps = [], positions = [], modalgrps = [];
        modalgrps.push({ 'value': 'All', 'label': 'All' });
        this.rows.filter(r => r > 1).forEach((r) => {
            if (r.group !== null) {
                grps.push(r.group);
                modalgrps.push({ 'value': r.group, 'label': r.group });
            }
            if (r.statGroup !== null) {
                statGrps.push(r.statGroup);
                modalgrps.push({ 'value': r.statGroup, 'label': r.statGroup });
            }
            if (r.position !== null) {
                positions.push(r['position']);
            }
        });
        this.groups = grps;
        this.statGroups = statGrps;
        this.positions = positions;
        this.modalgrps = modalgrps;
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

    //serverside api post/put method======
    static updatePeriods(aths, method) {
        return fetch(_apiBaseUrl + _periodApi, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: method,
            mode: 'CORS',
            body: JSON.stringify(aths)
        }).then(res => console.log(res)).catch(err => console.log(err));
    }
}

export default DataModel;