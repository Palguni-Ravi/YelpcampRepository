const User = require('../models/user');
const passport = require('passport');
module.exports.renderRegister = (req,res)=>{
    res.render('users/register');
}
module.exports.createUser = async(req,res)=>{
    try{
        const { username , email , password } = req.body;
    const user = await new User({username,email});
    const registeredUser = await User.register(user,password);
    req.login(registeredUser, err =>{
        if(err) return next(err);
        req.flash('success','Welcome to Yelp-Camp..!');
        res.redirect('/camp');
    })
    
    }catch(e){
        req.flash('error',e.message);
        res.redirect('/register');
    }
}
module.exports.renderLogin = (req,res)=>{
    res.render('users/login');
}
module.exports.login = async(req,res)=>{
    req.flash('success','Welcome back..!');
    const redirectUrl = req.session.returnTo || '/camp';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}
module.exports.logout = (req,res)=>{
    req.logout();
    req.flash('success','Goodbye..!');
    res.redirect('/camp');
}