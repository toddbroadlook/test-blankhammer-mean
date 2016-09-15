
var firm_age_size_team_query = "select "+
	"firms.firmid, name, website, firms.city HQ_City, firms.state HQ_State, CONVERT(COALESCE(rs.count,-1), SIGNED INTEGER) contacts, DATEDIFF(CURRENT_TIMESTAMP(),rs.taskstop) dayssince, "+
	"FLOOR( case "+
		"when rs.count >= 145 then DATEDIFF(CURRENT_TIMESTAMP(),rs.taskstop) * (select WEIGHT from tiercontrols where tier = 1) "+
		"when rs.count >= 50 then  DATEDIFF(CURRENT_TIMESTAMP(),rs.taskstop) * (select WEIGHT from tiercontrols where tier = 2) "+
		"when rs.count >= 30 then  DATEDIFF(CURRENT_TIMESTAMP(),rs.taskstop) * (select WEIGHT from tiercontrols where tier = 3) "+
		"when rs.count >= 21 then  DATEDIFF(CURRENT_TIMESTAMP(),rs.taskstop) * (select WEIGHT from tiercontrols where tier = 4) "+
		"when rs.count >= 15 then  DATEDIFF(CURRENT_TIMESTAMP(),rs.taskstop) * (select WEIGHT from tiercontrols where tier = 5) "+
		"else DATEDIFF(CURRENT_TIMESTAMP(),rs.taskstop) * (select WEIGHT from tiercontrols where tier = 6) "+
    "end ) as score, "+
	"case "+
		"when rs.count >= 145 then 1 "+
		"when rs.count >= 50 then 2 "+
		"when rs.count >= 30 then 3 "+
		"when rs.count >= 21 then 4 "+
		"when rs.count >= 15 then 5 "+
		"else 6 "+
    "end as tier,"+
	"firms.teamid, "+
	"if(flags.firmid,'Y','N') Flagged "+
"from FIRMS "+
"LEFT OUTER JOIN "+
"FIRMLATESTECLIPSE fle "+
"ON FIRMS.firmid = fle.firmid "+
"LEFT OUTER JOIN RESEARCHSESSIONS rs "+
"ON fle.rsid = rs.rsid "+
"LEFT OUTER JOIN FLAGS "+
"ON firms.firmid = flags.firmid "+
"WHERE active = 1 "+
"ORDER BY  score DESC;"

var firm_locks_query = "select f.firmid, f.name, u.uid, u.name, u.teamid, rs.JobStart from firmlocks fl " +
" inner join"+
" researchsessions rs"+
" on rs.rsid = fl.rsid"+
" inner join firms f"+
" on f.firmid = rs.firmid"+
" inner join users u"+
" on u.uid = rs.userid"+
" order by jobStart;"


function firm_name_query(firmname){ return "SELECT firmid, name, website, city, state, postalcode from firms where name like \"%" + firmname +  "%\" and active=1" }

var q = {'firm_age_size_team_query': firm_age_size_team_query, 'firm_name_query':firm_name_query, 'firm_locks_query':firm_locks_query};

module.exports = q;