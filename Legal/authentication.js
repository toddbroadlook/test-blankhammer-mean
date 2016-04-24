var passport =     require('passport');

module.exports.set = function(router) {
	
	 
	router.use(passport.initialize());
	router.use(passport.session());
	
	require('./config/passport')(passport); // passpassport for configuration
	 
	//Authentication ---------------------------------------
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
}