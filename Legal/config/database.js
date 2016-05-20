var mysql = require('mysql');
var settings = require('../settings.cfg');

var db = {

        pool : mysql.createPool({
     connectionLimit : 100, //important
     host     :  settings.lgDatabaseHost,
     user     :  settings.lgDatabaseUser,
     password :  settings.lgDatabasePassword,
     database : 'legalgate',
     debug    :  false
 }),

 database : 'legalgate'
};

module.exports = db;

/*
USE Test;

CREATE table users (id MEDIUMINT NOT NULL AUTO_INCREMENT, username varchar(255), password varchar(255), PRIMARY KEY(id));

CREATE table firms (id MEDIUMINT NOT NULL AUTO_INCREMENT, firmname varchar(255),url varchar(255), PRIMARY KEY(id));

CREATE table user_authorization (id MEDIUMINT NOT NULL, admin MEDIUMINT);
*/


