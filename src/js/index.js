App = {
    web3Provider: null,
    contracts: {},
    contract_addr: "0x0",
    account: '0x0',
    hasVoted: false,
  
    init: function() {
      return App.initWeb3();
    },
  
    initWeb3: function() {
      // TODO: refactor conditional
      if (typeof web3 !== 'undefined') {
        // If a web3 instance is already provided by Meta Mask.
        App.web3Provider = web3.currentProvider;
        //console.log(App.web3Provider)
        web3 = new Web3(web3.currentProvider);
      } else {
        // Specify default instance if no web3 instance provided
        App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
        web3 = new Web3(App.web3Provider);
      }
      App.account = web3.eth.accounts[0];
      if ($('#my_account') != null){
        $('#my_account').append("<p>" +"my address is "+ App.account + "</p>");
      }
      

      return App.initContract();
    },


    initContract: function() {
        $.getJSON("../ScoreShare.json", function(data) {
          // Instantiate a new truffle contract from the artifact
          App.contracts.ScoreContract = TruffleContract(data);
          // Connect provider to interact with contract
          App.contracts.ScoreContract.setProvider(App.web3Provider);
    
          //read contract address
          App.contracts.ScoreContract.deployed().then(function(instance) {
            //console.log("call function");
            console.log("contract address: " + App.contracts.ScoreContract.address);
            App.contract_addr = App.contracts.ScoreContract.address;
            //return instance.addInstitution(addr, name, { from: App.account });
            return App.checkInst();
        })
          
        });
        
      },

      addInst: function(){
        //var stu_addr = $('.get_record_form').find("input.stu_addr").val();
        var inst_addr = $('.add_inst_form').find("input.inst_addr").val();
        var inst_name = $('.add_inst_form').find("input.inst_name").val();
        console.log(App.account);
        console.log("adding: "+ typeof(inst_name) + " " + typeof(inst_addr));

        App.contracts.ScoreContract.deployed().then(function(instance) {
            //console.log("call function");
            return instance.addInstitution(inst_addr, inst_name, { from: App.account });
        })
      },

      getInst: function(fn){
            //console.log(App.contract_addr);
            const filter = web3.eth.filter({
                fromBlock:0,
                toBlock: 'latest',
                address: App.contract_addr, // contract address
                topics: [web3.sha3("addInstitutionEvent(address)")]
            })
            var result = filter.get(function(error, log){
                insts = []
                //console.log(log);
                for (var i=0; i<log.length; i++){
                    insts.push(log[i].data);
                }
                fn(insts);
                //console.log(insts)
                //return insts;

            })
            //console.log(result)
            
      },

      checkInst: function(){
          App.getInst(function(insts){
            //console.log(insts)
            var is_inst = false;
            var a_tag = document.createElement("a");
              for (var i=0; i<insts.length; i++){
              //console.log((App.account))
                var inst_account = parseInt(insts[i])
                var my_account = parseInt(web3.eth.accounts[0])
                console.log("my_account: " + my_account)
                console.log("isnt_account: " + inst_account)
                if (my_account == inst_account){
                  $('#my_account').append('<p>' + 'I am an institution' + '</p>');
                  a_tag.setAttribute("href", "./institution.html");
                  a_tag.innerHTML = "go to inst view";
                  $('#my_account').append(a_tag);
                  is_inst = true;
                  break;
                } 
            }

            if (is_inst == false){
                $('#my_account').append('<p>' + 'I am a student' + '</p>');
                a_tag.innerHTML = "go to student view";
                a_tag.setAttribute("href", "./student.html");
                $('#my_account').append(a_tag);
            }

          });
    
      },

      addRecord: function(){
          //  var students_json = 
          // {
          //     // "yilin" : {"address": "0xAEBC5e957A949802b0c0E4503BD333b3da95912C", "english": 4.0, "math" : 3.8, "physics":3.0}
          //     "ma" : {"address": "0xe77b9bA35c792450eF94D9D5f53399A88F0c8c01", "english": 4.0, "math" : 3.8, "physics":3.0}
          // }

          var stu_name = $('.add_record_form').find("input.stu_name").val()
          var stu_addr = $('.add_record_form').find("input.stu_addr").val()
          var student_json = {}
          var score = {}
          score["address"] = stu_addr
          score[$('.add_record_form').find("input.subject_1").val()] = $('.add_record_form').find("input.score_1").val()
          score[$('.add_record_form').find("input.subject_2").val()] = $('.add_record_form').find("input.score_2").val()
          score[$('.add_record_form').find("input.subject_3").val()] = $('.add_record_form').find("input.score_3").val()
          student_json[stu_name] = score;
          
          console.log(student_json)

           var hashedRecord = web3.sha3(JSON.stringify(students_json));
           console.log("record hash: " + hashedRecord);
           App.contracts.ScoreContract.deployed().then(function(instance) {
            //console.log("call function");
            //return instance.postScoreRecord(students_json["yilin"]["address"], hashedRecord, { from: App.account });
            return instance.postScoreRecord(stu_addr, hashedRecord, { from: App.account });
          })
           // add record to database
           $.ajax({
              url: "http://127.0.0.1:5000/addrecord",
              type: "POST",
              data: {
                key: hashedRecord,
                value: JSON.stringify(students_json)
              },
              success:function(result){
                console.log(result)
              },
              error:function(error){
                console.log('Error ${error}')
              }
           })
      },

      getRecord: function(){
          //read student addr from form
          var stu_addr = $('.get_record_form').find("input.stu_addr").val();
          console.log(stu_addr);

          App.contracts.ScoreContract.deployed().then(function(instance) {
            //console.log("call function");
            //return instance.getScoreRecord("0xAEBC5e957A949802b0c0E4503BD333b3da95912C", App.account, { from: App.account });
            return instance.getScoreRecord(stu_addr, App.account, { from: App.account });
          }).then(function(recordHash) {
              var key = recordHash["logs"][0]["args"]["record"];
              console.log(key);

              // get record from database
              $.ajax({
              url: "http://127.0.0.1:5000/getrecord/"+key,
              type: "GET",
              success:function(result){
                console.log(result)
              },
              error:function(error){
                console.log('Error ${error}')
              }
           })
          })
      }, 

      requestAccess: function(){
           var stu_addr = $('.request_access_form').find("input.stu_addr").val();
           console.log("requesting: "+ stu_addr)
           App.contracts.ScoreContract.deployed().then(function(instance) {
            //console.log("call function");
            //return instance.getScoreRecord("0xAEBC5e957A949802b0c0E4503BD333b3da95912C", App.account, { from: App.account });
            return instance.postAccessRequest(stu_addr, { from: App.account });
          })
      },

      listRequests: function(){

              //reset div
               $("#new_request").empty();

              const filter = web3.eth.filter({
                fromBlock:0,
                toBlock: 'latest',
                address: App.contract_addr, // contract address
                topics: [web3.sha3("accessRequestEvent(address,address)")]
              });
              var result = filter.get(function(error, log){
                //console.log(error);
                const filter2 = web3.eth.filter({
                  fromBlock:0,
                  toBlock: 'latest',
                  address: App.contract_addr, // contract address
                  topics: [web3.sha3("accessControllEvent(address,address,bool)")]
                });


                var result2 = filter2.get(function(error2, log2){
                    // console.log(App.account.substr(2));
                    for (var i=0; i<log.length; i++){
                      //console.log(one_log.data);
                      var inst = log[i].data.substring(26, 66);
                      var student = log[i].data.substring(90, 130);
                      if (student != App.account.substr(2)){
                        continue;
                      }

                      var approved = false;

                      for (var j=0; j<log2.length;j++){
                        var inst2 = log2[j].data.substring(26, 66);
                        var student2 = log2[j].data.substring(90, 130);
                        if (student2 == student && inst2 == inst){
                          approved = true;
                          break;
                        }

                      }
                      if (approved == false){
                        // console.log(inst);
                        App.contracts.ScoreContract.deployed().then(function(instance) {
                          //console.log("call function");
                            //return instance.getScoreRecord("0xAEBC5e957A949802b0c0E4503BD333b3da95912C", App.account, { from: App.account });
                            // get inst name
                            instance.institutions("0x" + inst).then(function(inst_tuple){
                              //console.log(score_table_template)
                              //construct button
                              var request_button = $(request_button_template);
                              request_button.attr("data-target", "#notification_" + inst);
                              request_button.attr("id", inst);
                              request_button.html("new request from "+ inst_tuple[0]);
                              $("#new_request").append(request_button);

                              //construct modal
                              var request_modal = $(request_modal_template);
                              request_modal.attr("id", "notification_" + inst)
                              request_modal.find("div.modal-body").html("new request from "+ inst_tuple[0]);
                              var on_click_string  = "App.approveRequest('0x" + inst + "'); $('notification_" + inst + "').modal('hide');";
                              request_modal.find("#accept-button").attr("onclick", on_click_string);
                              $("#new_request").append(request_modal);
                            });
                        });
                     
                      }
                      // console.log(scoreAccess);
                      // console.log(inst);
                      // console.log(student);
                      // console.log(log);
                    }
                });
              });
      },

      approveRequest: function(inst_addr){
        console.log("approve " + inst_addr);
        App.contracts.ScoreContract.deployed().then(function(instance) {
            instance.approveAccessRequest(inst_addr, { from: App.account });

        });

      }        
}

    


$(document).ready(function(){
    App.init();

    //$('#my_account').append("<p>" +"my address is "+ App.account + "</p>");
    //App.checkInst();
    //App.getInst();
})

