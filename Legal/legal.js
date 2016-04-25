 var express   =    require("express");
 var router    =    express();
 var path      =    require("path");
 var bodyParser =   require('body-parser');
 var expressSession = require('express-session');

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
    //console.log(db);
    //console.log(pool);
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


//Configure authentication routes
var authentication = require('./authentication.js');
authentication.set(router);

//Authorization
var authorization = require('./authorization.js');



//Database Access--------------------------------------------------------

 // application -------------------------------------------------------------
 router.get('/home', function(req, res) {
          res.sendFile('public/main.html' , { root : __dirname}); // load the single view file (angular will handle the page changes on the front-end)
 });

router.use(isLoggedIn)
router.use(isAdmin)
  router.get("/retrieveFirms", function(req,res){
	//if(isAdmin(req)) {
		console.log(req.session.passport.user);  
		handle_database(req,res);
	//} else
	//	console.log("Fail")  
  });

  router.get("/searchFirms/:name", function(req,res){
          console.log("Name " + req.params.name);
          query_database_firmname(req,res,req.params.name);
  });

  router.post('/firm', function(req,res) {
          console.log("Adding a firm");
          var firm = {"name" : req.body.name, "url": req.body.url};
          database_firmcreate(req,res, firm);
 });



// route middleware to make sure
function isLoggedIn(req, res, next) {

  // if user is authenticated in the session, carry on
  if (req.isAuthenticated())
    return next();
  console.log("Auth fail");
  // if they aren't redirect them to the home page
  res.redirect('/home');
}

function isAdmin(req, res, next) {

  // if user is authenticated in the session, carry on
  authorization.checkUserAccess(req.session.passport.user, 'admin', function(isAdmin) {
    if(isAdmin){
		console.log("Authorized");
		return next();
	}
	else {
		console.log("Not Authorized");
		//console.log(authorization.checkUserAccess(req.session.passport.user, 'admin'))
		// if they aren't redirect them to the home page
		res.redirect('/home');
	}
  
  });

}

 router.listen(8020);

 module.exports = router;

 console.log("App listening on port 8020");
