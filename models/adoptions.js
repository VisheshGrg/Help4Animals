const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const ImageSchema = new Schema({
    url: String,
    filename: String
})

ImageSchema.virtual('thumbnail').get(function(){
    return this.url.replace('/upload','/upload/w_200')
})

const AdoptionSchema = new Schema({
    species: String,
    name: String,
    age: Number,
    details: String,
    images: [ImageSchema],
    gender: String,
    rescueShelter: {
        type: Schema.Types.ObjectId,
        ref: 'Shelter'
    }
});

module.exports = mongoose.model('Adoptions', AdoptionSchema);