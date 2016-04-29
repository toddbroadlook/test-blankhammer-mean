
var db =           require('./config/database.js');
var pool =         db.pool;

pool.query('USE ' + db.database);
module.exports.checkUserAccess = function(userid, privilege,done) {
	pool.getConnection(function(err,connection){
        if (err) {
           connection.release();
           res.json({"code" : 100, "status" : "Error in connection database"});
           return;
        }   
 
        //console.log('connected as id ' + connection.threadId);
         
        connection.query("SELECT * FROM user_authorization WHERE id = ? ",[userid], function(err, rows){
			//console.log("sent authorize query")
			//console.log(rows)
			if (rows.length < 1)
				return done(false);
			var a = rows[0];
			if(a[privilege])
				return done(true);
			return done(false);
		});
	});

}