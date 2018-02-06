var express = require('express');
var router = express.Router({mergeParams:true});
var rest = require('../models/restaurants');
var comment = require('../models/comments');
var middleware = require('../middleware');

router.get('/new',middleware.isloggedin,function(req,res){
   rest.findById(req.params.id,function(err,foundrest){
        if(err){
            req.flash('error','restaurants not found!');
            res.redirect('/restaurants');
        }else{
            res.render('comments/new',{foundrest:foundrest});
        }
    })
});


router.post('/',middleware.isloggedin,function(req,res){
    rest.findById(req.params.id,function(err,restaurants){
        if(err){
            req.flash('error','restaurants not found!');
            console.log(err);
        }else{
            comment.create(req.body.comments,function(err,comment){
                if(err){
                    req.flash('error','Create failure!');
                    console.log(err);
                }else{
                    comment.author = req.user.username;
                    comment.save();
                    restaurants.comments.push(comment._id);
                    restaurants.save();
                    req.flash('success','Create success!');
                    res.redirect('/restaurants/' + restaurants._id)
                }
            })
        }
    })
});

router.get('/:comment_id/edit',middleware.commentowership,function(req,res){
    comment.findById(req.params.comment_id,function(err,foundcomment){
           if(err||!foundcomment){
            req.flash('error','Comments not found!');
            res.redirect('back');
        }else{
            res.render('comments/edit',{foundrest_id:req.params.id,foundcomment:foundcomment});
        }
    })
});



router.put('/:comment_id',middleware.commentowership,function(req,res){
    comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,updatedcomment){
        if(err){
            req.flash('error','Update failure!');
            res.redirect('back');
        }else{
            req.flash('success','Update success!')
            res.redirect('/restaurants/' + req.params.id);
        }
    })
});

router.delete('/:comment_id',middleware.commentowership,function(req,res){
    comment.findByIdAndRemove(req.params.comment_id,function(err){
        if(err){
            req.flash('error','Delete failure!');
            console.log(err);
        }else{
            req.flash('success','Delete success!');
            res.redirect('/restaurants/' + req.params.id);
        }}
    )
})

module.exports = router;