import axios from 'axios';
const _apiBaseUrl = 'https://vxapi.azurewebsites.net/api';
const _getAthletes = '/athletes/{sessionID}';
const _periodApi = '/athletes/periods'; 
/**
 * handles data transport layer functions ==============================================
 */
//https://vxapi.azurewebsites.net
//get api/sessions/{sessionId?}
//get bm api/benchmarkgroups/{sessionId?}
//get metrics api/livemetrics/{sessionId?}

export function fetchAthletes(sessionID){
    try { 
        return axios(`${_apiBaseUrl}${_getAthletes.replace('{sessionID}', sessionID)}`); 
    } catch (err) {
        console.log(err); 
    }
}

export function updatePeriods(aths, method) {
    return fetch(_apiBaseUrl + _periodApi, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: method,
        body: JSON.stringify(aths)
    });
}