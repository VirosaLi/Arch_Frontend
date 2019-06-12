const request = require('request');

function requestFacilityData() {
    return new Promise((resolve, reject)=> {
        request('http://localhost:4000/facility', (error, response, body) => {
            if (error) {
                reject(error);
            } else {
                resolve(JSON.parse(body))
            }
        });
    })
}

export default requestFacilityData()
