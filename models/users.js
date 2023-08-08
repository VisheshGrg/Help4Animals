const mongoose = require('mongoose');
const Schema=mongoose.Schema;

const UserSchema = new Schema({
    username: {
        type: String,
        required: [true, 'Username cannot be blank!'],
        unique: false
    },
    email: {
        type: String,
        required: [true, 'Email cannot be blank!'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Password cannot be blank']
    }
});

const User=mongoose.model('User', UserSchema);

User.collection.createIndexes([
    {key: {email: 2}, unique: true},
]);

module.exports=User