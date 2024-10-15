const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var TransactionSchema = new Schema({
    action                : {type: String, default:"account"}, // account, file, photo, device 
    ts                    : { type: Date, default: Date.now },
    login                 : String,
  });

module.exports = mongoose.model('Transaction',TransactionSchema);