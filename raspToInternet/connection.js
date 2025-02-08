const conn = {
    host: 'raspberrypi.local',
    port: 9001,
    api: 'mongoDB url here'
}

const sendData = (method, payload) => {
    fetch(`${api}`, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...payload })
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        if(data.ok){
            console.log('success sending data')
            return
        }
        console.log('error sending data, trying again')
        sendData(method, payload);
    })
    .catch(error => {
        console.log(error || 'error sending data, trying again')
        sendData(method, payload)
    });
}

module.exports = { conn, sendData }