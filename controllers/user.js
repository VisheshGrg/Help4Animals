const User=require('../models/users');
const bcrypt=require('bcrypt');

module.exports.renderRegister = (req,res)=>{
    res.render('./users/register');
};

module.exports.createUser = async(req,res)=>{
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
};

module.exports.renderLogin = (req,res)=>{
    res.render('./users/login');
};

module.exports.loginUser = async(req,res)=>{
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
};

module.exports.logoutUser = (req,res)=>{
    req.session.user=null;
    req.session.returnToPath=null;
    // req.session.destroy();
    req.flash('success', 'Goodbye! Thankyou for visiting.');
    res.redirect('/');
};