if(process.env.NODE_ENV !== "production"){
    require('dotenv').config();
}

const express=require("express");
const app=express();
const path=require('path');
const ejsmate=require('ejs-mate');
const mongoose=require('mongoose');
const mongoSanitize=require('express-mongo-sanitize');
const userRoute=require('./routes/users');
const shelterRoute=require('./routes/shelters');
const reviewRoute=require('./routes/reviews');
const rescueRoute=require('./routes/rescue');
const adoptionRoute=require('./routes/adoption');
const ExpressError=require('./utils/ExpressError');
const session=require('express-session');
const MongoStore=require('connect-mongo');
const flash=require('connect-flash');
const helmet=require('helmet');
const catchAsync = require('./utils/catchAsync.js');
const method_override=require('method-override');
const User=require('./models/users');
const Shelter=require('./models/shelters');
// const dbUrl='mongodb://127.0.0.1:27017/Help4Animals';
const dbUrl = process.env.DB_URL;

mongoose.set('strictQuery',false);
mongoose.connect(dbUrl, {useNewUrlParser: true, useUnifiedTopology: true});

const db=mongoose.connection
db.on("error", console.error.bind(console, "connection error:"))
db.once("open", ()=>{
    console.log("Database connected!");
})

const secret="thisisasecretstring";

const store=MongoStore.create({
    mongoUrl: dbUrl,
    secret,
    touchAfter: 24*60*60
});

store.on("error", function(e){
    console.log("Session store Error!", e);
})

const sessionConfig = {
    store,
    name: 'session',
    secret,
    resave: false,
    saveUninitialized: true,
    cookie:{
        httpOnly: true,
        expires: Date.now() + 1000*60*60*24*7,
        maxAge: 1000*60*60*24*7
    }
};

app.engine('ejs', ejsmate);
app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');
app.use(express.urlencoded({extended:true}));
app.use(method_override('_method'));
app.use(express.static(path.join(__dirname,'public')));
app.use(
    mongoSanitize({
        replaceWith: '_',
    }),
)
app.use(session(sessionConfig));
app.use(flash());
app.use(helmet({contentSecurityPolicy: false, crossOriginEmbedderPolicy: false}));

app.use(async (req,res,next)=>{
    if(!['/login','/userRegister'].includes(req.originalUrl)){
        req.session.returnToPath=req.originalUrl;
    }
    res.locals.currentUser = req.session.user;
    const user=await User.findById(req.session.user);
    let shelter=null;
    if(user){
        shelter=await Shelter.findOne({email: user.email});
    }
    res.locals.isShelter = shelter;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

app.get('/', async(req,res)=>{
    const count=await Shelter.estimatedDocumentCount();
    res.render('home',{count});
});

app.use('/',userRoute);
app.use('/shelters',shelterRoute);
app.use('/shelters/:id/reviews', reviewRoute);
app.use('/rescue',rescueRoute);
app.use('/adoptions', adoptionRoute);
app.get('/about', (req,res)=>{
    res.render('abouts/about');
})
app.get('/contact', (req,res)=>{
    res.render('abouts/contact');
})

app.all('*', (req,res,next)=>{
    next(new ExpressError('Page not found!', 404));
});

app.use((err,req,res,next)=>{
    const {status=500} = err;
    if (!err.message) err.message = 'Sorry, Something went wrong!';
    res.status(status).render('errors',{err});
});

const port = process.env.PORT || 3000;

app.listen(port, ()=>{
    console.log(`Listening on port ${port}!`);
})