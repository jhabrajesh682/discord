const express = require('express');
const app = express();
require('dotenv').config()
var bodyParser = require('body-parser')
const moment = require('moment');
app.use(bodyParser.json())
const fileUpload = require('express-fileupload');
app.use(fileUpload());
const discords = require('./startup/discord');

app.get('/index', (req, res) => {
    res.sendFile(__dirname + '/index.html');
})

app.listen(process.env.port, () => {
    console.log(`server started at port ${process.env.port}`)
    // db()
    discords()
})