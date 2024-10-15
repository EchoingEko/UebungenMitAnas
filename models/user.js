const mongoose = require('mongoose');
const schema = mongoose.Schema;

const userSchema = new schema({
    user: {
    username: String,
    password: String,
    role: String,
    },
    transaction: {
        action: String,
        date: Date
    } 
});

const User = mongoose.model('User', userSchema);
module.exports = User;