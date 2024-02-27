const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const serverless = require('serverless-http');
const cors = require('cors');
const app = express();
var routes = require('../routes/routes');
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

const mongoose = require('mongoose');
const router = require('../routes/routes');

const connectionString = 'mongodb+srv://main_User:qhLOPsf6Judsb33T@cluster0.jol0ctq.mongodb.net/Beauty_Project_Binome?retryWrites=true&w=majority'

mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected!!!'))
    .catch(error => console.log(error));


const port = 3001
app.listen(port, function() {
    console.log(`listening on ${port}`)
})


app.use(session({
    secret: 'qhLOPsf6Judsb33T',
    resave: false,
    saveUninitialized: false
}));

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(routes);
app.use('/.netlify/functions/api',router);
module.exports.handler = serverless(app);