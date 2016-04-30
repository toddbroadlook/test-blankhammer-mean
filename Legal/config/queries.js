
var firm_age_size_team_query = "select "+
	"firms.firmid, name, website, firms.city, firms.state, rs.count contacts, DATEDIFF(CURRENT_TIMESTAMP(),rs.taskstop) dayssince, "+
	"case "+
		"when rs.count >= 145 then DATEDIFF(CURRENT_TIMESTAMP(),rs.taskstop) * (select WEIGHT from tiercontrols where tier = 1) "+
		"when rs.count >= 50 then  DATEDIFF(CURRENT_TIMESTAMP(),rs.taskstop) * (select WEIGHT from tiercontrols where tier = 2) "+
		"when rs.count >= 30 then  DATEDIFF(CURRENT_TIMESTAMP(),rs.taskstop) * (select WEIGHT from tiercontrols where tier = 3) "+
		"when rs.count >= 21 then  DATEDIFF(CURRENT_TIMESTAMP(),rs.taskstop) * (select WEIGHT from tiercontrols where tier = 4) "+
		"when rs.count >= 15 then  DATEDIFF(CURRENT_TIMESTAMP(),rs.taskstop) * (select WEIGHT from tiercontrols where tier = 5) "+
		"else DATEDIFF(CURRENT_TIMESTAMP(),rs.taskstop) * (select WEIGHT from tiercontrols where tier = 6) "+
    "end as score, "+
	"case "+
		"when rs.count >= 145 then 1 "+
		"when rs.count >= 50 then 2 "+
		"when rs.count >= 30 then 3 "+
		"when rs.count >= 21 then 4 "+
		"when rs.count >= 15 then 5 "+
		"else 6 "+
    "end as tier,"+
	"firms.teamid "+
"from FIRMS "+
"LEFT OUTER JOIN "+
"FIRMLATESTECLIPSE fle "+
"ON FIRMS.firmid = fle.firmid "+
"LEFT OUTER JOIN RESEARCHSESSIONS rs "+
"ON fle.rsid = rs.rsid "+
"LEFT OUTER JOIN FLAGS "+
"ON firms.firmid = flags.firmid "+
"WHERE active = 1 and flagtype is null "+
"ORDER BY  score DESC;"

var q = {'firm_age_size_team_query': firm_age_size_team_query};

module.exports = q;