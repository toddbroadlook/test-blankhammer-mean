 var express   =    require("express");
 var router    =    express();
 var path      =    require("path");
 var bodyParser =   require('body-parser');
 var expressSession = require('express-session');

 //var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
 var db =           require('./config/database.js');
 var pool =         db.pool;
 var queries =      require('./config/queries.js')
 var settings =     require('./settings.cfg') 
 //var User = require('./models/user.js');

 function make_query(query,callback){
	pool.getConnection(function(err,connection){
		if (err) {
		  connection.release();
		  callback({"code" : 100, "status" : "Error in connection database"});
		  return;
		}   

		console.log('connected as id ' + connection.threadId);
		
		connection.query(query, function(err,rows){
			 connection.release();
			 if(!err) {
			   callback(rows);
			 }           
		});
	});
	
 }

function query_database_firmname(req,res,firmname) {
    query = "SELECT firmid, name, website, city, state, postalcode from firms where name like \"%" + firmname +  "%\" and active=1";
    make_query(query, function (rows){res.json(rows)} );
 }
 
function query_database_firmnotes(req,res,firmid) {
    query = "SELECT noteid, userid, text, datetime from notes where firmid = " + firmid;
    make_query(query, function (rows){res.json(rows)} );
 }
 
 function query_database_firm_research_sessions(req,res,firmid) {
    query = "SELECT * from researchsessions where firmid = " + firmid;
    make_query(query, function (rows){res.json(rows)} );
 }
 
 
 function query_database_firmflags(req,res,firmid) {
    query = "SELECT flagtype, userid, datetime from flags where firmid = " + firmid;
    make_query(query, function (rows){res.json(rows)} );
 }

 function database_firmcreate(req,res,firm) {
    query = "insert into firms (name,website,active,isNew) values (\""+ firm.name +"\",\""+ firm.url + "\",1,1 )";
    make_query(query, function (rows){res.json(rows)} );
   
 }
 
 function database_addNote(req,res,note) {
	 //note.firmid, note.note
    query = "insert into notes (userID,firmID,text,dateTime) values (1,\"" + note.firmid +"\",\""+ note.text + "\",NOW())";
    make_query(query, function (rows){res.json(rows)} );
   
 }

 
 
//Router config
var hour = 3600000;
router.use(express.static('public'));
router.use(express.static('node_modules'));
router.use(require('cookie-parser')());
router.use(require('body-parser').urlencoded({ extended: true }));
router.use(bodyParser.json());
router.use(require('express-session')({
  //dd if=/dev/urandom bs=1 count=32 2>/dev/null | base64 -w 0 | rev | cut -b 2- | rev
    secret: settings.serverSecret,
    resave: true,
    saveUninitialized: true,
    cookie : {maxAge:(hour*24)},
    name : 'blankhammer'
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

  router.get("/getCurrentUser", function(req,res){
	console.log(req.session.passport)  
	res.json({"code" : 100, "username": req.session.passport.user.username})  
  });
  
  router.get("/retrieveFirms", function(req,res){
	make_query(queries.firm_age_size_team_query, function(r){res.json(r);})
  });

  router.get("/searchFirms/:name", function(req,res){
	console.log("Name " + req.params.name);
	make_query(firm_name_query(req.params.name), function(r){res.json(r);})
  });
  
  router.get("/getFirmNotes/:firmid", function(req,res){
          //console.log("Name " + req.params.name);
          query_database_firmnotes(req,res,req.params.firmid);
  });

  router.get("/getFirmFlags/:firmid", function(req,res){
          //console.log("Name " + req.params.name);
          query_database_firmflags(req,res,req.params.firmid);
  });
  
  router.get("/getFirmRS/:firmid", function(req,res){
		//console.log("Name " + req.params.name);
      
		query_database_firm_research_sessions(req,res,req.params.firmid);
  });

  router.post('/firm', function(req,res) {
          console.log("Adding a firm" + req.body.name + "  " + req.body.url);
          var firm = {"name" : req.body.name, "url": req.body.url};
          database_firmcreate(req,res, firm);
 });

   router.post('/addNote', function(req,res) {
          console.log("Adding a note" + req.body.note);
          var note = {"firmid" : req.body.firmid, "text": req.body.text};
          database_addNote(req,res, note);
 });


// route middleware to make sure
function isLoggedIn(req, res, next) {

  // if user is authenticated in the session, carry on
  if (req.isAuthenticated())
    return next();
  console.log("Auth fail");
  // if they aren't redirect them to the home page
  res.send(401);
  //res.redirect('/home');
}

function isAdmin(req, res, next) {

  // if user is authenticated in the session, carry on
  authorization.checkUserAccess(req.session.passport.user.id, 'admin', function(isAdmin) {
    if(isAdmin){
		console.log("Authorized");
		return next();
	}
	else {
		console.log("Not Authorized");
		//console.log(authorization.checkUserAccess(req.session.passport.user, 'admin'))
		// if they aren't redirect them to the home page
		res.send(401)
		//res.redirect('/home');
	}
  
  });

}

 router.listen(8020);

 module.exports = router;

 console.log("App listening on port 8020");
