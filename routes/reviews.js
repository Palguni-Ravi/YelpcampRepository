const express = require('express');
const router = express.Router({mergeParams : true});
const CatchAsync = require('../utils/catchAsync');
const methodOverride = require('method-override');
router.use(methodOverride('_method'));
const {validateReview,isLoggedIn,isReviewAuthor} = require('../middlware.js');
const reviews = require('../controllers/reviews');

router.post('/',isLoggedIn,validateReview ,CatchAsync(reviews.createReview))
router.delete('/:rid',isLoggedIn,isReviewAuthor,CatchAsync(reviews.deleteReview));
module.exports = router;