 var express   =    require("express");
 var router    =    express();
 var path      =    require("path");
 var bodyParser =   require('body-parser');
 var expressSession = require('express-session');
 var passport =     require('passport');
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
router.use(bodyParser.json());
router.use(require('express-session')({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));
router.use(passport.initialize());
router.use(passport.session());
require('./config/passport')(passport); // pass passport for configuration
 
//Authorization ---------------------------------------


/*router.post('/user/register', passport.authenticate('local-signup', {
    successRedirect : '/home', // redirect to the secure profile section
    failureRedirect : '/user/register'//, // redirect back to the signup page if there is an error
    //failureFlash : true // allow flash messages
  }),         function(req, res) {
            console.log("hello");

            if (req.body.remember) {
              req.session.cookie.maxAge = 1000 * 60 * 3;
            } else {
              req.session.cookie.expires = false;
            }
        res.redirect('/')});
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
/*
 passport.authenticate('local-signup', {
    successRedirect : '/home', // redirect to the secure profile section
    failureRedirect : '/user/register'//, // redirect back to the signup page if there is an error
    //failureFlash : true // allow flash messages
  }));
 */

  //User.register(new User({ username: req.body.username }), req.body.password, function(err, account) {
  //  if (err) {
  //    return res.status(500).json({err: err});
  //  }
  //  passport.authenticate('local')(req, res, function () {
  //    return res.status(200).json({status: 'Registration successful!'});
  //  });
  //});
//});

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

router.get('/logout', function(req, res) {
  req.logout();
  res.status(200).json({status: 'Bye!'});
});




//Database Access--------------------------------------------------------


  router.get("/retrieveFirms",function(req,res){-
          handle_database(req,res);
  });

  router.get("/searchFirms/:name",function(req,res){-
          console.log("Name " + req.params.name);
          query_database_firmname(req,res,req.params.name);
  });

  router.post('/firm', function(req,res) {
          console.log("Adding a firm");
          var firm = {"name" : req.body.name, "url": req.body.url};
          database_firmcreate(req,res, firm);
 });

 // application -------------------------------------------------------------
 router.get('/home', function(req, res) {
          res.sendFile('public/main.html' , { root : __dirname}); // load the single view file (angular will handle the page changes on the front-end)
 });



 router.listen(8020);

 module.exports = router;

 console.log("App listening on port 8020");
