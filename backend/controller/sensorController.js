const Sensor = require('../model/sensorSchema.js');

module.export.saveDataPayload = async (req, res) => {
    const { data } = req.body;

    try {
        const dataPayload = new Sensor({
            sensorData: data
        })

        const savedData = await dataPayload.save();

        if(savedData){
            return res.status(200).send({
                message: 'successfully added to db',
                sensorData: savedData
            })
        }

        return res.status(400).send({
            message: 'something went wrong, please try again',
        })
    }
    catch (error) {
        console.log(error);
        return res.status(500).send({
            ERROR: 'internal server error'
        })
    }
}
