var mongoose = require('mongoose');
var commentschema = new mongoose.Schema({
    text: String,
    author:String,
    username:String
    }
);
module.exports = mongoose.model('comment',commentschema);