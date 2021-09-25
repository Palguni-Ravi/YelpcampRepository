const express = require('express');
const router = express.Router();
const CatchAsync = require('../utils/catchAsync');
const methodOverride = require('method-override');
const {isLoggedIn,validateCampground,isAuthor} = require('../middlware.js');
router.use(methodOverride('_method'));
const campgrounds = require('../controllers/campgrounds');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

router.route('/')
      .get(CatchAsync(campgrounds.allCampgrounds))
      .post(isLoggedIn , upload.array('image') , validateCampground , CatchAsync(campgrounds.createCampground))
      

router.get('/new',isLoggedIn,campgrounds.newCampground);

router.route('/:id')
      .get(CatchAsync(campgrounds.showCampground))
      .put(isLoggedIn,isAuthor,upload.array('image'),validateCampground, CatchAsync(campgrounds.updateCampground))
      .delete(isLoggedIn,isAuthor,CatchAsync(campgrounds.deleteCampground))

router.get('/:id/edit', isLoggedIn , isAuthor , CatchAsync(campgrounds.editCampground));

module.exports = router;