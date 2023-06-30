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
const helmet=require('helmet');
const catchAsync = require('./utils/catchAsync.js');
const method_override=require('method-override');
const bcrypt=require('bcrypt');
const {isLoggedIn} = require('./middleware.js');

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

app.use((req,res,next)=>{
    if(!['/login','/','/userRegister'].includes(req.originalUrl)){
        req.session.returnToPath=req.originalUrl;
    }
    res.locals.currentUser = req.session.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

app.get('/', (req,res)=>{
    res.render('home');
});

app.get('/userRegister', (req,res)=>{
    res.render('./users/register');
});

app.post('/userRegister', catchAsync(async(req,res)=>{
    const {username,email,password,confPassword} = req.body;
    const findUser = await User.findOne({email: email});
    if(findUser){
        req.flash('error', 'Invalid email!');
        res.redirect('/userRegister');
    }
    else if(password!==confPassword){
        req.flash('error', 'Password must be same!');
        res.redirect('/userRegister');
    }
    else{
        bcrypt.hash(password,12, async(err,hash)=>{
            if(err) {return next(err);}
            const user = new User({username: username, email: email, password: hash});
            await user.save();
            req.session.user=user._id;
            req.flash('success','Welcome! Thankyou for connecting with us.');
            res.redirect('/');
        });
    }
}));

app.get('/login', (req,res)=>{
    res.render('./users/login');
});

app.post('/login', async(req,res)=>{
    try{
        const {email,password} = req.body;
        const user = await User.findOne({email: email});
        const validPassword = await bcrypt.compare(password,user.password);
        if(!validPassword){
            req.flash('error', 'Invalid entry! Try again.');
            res.redirect('/login');
        }
        else{
            req.flash('success', 'Welcome back!');
            req.session.user=user._id;
            let redirectPath = req.session.returnToPath || '/';
            delete req.session.returnToPath;
            res.redirect(redirectPath);
        }
    }
    catch(err){
        req.flash('error', 'Invalid entry! Try again.');
        res.redirect('/login');
    }
});

app.get('/logout', (req,res)=>{
    req.session.user=null;
    req.session.returnToPath=null;
    // req.session.destroy();
    req.flash('success', 'Goodbye! Thankyou for visiting.');
    res.redirect('/');
});

app.get('/shelterRegister', isLoggedIn, (req,res)=>{
    res.render('./shelters/register');
});

app.post('/shelterRegister',upload.array('images'), catchAsync(async(req,res,next)=>{
    const {sheltername,email,mobnumber,location,description,password,confPassword} = req.body;
    const findUser = await User.findOne({email: email});
    if(findUser){
        req.flash('error', 'Invalid email! (shelter must have its own email)');
        res.redirect('/shelterRegister');
    }
    else if(password!=confPassword){
        req.flash('error','Password must be same!');
        res.redirect('/shelterRegister');
    }
    else{
        bcrypt.hash(password,12, async(err,hash)=>{
            if(err) { return next(err);}
            const shelter=new Shelter({sheltername: sheltername,email:email,contact:mobnumber,location:location,description:description,password:hash});
            const user=new User({username:sheltername,email:email,password:hash});
            shelter.images = req.files.map(f => ({url: f.path, filename: f.filename}));
            shelter.owner=req.session.user._id;
            await shelter.save();
            await user.save();
            req.flash('success', 'Successfully made a new shelter!');
            res.redirect('/');
        })
    }
}));

app.get('/post', (req,res)=>{
    res.render('./animals/newPost');
});

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