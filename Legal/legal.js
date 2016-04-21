 var express   =    require("express");
 var router    =    express();
 var path      =    require("path");
 var bodyParser =   require('body-parser');
 var expressSession = require('express-session');
 var passport =     require('passport');
 //var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
 var db =           require('./config/database.js');
 var pool =         db.pool;
 //var User = require('./models/user.js');

 /*var pool      =    mysql.createPool({
     connectionLimit : 100, //important
     host     : 'localhost',
     user     : 'root',
     password : 'redcoats',
     database : 'test',
     debug    :  false
 });*/

 
 function handle_database(req,res) {
      console.log(db);
       console.log(pool);
     pool.getConnection(function(err,connection){
         if (err) {
           connection.release();
           res.json({"code" : 100, "status" : "Error in connection database"});
           return;
         }   
 
         console.log('connected as id ' + connection.threadId);
         
         connection.query("select * from firms",function(err,rows){
             connection.release();
             if(!err) {
                 res.json(rows);
             }           
         });
 
         connection.on('error', function(err) {      
               res.json({"code" : 100, "status" : "Error in connection database"});
               return;     
         });
   });
 }

function query_database_firmname(req,res,firmname) {
     
     pool.getConnection(function(err,connection){
         if (err) {
           connection.release();
           res.json({"code" : 100, "status" : "Error in connection database"});
           return;
         }   
 
         console.log('connected as id ' + connection.threadId);
         
         connection.query("select * from firms where firmname like \"%" + firmname +  "%\" " ,function(err,rows){
             connection.release();
             if(!err) {
                 res.json(rows);
             }           
         });
 
         connection.on('error', function(err) {      
               res.json({"code" : 100, "status" : "Error in connection database"});
               return;     
         });
   });
 }

 function database_firmcreate(req,res,firm) {
     
     pool.getConnection(function(err,connection){
         if (err) {
           connection.release();
           res.json({"code" : 100, "status" : "Error in connection database"});
           return;
         }   
 
         console.log('create connected as id ' + connection.threadId);
         
         connection.query("insert into firms (firmname,url) values (\""+ firm.name +"\",\""+ firm.url + "\")" ,function(err,rows){
             connection.release();
             if(!err) {
                 res.json(rows);
             }           
         });
 
         connection.on('error', function(err) {      
               res.json({"code" : 100, "status" : "Error in connection database"});
               return;     
         });
   });
 }

//Router config
router.use(express.static('public'));
router.use(require('cookie-parser')());
router.use(require('body-parser').urlencoded({ extended: true }));
router.use(bodyParser.json());
router.use(require('express-session')({
  //dd if=/dev/urandom bs=1 count=32 2>/dev/null | base64 -w 0 | rev | cut -b 2- | rev
    secret: 'ygzVmA1uIMf51x5e1pB10QH8yX9iBCjMKag7tL4A7Lk',
    resave: true,
    saveUninitialized: true,
    cookie : {}
}));


////Authorization with Google ---------------------------------------
//
//// Use the GoogleStrategy within Passport.
////   Strategies in Passport require a `verify` function, which accept
////   credentials (in this case, an accessToken, refreshToken, and Google
////   profile), and invoke a callback with a user object.
//passport.use(new GoogleStrategy({
//    clientID: GOOGLE_CLIENT_ID,
//    clientSecret: GOOGLE_CLIENT_SECRET,
//    callbackURL: "http://www.example.com/auth/google/callback"
//  },
//  function(accessToken, refreshToken, profile, done) {
//       User.findOrCreate({ googleId: profile.id }, function (err, user) {
//         return done(err, user);
//       });
//  }
//));
//
//// GET /auth/google
////   Use passport.authenticate() as route middleware to authenticate the
////   request.  The first step in Google authentication will involve
////   redirecting the user to google.com.  After authorization, Google
////   will redirect the user back to this application at /auth/google/callback
//router.get('/auth/google',
//  passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'] }));
//
//// GET /auth/google/callback
////   Use passport.authenticate() as route middleware to authenticate the
////   request.  If authentication fails, the user will be redirected back to the
////   login page.  Otherwise, the primary route function function will be called,
////   which, in this example, will redirect the user to the home page.
//router.get('/auth/google/callback', 
//  passport.authenticate('google', { failureRedirect: '/login' }),
//  function(req, res) {
//    res.redirect('/');
//  });


router.use(passport.initialize());
router.use(passport.session());
require('./config/passport')(passport); // pass passport for configuration
 
//Authorization ---------------------------------------
/*
{
  "username": "toddschmitt@gmail.com",
  "password": "foobar"
}
*/
router.post('/user/register', function(req,res) {
   console.log("register route")
   return passport.authenticate('local-signup',

   function(err, account) {
     if (err) {
        debugger;
        console.log("foo");
        return res.status(401).json({err: err});
      } else {

        return res.status(200).json({status: 'Login successful!'});
      } 
   } )(req, req.body.username, req.body.password)
 });

router.post('/user/login', function(req, res, next) {
  console.log("login route")
  return passport.authenticate('local-login', 
    function(err, user, info) {
    if (err) {
      return res.status(500).json({err: err});
    }
    if (!user) {
      return res.status(401).json({err: info});
    }
    req.logIn(user, function(err) {
      if (err) {
        return res.status(500).json({err: 'Could not log in user'});
      }
      res.status(200).json({status: 'Login successful!'});
    });
  })(req, req.body.username, req.body.password);
});

router.get('/user/logout', function(req, res) {
  req.logout();
  res.status(200).json({status: 'Bye!'});
});




//Database Access--------------------------------------------------------


  router.get("/retrieveFirms",isLoggedIn,function(req,res){-
          handle_database(req,res);
  });

  router.get("/searchFirms/:name",isLoggedIn,function(req,res){-
          console.log("Name " + req.params.name);
          query_database_firmname(req,res,req.params.name);
  });

  router.post('/firm', isLoggedIn, function(req,res) {
          console.log("Adding a firm");
          var firm = {"name" : req.body.name, "url": req.body.url};
          database_firmcreate(req,res, firm);
 });

 // application -------------------------------------------------------------
 router.get('/home', function(req, res) {
          res.sendFile('public/main.html' , { root : __dirname}); // load the single view file (angular will handle the page changes on the front-end)
 });

// route middleware to make sure
function isLoggedIn(req, res, next) {

  // if user is authenticated in the session, carry on
  if (req.isAuthenticated())
    return next();
  console.log("Auth fail")
  // if they aren't redirect them to the home page
  res.redirect('/home');
}

 router.listen(8020);

 module.exports = router;

 console.log("App listening on port 8020");
