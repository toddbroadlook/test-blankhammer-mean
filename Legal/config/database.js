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

/*
USE Test;

CREATE table users (id MEDIUMINT NOT NULL AUTO_INCREMENT, username varchar(255), password varchar(255), PRIMARY KEY(id));

CREATE table firms (id MEDIUMINT NOT NULL AUTO_INCREMENT, firmname varchar(255),url varchar(255), PRIMARY KEY(id));

CREATE table user_authorization (id MEDIUMINT NOT NULL, admin MEDIUMINT);
*/