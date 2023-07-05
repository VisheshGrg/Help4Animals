const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const Review=require('./reviews');

const ImageSchema = new Schema({
    url: String,
    filename: String
})

ImageSchema.virtual('thumbnail').get(function(){
    return this.url.replace('/upload','/upload/w_200/h_200')
})

const ShelterSchema = new Schema({
    sheltername: String,
    email: String,
    contact: String,
    location: String,
    images: [ImageSchema],
    description: String,
    password: String,
    owner :{
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews:[
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
});

ShelterSchema.post('findOneAndDelete', async function(doc){
    if(doc){
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('Shelter', ShelterSchema);