var express = require('express');
var router = express.Router();
var user = require('../models/user');
var passport = require('passport');
var RateLimit = require('express-rate-limit');
var createAccountLimiter = new RateLimit({
  windowMs: 60*60*1000, // 1 hour window
  delayAfter: 1, // begin slowing down responses after the first request
  delayMs: 3*1000, // slow down subsequent responses by 3 seconds per request
  max: 5, // start blocking after 5 requests
  message: "Too many accounts created from this IP, please try again after an hour"
});

router.get('/',function(req,res){
    res.render('landing');
});

router.get('/register',function(req,res){
    res.render('register');
});

router.post('/register',createAccountLimiter,function(req,res){
    user.register(new user({username:req.body.username}),req.body.password,function(err,user){
        if(err){
            req.flash('error',err.message);
            res.render('register');
        }else{
            req.login(user, function(err){
            if (err){
            req.flash('error',err.message);
            res.render('login');
            }
            else{
            req.flash('success','Logged in successfully')
            res.redirect('/restaurants');
            }})
        }
});
});



router.get('/login',function(req,res){
    res.render('login');
});

router.post('/login',passport.authenticate('local',
        {
        failureRedirect:'/login',
        failureFlash: true
        }),function(req,res){
            req.flash('success','Logged in successfully!')
            res.redirect('/restaurants');
            
});

router.get('/logout',function(req,res){
    req.logout();
    req.flash('success','Loged you out!')
    res.redirect('/restaurants');
});



module.exports = router;