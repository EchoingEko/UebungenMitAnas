const mongoose = require('mongoose');
const schema = mongoose.Schema;

const userSchema = new schema({
    username: String,
    password: String,
    role: String,
    email:String,
    ts:{ type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
module.exports = User;