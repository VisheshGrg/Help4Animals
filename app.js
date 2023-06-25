const express=require("express");
const app=express();
const path=require('path');
const ejsmate=require('ejs-mate');

app.engine('ejs', ejsmate);
app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,'public')));

app.get('/', (req,res)=>{
    res.render('home');
})

app.get('/shelterRegister', (req,res)=>{
    res.render('./shelters/login');
})

app.get('/userRegister', (req,res)=>{
    res.render('./users/register');
})

app.get('/login', (req,res)=>{
    res.render('./users/login');
})

app.listen(3000, ()=>{
    console.log('Listening on port 3000!');
})