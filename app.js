if(process.env.NODE_ENV !== "production"){
    require('dotenv').config();
}

const express = require('express');
const app = express();
const path = require('path');
const ejsMate =  require('ejs-mate');
const ExpressError = require('./utils/expressError');
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended : true}));
const morgan = require('morgan');
app.use(morgan('tiny'));
const methodOverride = require('method-override');
app.use(methodOverride('_method'));
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
app.engine('ejs',ejsMate);
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
app.use(express.static(path.join(__dirname,'public')));
const mongoSanitize = require('express-mongo-sanitize');
const mongoose = require('mongoose');
const dbUrl = process.env.DB_URL || "mongodb://localhost:27017/yelp-camp";
mongoose.connect(dbUrl , {useNewUrlParser : true , useUnifiedTopology : true});
const db = mongoose.connection;
db.on("error",console.error.bind(console,"Connection error : "));
db.once("open",()=>{
    console.log("Connected to database successfully..!");
});
const session = require('express-session');
const MongoDBStore = require('connect-mongo');
const secret = process.env.SECRET || "NotaGoodSecret";
const store = MongoDBStore.create({
    mongoUrl: dbUrl,
    secret : secret,
    touchAfter : 24*60*60
});
store.on("error",function(e){
    console.log("Session store error",e);
});
const sessionConfig = {
    store,
    name : 'session',
    secret,
    resave : false,
    saveUninitialized : true,
    cookie : {
        httpOnly :true,
        expires : Date.now() + 1000*60*60*24*7,
        maxAge : 1000*60*60*24*7
    }
};

app.use(session(sessionConfig));
const flash = require('connect-flash');
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(mongoSanitize());
app.use((req,res,next)=>{
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})
const campgroundRouter = require('./routes/campgrounds');
app.use('/camp',campgroundRouter);
const reviewRouter = require('./routes/reviews');
app.use('/camp/:id/review',reviewRouter);
const userRouter = require('./routes/users');
app.use('/',userRouter);

app.listen('3000',()=>{
    console.log("Server started at port 3000..!");
});
app.get('/',(req,res)=>{
    // console.log(req.method.toUpperCase(),req.path);
    res.render('home');
});

app.use('*',(req,res)=>{
    throw new ExpressError('Page not found',404);
});
//Error handler
app.use((err,req,res,next) => {
    const { statusCode = 500 } = err;
    if(!err.message){ err.message = 'Something went wrong..!';}
    res.status(statusCode).render('error', { err });
});