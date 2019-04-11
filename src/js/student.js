
const institutions = {
    "unis":["Vancouver Island University",
    "Royal Roads University",
    "Simon Fraser University",
    "Trinity Western University",
    "Thompson River University",
    "University of the Fraser Valley",
    "University of British Columbia",
    "University of Northern British Columbia",
    "University of Victoria",
    "First Nations University of Canada",
    "University of Regina",
    "University of Saskatchewan",
    "Athabasca University",
    "Augustana University College",
    "Concordia University College of Alberta",
    "The King’s University College",
    "University of Alberta",
    "University of Calgary",
    "University of Lethbridge",
    "MacEwan University",
    "Mount Royal University"]
    }


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
 
var request_button_template = 
"<button type='button' class='btn btn-primary' data-toggle='modal' data-target='#notification'>\
    </button>\
"

var request_modal_template = "\
 <div class='modal fade' id='notification' tabindex='-1' role='dialog' aria-labelledby='exampleModalLabel' aria-hidden='true'>\
      <div class='modal-dialog' role='document'>\
        <div class='modal-content'>\
          <div class='modal-header'>\
            <h5 class='modal-title' id='exampleModalLabel'>Request Notification</h5>\
            <button type='button' class='close' data-dismiss='modal' aria-label='Close'>\
              <span aria-hidden='true'>&times;</span>\
            </button>\
          </div>\
          <div class='modal-body'>\
          </div>\
          <div class='modal-footer'>\
            <button type='button' id='accept-button' class='btn btn-primary'>Accept</button>\
            <button type='button' id='reject-button' class='btn btn-primary'>Reject</button>\
          </div>\
        </div>\
      </div>\
    </div>\
    </div>\
"

var score_table_template = 
"<div class='one_stu'>\
<p class='stu_name'></p>\
<table> \
<thead> \
<tr>\
  <th>Subject</th>\
  <th>Score</th>\
</tr>\
</thead>\
<tbody>\
</tbody>\
</table>\
</div"

var table_row_template = 
"<tr>\
<td class='subj'>\
<td class='mark'>\
</tr>\
"



