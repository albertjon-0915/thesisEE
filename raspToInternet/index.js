const mqtt = require('mqtt');
const { conn, sendData } = require('../raspCodes/connection.js'); // TODO: Change to rasp file directory

const client = mqtt.connect(`${conn.host}:${conn.port}`);
const topics = 'esp32/data/#';

let triggerSend = false;

const dataPayload = {};

/*
    Sample Payload
    const dataPayload = {
        client1: {
            voltage: '',
            current: ''
        }
    }
*/

const sendDataPerHour = (func, delay) => {
    let timer;

    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => func.apply(this, args), delay);
    };
}

const canStartSendingPayload = () => {
    const now = new Date();
    const minutes = now.getMinutes();

    if(minutes === 0) return true;

    return false;
}

const processDataPayload = (topicName, message) => {
    dataPayload[topicName] = { 
        ...dataPayload, 
        ...JSON.parse(message.toString()) 
    }
}

// Handle connection
client.on('connect', () => {
  console.log('Connected to MQTT broker');
  client.subscribe(topics, (err) => {
    if (!err) {
      console.log('Subscribed to multiple topics');
    } else {
      console.error(`Subscription error: ${err}`);
    }
  });
});

// Handle incoming messages
client.on('message', (topic, message) => {
    processDataPayload(topic, message)

    /*
        // TODO: old implementation - uncomment for testing
        if(!triggerSend){
            canStartSendingPayload() && (triggerSend = true);
            return;
        } 
        const hour = 1000 * 60 * 60;
        sendDataPerHour(() => {
            sendData('POST', dataPayload);
        }, hour);
    */
   
    if (!triggerSend) {
        if (canStartSendingPayload()) {
            triggerSend = true; 
            const hour = 1000 * 60 * 60; 
            sendDataPerHour(() => {
                sendData('POST', dataPayload);
            }, hour);
        }
        return;
    }
});

// Handle errors
client.on('error', (err) => {
  console.error(`Connection error: ${err}`);
  client.end();
});
