const {campgroundSchema} = require('./schemas.js');
const ExpressError = require('./utils/expressError');
const Campground = require('./models/campground');
const Review = require('./models/reviews');
const {reviewSchema} = require('./schemas.js');
module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl
        req.flash('error','You must be signed in first..!');
        return res.redirect('/login');
    }
    next();
}
module.exports.validateCampground = (req,res,next) =>{ 
    const { error } = campgroundSchema.validate(req.body);
    if(error)
    {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg,400);
    }
    else {
        next();
    }
 }
module.exports.isAuthor = async(req,res,next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if(!campground.author.equals(req.user._id)){
        req.flash('error','You are not the author of the campground..!');
        return res.redirect(`/camp/${id}`);
    }
    next();
}
module.exports.isReviewAuthor = async(req,res,next) => {
    const { id,rid } = req.params;
    const review = await Review.findById(rid);
    if(!review.author.equals(req.user._id)){
        req.flash('error','You are not the author of the review..!');
        return res.redirect(`/camp/${id}`);
    }
    next();
}
module.exports.validateReview = (req,res,next) =>{ 
    const { error } = reviewSchema.validate(req.body);
    if(error)
    {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg,400);
    }
    else {
        next();
    }
}