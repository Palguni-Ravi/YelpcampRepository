const express = require('express');
const router = express.Router();
const CatchAsync = require('../utils/catchAsync');
const passport = require('passport');
const users = require('../controllers/users');

router.route('/register')
      .get(users.renderRegister)
      .post(CatchAsync(users.createUser))

router.route('/login')
      .get(users.renderLogin)
      .post(passport.authenticate('local',{failureFlash : true , failureRedirect : '/login'}) ,CatchAsync(users.login))
      
router.get('/logout',users.logout)
module.exports = router;