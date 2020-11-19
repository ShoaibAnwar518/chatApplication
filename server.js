var express = require('express');
var bodyParser  = require('body-parser')
var app = express();

//Using Socket.io
var http = require('http').Server(app)
var io = require('socket.io')(http)

//install mongoose npm and use it to save data
var mongoose = require('mongoose');
const messageModel = require('./messageModel'); //Import Model
const env = require('dotenv');

app.use(express.static(__dirname));
app.use(bodyParser.json()) //Express has no built in to parse the body so we use bodyParser
app.use(bodyParser.urlencoded({extended: false})); // bodyParse to support that otherWise it will give null object or array

//creating connection string
var dbUrl = 'mongodb+srv://user:user@cluster0.ksfsn.mongodb.net/<Cluster0>?retryWrites=true&w=majority'

//Create Array Object of messages
// var messages = [
//     {name: 'Shoaib', messages: 'Hello'},
//     {name: 'Haris', messages: 'Thankyou'}
// ]

//Get API Using Services 
app.get('/messages', (req, res) => {
    //Get all messages from mongoo
    messageModel.find({}, (err, messages) =>{
        res.send(messages);
    })
});

// Post API
// app.post('/messages',(req,res) => {
//     var message = new messageModel(req.body);
//     //console.log(req.body); //Express not convert it so we use body parser npm and use it to see Body
//    // messages.push(req.body); //Push data into our Messages Array
    
//    //Save data to mongoose
// //    var messageModel = new messageModel(req, body)

// message.save((err)=>{
//        if(err){
//            sendStatus(500)
//        }
//        //messages.push(req.body); No need of this because now we push it to mongoose
//        io.emit('message', (req.body))  //Emit socket.io event to find new message
//        res.sendStatus(200);
//    })

// });

//Post Api with Promises
app.post('/messages', (req, res) => {
    var messages = new messageModel(req.body);

    messages.save().then(() => {
        messageModel.find({
            message: 'badword'
        }, (err, censored) => {
            if (censored) {
                console.log('censored word found', censored);
                messageModel.deleteOne({
                    _id: censored.id
                }, (err) => {
                    console.log('removed censored message');
                })
            }
        })
        io.emit('message', req.body)
        res.sendStatus(200)
    }).catch((err) => {
        res.sendStatus(500)
        return console.error(err);

    })
})

//Using socket.io to check connection is established...
io.on('connection', (socket) => {
    console.log('a user connected');
})

//Connecting Mongoose
// useNewUrlParser and useUnifiedTopology set to true otherwise we will get err of DeprecationWarning
mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true }, (err)=>{
    console.log('mongo db Connected', err);
})
var port = process.env.port
// App listen also add port is dynamic by deafult you can add harcoded...
var server =   http.listen( port || 3000, () => { //use http instead of app for running app with socket.io
    console.log('Server is running on port',server.address().port)
});