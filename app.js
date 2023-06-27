const express=require("express");
const app=express();
const path=require('path');
const ejsmate=require('ejs-mate');
const mongoose=require('mongoose');
const mongoSanitize=require('express-mongo-sanitize');
const User=require('./models/users');
const Shelter=require('./models/shelters');
const ExpressError=require('./utils/ExpressError');
const multer=require('multer');
const upload=multer({dest: 'upload/' });
const session=require('express-session');
const MongoStore=require('connect-mongo');
const dbUrl='mongodb://127.0.0.1:27017/Help4Animals';
const flash=require('connect-flash');
const passport=require('passport');
const LocalStrategy=require('passport-local');

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
app.use(express.static(path.join(__dirname,'public')));
app.use(
    mongoSanitize({
        replaceWith: '_',
    }),
)
app.use(session(sessionConfig));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

app.get('/', (req,res)=>{
    res.render('home');
});

app.get('/shelterRegister', (req,res)=>{
    res.render('./shelters/register');
});

app.post('/shelterRegister',upload.array('images'), async(req,res,next)=>{
    const shelter = new Shelter(req.body.shelter);
    shelter.images = req.files.map(f => ({url: f.path, filename: f.filename}));
    // console.log(req.user);
    shelter.owner=req.user._id;
    await shelter.save();
    res.redirect('/');
});

app.get('/userRegister', (req,res)=>{
    res.render('./users/register');
});

app.post('/userRegister', async(req,res)=>{
    try{
        const {username,email,password,confPassword} = req.body;
        const user = new User({username,email});
        const registeredUser=await User.register(user,password);
        req.login(registeredUser, err=>{
            if(err){return next(err);}
            req.flash('success', 'Thanks for connecting with us!');
            res.redirect('/');
        })
    }
    catch(e){
        req.flash('error', e.message);
        res.render('./users/register');
    }
});

app.get('/login', (req,res)=>{
    res.render('./users/login');
});

app.post('/login', (req,res)=>{
    res.redirect('/');
})

app.get('/post', (req,res)=>{
    res.render('./animals/newPost');
});

app.get('/logout', (req,res)=>{
    
})

app.all('*', (req,res,next)=>{
    next(new ExpressError('Page not found!', 404));
});

app.use((err,req,res,next)=>{
    const {status=500} = err;
    if (!err.message) err.message = 'Something went wrong!';
    res.status(status).render('errors',{err});
});

app.listen(3000, ()=>{
    console.log('Listening on port 3000!');
})