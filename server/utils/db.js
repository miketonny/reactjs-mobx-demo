const axios = require('axios');

const apiBaseUrl = 'https://vxapi.azurewebsites.net/api';
const getSession = '/sessions/';
const getBenchmark = '/benchmarkgroups/periods/';
const getMetrics = '/livemetrics/';
const getAthletes = '/athletes/';

/**
 * handles data transport layer functions ==============================================
 */
// get api/sessions/{sessionId?}
// get bm api/benchmarkgroups/{sessionId?}
// get metrics api/livemetrics/{sessionId?}

const validateSession = (sessionID) => {
    try {
        return axios(`${apiBaseUrl}${getSession}${sessionID}`);
    } catch (err) {
        return {};
    }
};

// fetch athlete data for given session.
const fetchAthleteData = async (sessionID) => {
    try {
        const result = await axios(`${apiBaseUrl}${getMetrics}${sessionID}`);
        return result.data.records;
    } catch (err) {
        return err;
    }
};

const fetchLiveTagData = async (sessionID) => {
    try {
        const result = await axios(`${apiBaseUrl}${getAthletes}${sessionID}`);
        console.log(result.data);
        return result.data;
    } catch (error) {
        return error;
    }
}

module.exports = { validateSession, fetchAthleteData, fetchLiveTagData };
