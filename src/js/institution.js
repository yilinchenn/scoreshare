const students_json = 
{
    "Adele" : {"english": 4.0, "math" : 3.8, "physics":3.0},
    "Agnes" : {"english": 4.0, "math" : 3.8, "physics":3.0}, 
    "Billy": {"english": 4.0, "math" : 3.8, "physics":3.0},
    "Bob":{"english": 4.0, "math" : 3.8, "physics":3.0}, 
    "Calvin": {"english": 4.0, "math" : 3.8, "physics":3.0}, 
    "Christina": {"english": 4.0, "math" : 3.8, "physics":3.0}, 
    "Cindy" : {"english": 4.0, "math" : 3.8, "physics":3.0}
}
    
var score_table_template = 
"<div class='one_stu'>\
<p class='stu_name'></p>\
<p class='stu_addr'></p>\
<table> \
<thead> \
<tr>\
  <th>Subject</th>\
  <th>Score</th>\
</tr>\
</thead>\
<tbody class='scores'>\
</tbody>\
</table>\
</div"

var table_row_template = 
"<tr>\
<td class='subj'>\
<td class='mark'>\
</tr>\
"
