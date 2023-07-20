const mongoose = require('mongoose');
const Schema=mongoose.Schema;

const ImageSchema = new Schema({
    url: String,
    filename: String
})

ImageSchema.virtual('thumbnail').get(function(){
    return this.url.replace('/upload','/upload/w_200')
})

const RescueSchema = new Schema({
    species: String,
    severe: Number,
    description: String,
    locality: String,
    callerContact: String,
    images: [ImageSchema],
    identification: String,
    caller: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    active: {
        type: Boolean,
        default: true
    }
});

module.exports = mongoose.model('Rescue',RescueSchema);