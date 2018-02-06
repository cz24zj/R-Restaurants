var express = require('express');
var router = express.Router();
var rest = require('../models/restaurants');
var middleware = require('../middleware');
var request = require('request');


router.get('/',function(req,res){
    
    rest.find({},function(err,rest){
        if(err){
            console.log(err);
        }else{
            res.render('restaurants/index',{restaurants:rest});
        }
    })
    
});

router.post('/',middleware.isloggedin,function(req,res){
  var author = req.user.username;
  var restname = req.body.name;
  var image = req.body.img;
  var description = req.body.description;
  var newrestaurant = {name:restname,img:image,description:description,author:author}
  rest.create(newrestaurant,function(err,newrest){
      if(err){
          req.flash('error','Create failure!');
          console.log(err)
          
      }else{
          res.redirect('/restaurants'); 
          console.log(newrest);
      }
  });
});

router.get('/new',middleware.isloggedin,function(req,res){
   res.render('restaurants/new');
});

router.get('/:id',function(req,res){
     rest.findById(req.params.id).populate('comments').exec(function(err,foundrest){
        if(err||!foundrest){
            req.flash('error','restaurants not found!')
            console.log(err);
        }else{
            console.log(foundrest);
            res.render('restaurants/show',{foundrest:foundrest,})
        }
    })
    
});


router.get('/:id/edit',middleware.restowership,function(req,res){
    rest.findById(req.params.id,function(err,foundrest){
        if(err||!foundrest){
            req.flash('error','restaurants not found!')
            console.log(err);
        }else{
            res.render('restaurants/edit',{foundrest:foundrest});
        }
    })
    
});

router.put('/:id',middleware.restowership,function(req,res){
    
    rest.findByIdAndUpdate(req.params.id,req.body.restaurant,function(err,updatedrest){
        if(err){
            req.flash('error','Update failure!')
            res.redirect('/restaurants');
        }else{
            req.flash('success','Update success!')
            res.redirect('/restaurants/' + updatedrest._id);
        }
    });
});

router.delete('/:id',middleware.restowership,function(req,res){
    rest.findByIdAndRemove(req.params.id,function(err){
        if(err){
            req.flash('error','Delete failure!')
            console.log(err);
        }else{
            req.flash('success','Delete success!')
            res.redirect('/restaurants');
        }
    })
})



module.exports = router;