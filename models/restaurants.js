var mongoose = require('mongoose');
var restschema = new mongoose.Schema({
    
    name:String,
    img:String,
    description:String,
    author:String,
    comments:[{type: mongoose.Schema.Types.ObjectId,
         ref: 'comment'}]
    });
module.exports = mongoose.model('rest',restschema);