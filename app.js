var mongoose = require('mongoose');
var express = require('express');
var app = express();
var bodyparser = require('body-parser');
var rest = require('./models/restaurants.js');
var comment = require('./models/comments.js');
var seedDB = require('./seeds.js');
var passport = require('passport');
var localstrategy = require('passport-local');
var user = require('./models/user.js');
var passportlocalmongoose = require('passport-local-mongoose');
var indexroutes = require('./routes/index');
var commentroutes = require('./routes/comments');
var restgroundroutes = require('./routes/restaurants')
var methodoverride = require('method-override');
var flash = require('connect-flash');
var RateLimit = require('express-rate-limit');



app.enable('trust proxy');
app.use(express.static(__dirname +'/public'));
// mongoose.connect('mongodb://localhost/restaurants');
mongoose.connect('mongodb://cz24zj:czzj93723@ds046867.mlab.com:46867/r-restaurants');
app.use(bodyparser.urlencoded({extended:true}));
app.set('view engine','ejs');
app.use(methodoverride('_method'));
app.use(flash());

app.use(require('express-session')({
    secret:"This is a web page",
    resave:false,
    saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new localstrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());
app.use(function(req,res,next){
    res.locals.currentuser = req.user;
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    next();
});

app.use('/restaurants',restgroundroutes);
app.use('/',indexroutes);
app.use('/restaurants/:id/comments',commentroutes);

// seedDB();


app.get('/show', function(req, res) {
    res.render('api/map.html'); // load the single view file (angular will handle the page changes on the front-end)
})


app.listen(process.env.PORT,process.env.IP,function(){
    console.log('The server has started!');
});