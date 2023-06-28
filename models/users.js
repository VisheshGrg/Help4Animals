const mongoose = require('mongoose');
const passportLocalMongoose=require('passport-local-mongoose');
const Schema=mongoose.Schema;

const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
});

UserSchema.plugin(passportLocalMongoose, {usernameField: 'email'});
module.exports=mongoose.model('User', UserSchema);