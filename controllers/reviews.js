const Review = require('../models/reviews');
const Campground = require('../models/campground');
module.exports.createReview = async(req,res,next) => {
    const campground = await Campground.findById(req.params.id);
    const review = await new Review(req.body.review);
    review.author = req.user._id;
    await review.save();
    campground.reviews.push(review);
    await campground.save();
    req.flash('success','Successfully added the review..!');
    res.redirect(`/camp/${campground._id}`);
}
module.exports.deleteReview = async(req,res,next)=>{
    const { id , rid } = req.params;
    await Campground.findByIdAndUpdate(id,{ $pull : { reviews : rid}});
    await Review.findByIdAndDelete(rid);
    req.flash('success','Successfully deleted the review..!');
    res.redirect(`/camp/${id}`);
}