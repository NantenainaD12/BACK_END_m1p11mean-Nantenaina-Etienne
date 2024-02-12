const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors');
const app = express()
var routes = require('./routes/routes')
const mongoose = require('mongoose');

const connectionString = 'mongodb+srv://main_User:qhLOPsf6Judsb33T@cluster0.jol0ctq.mongodb.net/Beauty_Project_Binome?retryWrites=true&w=majority'

mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected!!!'))
    .catch(error => console.log(error));


const port = 3001
app.listen(port, function() {
    console.log(`listening on ${port}`)
})


app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(routes);