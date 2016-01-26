 var mysql = require('mysql');

var db = {

	pool : mysql.createPool({
     connectionLimit : 100, //important
     host     : 'localhost',
     user     : 'root',
     password : 'redcoats',
     database : 'test',
     debug    :  false
 }),

 database : 'test',
 users_table : 'users'
};

module.exports = db;