import axios from 'axios';
const _apiBaseUrl = 'https://vxapi.azurewebsites.net/api';
const _getAthletes = '/athletes/{sessionID}';
const _periodApi = '/athletes/periods';

export function fetchAthletes(sessionID){
    try { 
        return axios(`${_apiBaseUrl}${_getAthletes.replace('{sessionID}', sessionID)}`); 
    } catch (err) {
        console.log(err); 
    }
}