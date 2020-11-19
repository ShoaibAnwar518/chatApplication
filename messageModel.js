const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var Message = mongoose.model('Message',{
    name: String,
    messages: String
})

// mongoose.model('messageModel', Message)
module.exports = Message;