var middlewareobj = {};
var rest = require('../models/restaurants.js');
var comment = require('../models/comments.js');

middlewareobj.restowership = function (req,res,next){
    if(req.isAuthenticated()){
        rest.findById(req.params.id,function(err,foundrest){
            if(err||!foundrest){
                req.flash('error','restaurants not found!');
                res.redirct('back');
            }
            else if(foundrest.author==req.user.username){
                next();
            }else{
                req.flash('error','You do not have permission!')
                res.redirect('back');
            }})
        }else{
            req.flash('error','You need to be logged in!')
            res.redirect('back');
        }
};
    
middlewareobj.isloggedin = function(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash('error','You need to be Logged in!');
    res.redirect('/login');
};

middlewareobj.commentowership = function(req,res,next){
    if(req.isAuthenticated()){
        comment.findById(req.params.comment_id,function(err,foundcomment){
            if(err||!foundcomment){
                req.flash('error','Comments not found!')
                res.redirct('back');
            }
            else if(foundcomment.author==req.user.username){
                next();
            }else{
                req.flash('error','You do not have permission')
                res.redirect('back');
            }})
        }else{
            req.flash('error','You need to be logged in!')
            res.redirect('back');
        }
};



  

module.exports = middlewareobj;