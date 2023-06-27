const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const ImageSchema = new Schema({
    url: String,
    filename: String
})

ImageSchema.virtual('thumbnail').get(function(){
    return this.url.replace('/upload','/upload/w_200')
})

const ShelterSchema = new Schema({
    shelterName: String,
    email: String,
    contact: String,
    location: String,
    images: [ImageSchema],
    password: String,
    owner :{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

module.exports = mongoose.model('Shelter', ShelterSchema);