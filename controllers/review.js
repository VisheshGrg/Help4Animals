const Shelter = require('../models/shelters');
const Review = require('../models/reviews');

module.exports.createReview = async(req,res,next) => {
    const shelter=await Shelter.findById(req.params.id);
    const review=new Review(req.body.Review);
    shelter.reviews.push(review);
    review.author=req.session.user;
    await shelter.save();
    await review.save();
    req.flash('success','Made a new review!');
    res.redirect(`/shelters/${shelter._id}`);
};

module.exports.deleteReview = async(req,res,next) => {
    const {id,reviewId} = req.params;
    await Shelter.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Deleted a review!');
    res.redirect(`/shelters/${id}`);
}