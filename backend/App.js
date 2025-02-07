require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const sensorRoutes = require('./routes/sensorRoutes.js');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const corsOptions = {
     origin: ["*"],
     credentials: true,
     optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use("/EE", sensorRoutes);

mongoose.connect(process.env.MONGODB_URL);

mongoose.connection.once('open', () => console.log('Now connected to mongoDB atlas'))


if(require.main === module){
    app.listen(process.env.PORT || 4001, () => {
        console.log(`Server is running on port ${process.env.PORT || 4001}`);
    })
}