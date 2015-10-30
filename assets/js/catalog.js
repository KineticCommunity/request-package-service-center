$(document).ready(function() {

    // Ensure the BUNDLE global object exists
    BUNDLE = BUNDLE || {};
    // Create the package namespace
    BUNDLE.package = BUNDLE.package || {};
    // Create the submissions namespace
    BUNDLE.package.submissions = BUNDLE.package.submissions || {};

    // focus the "who" field
    $('form#user-search input[name="q"]').focus();

    // Unobtrusive key up event on user search
    $('form#user-search').on('keyup', function(event) {
        if (event.keyCode == 32) {
            var searchWords = $(this).find('input[name="q"]').val().split(" ");
            var searchTerms = $.trim($(this).find('input[name="q"]').val());
            if (searchWords.length > 2) {
                filterTable('#user-results', $(this).find('input[name="q"]').val());
            } else {
				findUserResults($(this).find('input[name="srv"]').val(), 'By Search', {'keyword': searchTerms});
				$('.user-address-wrap').hide();
				$('#allResults').hide();
				$('#notifyResults').html($('#notifyResultsValue').html()).show();
            }
        }
    });

    // Unobtrusive submit event on user
    $('form#user-search').on('submit', function(event) {
        event.preventDefault();
		if (KD.utils.Util.getParameter('requesterid')==null) {
			findUserResults($(this).find('input[name="srv"]').val(), 'By Search', {'keyword': $(this).find('input[name="q"]').val()});
			$('.user-address-wrap').hide();
			$('#allResults').hide();
			$('#notifyResults').html($('#notifyResultsValue').html()).show();
		} else if (searchByID==true){ //(KD.utils.Util.getParameter('requesterid')!=null){
			showUserAccount('div.userDetails', 'By User ID', {'UserID': $('form#user-search').find('input[name="q"]').val()}, userSelectedIvr);
			searchByID=false;
		}
    });
    var irvCheck = false;
    // Unobtrusive onclick event for irv search
    $('#ivr').on('click', function(event) {
        event.preventDefault();
		showUserAccount('div.userDetails', 'By Phone Number', {'Phone Number': $('form#user-search').find('input[name="q"]').val()}, userSelectedIvr);
        // if(irvCheck) {
            // showUserAccount('div.userDetails', 'By Phone Number', {'Phone Number': $(this).data('phone-number-one')}, userSelectedIvr);
            // check = false;
        // } else {
           // showUserAccount('div.userDetails', 'By Phone Number', {'Phone Number': $(this).data('phone-number-two')}, userSelectedIvr);
           // irvCheck = true; 
        // }
    });
	
    // Unobtrusive click event for viewing user info
    $('table#user-results').on('click', 'tbody tr', function(event) {
        showUserAccount('div.userDetails', 'By User ID', {'UserID': $(this).data('user-id')}, userSelect);
    });

    // Unobtrusive click event for selecting user
    $('div.userDetails').on('click', '.templateButton', function(event) {
        //$('div#contact').html($('.user-address').html());
        $('.result-wrap').hide();
        $('div#details').show();
        if ($('#allResults').is(':hidden') && $('#template-search-results').html()){
            $('#allResults').show();
            $('#notifyResults').hide();
        }
        $('div.userDetails').siblings().show();
        $(this).hide();
		$('div#pastactivity').hide();
		$('.userlocationtop').hide();
		//reset AdditionalComments fields.
		$('#callerdatatext').val('');
		$('#callerdatatext').css('background','transparent');
		$('#callerdatatext-status').text('');
		$('#callerdatatext-status').css('visibility','hidden');
		$('#callerdatatext-clear').css('visibility', 'hidden');
		
		//retrieve data about the user
		retrieveDemographics($('#selectedUserId').text());
		retrieveAuthentication($('#selectedUserId').text());
		retrieveLocation($('#selectedUserId').text());
		retrievePastActivity({'Login ID': $('#selectedUserId').text()});
		retrieveAdditionalComments({'Person Id': $('#selectedUserId').text()});
    });

    // Click event for search on service items
    $('form#what-search').on('submit', function(event) {
        // Prevent default action.
        event.preventDefault();
        searchServiceItems(this);
        $('.result-wrap').hide();
        $('.user-address-wrap').hide();
        $('#notifyResults').hide();
        $('.response-message').hide();
    });

    // Unobtrusive key up event for service item search
    $('form#what-search').on('keyup', function(event) {
        // Prevent default action.
        event.preventDefault();
        if (event.keyCode == 32) {
            searchServiceItems(this);
        }
        $('.result-wrap').hide();
        $('.user-address-wrap').hide();
        $('#notifyResults').hide();
        $('.response-message').hide();
    });

    $('#notifyResults').on('click', function(event){
        event.preventDefault();
        $('#allResults').show();
        $('#notifyResults').hide();
        $('.response-message').hide();
        $('.result-wrap').hide();
    });

    // Unobtrusive click event for choosing service item
    $('#template-search-results').on('click', 'a.templateButton', function(event) {
        event.preventDefault();
        var fullurl = $(this).attr('href') + "&userid=" + $('#selectedUserId').text();
        window.open('/kinetic/'+fullurl,'_blank');
    });

	
	// Auto Search functions based on URL parameters
	if (KD.utils.Util.getParameter('requesterinfoname')!=null){
		$('form#user-search').find('input[name="q"]').val(KD.utils.Util.getParameter('requesterinfoname'));
		$('form#user-search').submit();
	};
	
	if (KD.utils.Util.getParameter('requesterinfophone')!=null){
		$('form#user-search').find('input[name="q"]').val(KD.utils.Util.getParameter('requesterinfophone'));
		$('#ivr').click();
	};
	
	//Establish and set a variable on how the initial search was conducted.  If true, the seaerch will always 
	//attempt to use the login ID of the user from the URL line.  Once a successful seach has been executed, 
	//this is reset to allow other searching with requiring a reset.  Probably should use a separate button 
	//like the handset if the agent knows they are entering a user ID.
	var searchByID=false;
	if (KD.utils.Util.getParameter('requesterid')!=null){
		searchByID=true;
		$('form#user-search').find('input[name="q"]').val(KD.utils.Util.getParameter('requesterid'));
		$('form#user-search').submit();
	};
	
	// Unobtrusive key up event on specified ticket
    $('#specifiedTicket').on('keyup', function(event) {
        if (event.keyCode == 32 || event.keyCode == 13) {
            var ticketInput = $.trim($(this).val());
			var inputLength = ticketInput.length
			var pad = "REQ000000000000";
			ticketInput = pad.substring(0,pad.length - inputLength) + ticketInput;
			window.open('DisplayPage?name=WalmartIncidentDetail&id=' + ticketInput,'_blank');
        }
    });
	
	
	$('#callerdatatext').typing({
		start: function (event, $elem) {
			$elem.css('background', 'darkorange');
			$('#callerdatatext-status').text('');
			$('#callerdatatext-status').css('visibility','hidden');
	},
		stop: function (event, $elem) {
			$('#callerdatatext-status').css('visibility','visible');
			
			//if element is empty/blank, clear the field; else create/update record
			if ($elem.val()==null || $elem.val()==""){
				clearPersonNote( $('#selectedUserId').text() );
			} else {
			    addPersonNote($('#selectedUserId').text(), $('#callerdatatext').val());
			}
			
	},
		delay: 500
	});
	
});


////////////
// FUNCTIONS
////////////

// User Search Funtions //
// user is "finished typing," do something
function findUserResults(srv, qualification, parameters) {
    $('#loader').show();
    $('.response-message').hide();
    $('.result-wrap').hide();
    $('div.user-details').parent().hide();
    KD.utils.ClientManager.templateId = srv;
    connector = new KD.bridges.BridgeConnector({templateId: BUNDLE.config.commonTemplateId});
    connector.search('Customer', qualification, {
        attributes: ['First Name', 'Last Name', 'Email', 'City', 'State', 'User ID', 'Phone Number'],
        parameters: parameters,
        success: function(list) {
            $('#loader').hide();
            if(list.records.length > 0) {
               var tbody = $('<tbody></tbody>');
                for(i = 0; i < list.records.length; i++) {
                    var row = $('<tr></tr>');
                    if (i % 2 == 0) {
                        row.addClass('odd');
                    } else {
                        row.addClass('even');
                    }
                    var attributes = list.records[i].attributes;
                    for(var key in attributes) {
                        if(key == 'User ID') {
                            row.data('user-id', attributes[key]);
                        } else {
                            if(attributes.hasOwnProperty(key)) {
                                row.append('<td>'+attributes[key]+'</td>');
                            }
                        }
                    }
                    tbody.append(row);
                }
                $('#user-results tbody').replaceWith(tbody);
                $('.result-wrap').css({'display':'inline-block'}); 
            } else {
                $('.response-message').text('No results were found.').show();
            }
        }
    });
}

// Popup with user info
function showUserAccount(selector, qualification, parameters, successFunction) {
    $(selector).parent().hide();
    connector = new KD.bridges.BridgeConnector({templateId: BUNDLE.config.commonTemplateId}); 
    connector.retrieve('Customer', qualification, {
        parameters: parameters,
        attributes: ['First Name', 'Last Name', 'Street', 'City', 'State', 'Zip', 'User ID', 'Phone Number' ],
        success: function(record) {
            successFunction(selector, record);       
        }
    });
}

// Popup with user info
function showUserAccountID(selector, qualification, parameters, successFunction) {
    $(selector).parent().hide();
    connector = new KD.bridges.BridgeConnector({templateId: BUNDLE.config.commonTemplateId}); 
    connector.retrieve('Customer', qualification, {
        parameters: parameters,
        attributes: ['First Name', 'Last Name', 'Street', 'City', 'State', 'Zip', 'User ID', 'Phone Number' ],
        success: function(record) {
            successFunction(selector, record);       
        }
    });
}

// Service item search //
function searchServiceItems(formSelector) {
    // Execute the ajax request.
    BUNDLE.ajax({
        cache: false,
        type: $(formSelector).attr('method'),
        data: $(formSelector).serialize(),
        url: $(formSelector).attr('action'),
        beforeSend: function(jqXHR, settings) {
            before(jqXHR, settings);
        },
        success: function(data) {
            success(data);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            error(jqXHR, textStatus, errorThrown);
        }
    });
}

/**
 * Action functions for catalog search
 */
function before() {
    $('#loader').show();
}

function success(data) {
    $('#loader').hide();
    if(data) {
        // Clear states and bind alphabetical nav
        jQuery('#template-search-results').html(data).show();
    }
}

function error() {
    jQuery('#template-search-results').html('<div class="message alert alert-error"><a class="close" data-dismiss="alert">x</a> There was an error. Try again.</div>').show();
}


// ignore case function
$.expr[':'].containsIgnoreCase = function(n,i,m){
  return jQuery(n).text().toUpperCase().indexOf(m[3].toUpperCase())>=0;
};

// Table filtering function 
function filterTable(table, searchTerm){
 //hide all the rows
          $(table).find("tr").hide();
 //split the current value of searchInput
          var data = searchTerm.split(" ");
 //create a jquery object of the rows
          var jo = $(table).find("tr");
 //Recursively filter the jquery object to get results. 
          $.each(data, function(i, v){
              if (v.length > 0){
                jo = jo.filter("*:containsIgnoreCase('"+v+"')");
              }
          });
 //show the rows that match.
          jo.show();
          $(table + ' thead tr').show();
}


function userSelect(selector, record) {
    if(record.exists) {
        var contact = '';
        var fullName = '';
        var attributes = record.attributes;
        for(var key in attributes) {
            if(attributes.hasOwnProperty(key)) {
                if (key != 'User ID' && key != 'First Name' && key != 'Last Name' && key != 'Phone Number'){
                    var contact = contact + ' ' +attributes[key];
                }
                if(key == 'First Name' || key == 'Last Name') {
                    fullName = fullName + ' ' +attributes[key];
                } 
                if (key == 'Street') {
                    var contact = contact + '<br />';
                }
                if (key == 'City') {
                    var contact = contact + ',';
                }
                if (key == 'User ID') {
                    var contact = contact + '<div id="selectedUserId" class="hidden">'+attributes[key]+'</div>';
                }
				if (key == 'Phone Number') {
                    var contact = contact + '<br />' + attributes[key];
                }
            }
        }
        $(selector + ' h2').html(fullName);
        $('#contact').html(contact);
        $(selector).siblings().hide();
        $(selector).parent().show();
		$('.userlocationtop').show()
        $(selector + ' .templateButton').show().focus();
    } else {
        $('.response-message').text('No results were found.').show();
    }
}

function userSelectedIvr(selector, record) {
    if(record.exists) {
        var contact = '';
        var fullName = '';
        var attributes = record.attributes;
        for(var key in attributes) {
            if(attributes.hasOwnProperty(key)) {
                if (key != 'User ID' && key != 'First Name' && key != 'Last Name'){
                    var contact = contact + ' ' +attributes[key];
                }
                if(key == 'First Name' || key == 'Last Name') {
                    fullName = fullName + ' ' +attributes[key];
                } 
                if (key == 'Street') {
                    var contact = contact + '<br />';
                }
                if (key == 'City') {
                    var contact = contact + ',';
                }
                if (key == 'User ID') {
                    var contact = contact + '<div id="selectedUserId" class="hidden">'+attributes[key]+'</div>';
                }
            }
        }
        $(selector + ' h2').html(fullName);
        $('#contact').html(contact);
        $(selector).siblings().hide();
        $(selector).parent().show();
        $(selector + ' .templateButton').show().focus();
        $('input[type="button"].templateButton').trigger('click');
        $('form#what-search').find('input[type="search"]').focus();
    } else {
        $('.response-message').text('No results were found.').show();
    }
}

function retrievePastActivity(parameters){
	$('#loader_pastactivity').show();
	$('.pastactivity-response-message').text('').hide();
	$('#pastactivity ul').empty();
	connector = new KD.bridges.BridgeConnector({templateId: BUNDLE.config.commonTemplateId}); 
    connector.search('Requests - SRM - Remote', 'Requested By or Requested For', {
        attributes: ['Request Number','Summary','Status','Submit Date'],
        parameters: parameters,
		metadata: {"order": [encodeURIComponent('<%=attribute["Submit Date"]%>:DESC')] },
        success: function(list) {
            $('#loader_pastactivity').hide();
            if(list.records.length > 0) {
                for(i = 0; i < list.records.length; i++) {
                    var requestStatus=list.records[i].attributes['Status'];
					var statusClass="requestStatusActive";
					if (requestStatus=="Completed" || requestStatus=="Rejected" || requestStatus=="Cancelled" || requestStatus=="Closed"){
						statusClass="requestStatusInactive";
					}
					$("#pastactivity ul").append('<li class="activity '+ statusClass + '"><a href="DisplayPage?name=WalmartIncidentDetail&id='+list.records[i].attributes['Request Number']+'" target="_blank"><span class="activitynumber">'+list.records[i].attributes['Request Number']+' - '+list.records[i].attributes['Summary']+'</span></a></li>');
                }
                $('#pastactivity').show(); 
            } else {
                $('.pastactivity-response-message').text('No past activity.').show();
            }
        }
    });
}	
	
function retrieveDemographics(parameters){
   userData=sampledata(parameters);
   //alert(data);
   //alert(data.userinfo.demographics.nuid);
   //var userData = JSON.parse(data);
   $('#demographics-nuid').text(userData.userinfo.demographics.nuid);
   $('#demographics-jobtitle').text(userData.userinfo.demographics.jobtitle);
   $('#demographics-contacttype').text(userData.userinfo.demographics.contacttype);
}

function retrieveAuthentication(parameters){
	$('#authentication-registered').text(decodeURIComponent(KD.utils.Util.getParameter('registered')));
	$('#authentication-level').text(decodeURIComponent(KD.utils.Util.getParameter('authlevel')));
	$('#authentication-kpimstatus').text(decodeURIComponent(KD.utils.Util.getParameter('kpimstatus')));
}

function retrieveLocation(parameters){
	var userData=sampledata(parameters);
	//var userData = JSON.parse(data);
	$('#location-region').text(userData.userinfo.location.region);
	$('#location-sitegroup').text(userData.userinfo.location.sitegroup);
	$('#location-site').text(userData.userinfo.location.site);
	$('#location-address').text(userData.userinfo.location.address);
	$('#location-phone').text(userData.userinfo.location.phonenumber);
}

function retrieveAdditionalComments(parameters){
	connector = new KD.bridges.BridgeConnector({templateId: BUNDLE.config.commonTemplateId}); 
    connector.search('Helper - ServiceCenter People Notes', 'By PersonId', {
        attributes: ['Note'],
		metadata: {"order": [encodeURIComponent('<%=attribute["Create Date"]%>:ASC')] },
        parameters: parameters,
        success: function(list) {
            if(list.records.length > 0) {
                $('#callerdatatext').val(''+list.records[list.records.length-1].attributes['Note']+'');
				$('#callerdatatext').css('background', 'hotpink');
				$('#callerdatatext-clear').css('visibility', 'visible');
            } else {
                $('#callerdatatext').css('background', 'transparent');
				$('#callerdatatext-clear').css('visibility', 'hidden');
            }
        }
    });
}

function sampledata(userid){
    jsondata={"userinfo": {"demographics": {"nuid": "","jobtitle": "","contacttype": ""},"location": {"region": "","sitegroup": "","site": "","address": "","phonenumber": ""}}};
    if (userid && userid=="207"){
        jsondata={"userinfo":{"demographics":{"nuid":"8123456","jobtitle":"Int Med-Gastroenterology","contacttype":"Physician Support"},"location":{"region":"CS","sitegroup":"San Diego - San Diego","site":"ZIO - San Diego Medical Center","address":"","phonenumber":"619-427-5555"}}};
    } else if (userid && userid=="281"){
        jsondata={"userinfo":{"demographics":{"nuid":"0321654","jobtitle":"Nursing Dept Asst. Manager, RN","contacttype":"Hospital"},"location":{"region":"CS","sitegroup":"Napa/Solano - Vallejo","site":"VAL - Vallejo Medical Offices Addition","address":"975 Serano Dr. \r\nVallejo, CA, 94589","phonenumber":"707-427-5555"}}};
    }
    return jsondata
}

function addPersonNote(personid,note){
	if (personid && personid != null && note && note != null){
		var createRecordResult = $.ajax({
			type: "post",
			url: BUNDLE.packagePath + "../serviceCenter/interface/callbacks/createPersonNote.jsp",
			cache: false,
			data: {	
					requesterid: 	personid,
					note: 			note
					}
		}).done(function(data, textStatus, jqXHR){
			if ($('#callerdatatext-status').css('visibility')=="hidden"){
			} else {
				if (data.indexOf('SUCCESSFUL')>0){
					$('#callerdatatext-status').text('Saved');
					$('#callerdatatext').css('background', 'hotpink');
					$('#callerdatatext-clear').css('visibility', 'visible');
				} else {
					$('#callerdatatext-status').text('Error - Not saved');
				}
			}
		}).fail(function( jqXHR, textStatus, errorThrown){
			if ($('#callerdatatext-status').css('visibility')=="hidden"){
			} else {
				$('#callerdatatext-status').text('Error - not saved');
			}
		})
	}
}

function clearPersonNoteButton(personid) {
	$('#callerdatatext-status').text('');
	$('#callerdatatext-status').css('visibility','visible');
	clearPersonNote(personid);
}


function clearPersonNote(personid){
	if (personid && personid != null){
		$('#callerdatatext').val('');
		var createRecordResult = $.ajax({
			type: "post",
			url: BUNDLE.packagePath + "../serviceCenter/interface/callbacks/clearPersonNote.jsp",
			cache: false,
			data: {requesterid: personid}
		}).done(function(data, textStatus, jqXHR){
			if ($('#callerdatatext-status').css('visibility')=="hidden"){
			} else {
				if (data.indexOf('SUCCESSFUL')>0){
					$('#callerdatatext-status').text('Cleared');
					$('#callerdatatext').css('background', 'transparent');
					$('#callerdatatext-clear').css('visibility', 'hidden');
				} else {
					$('#callerdatatext-status').text('Error - not cleared');
					retrieveAdditionalComments({'Person Id': $('#selectedUserId').text()});
				}
			}
		}).fail(function( jqXHR, textStatus, errorThrown){
			if ($('#callerdatatext-status').css('visibility')=="hidden"){
			} else {
				$('#callerdatatext-status').text('Error - not cleared');
				retrieveAdditionalComments({'Person Id': $('#selectedUserId').text()});
			}
		})
	}
}

function openAddressUpdateForm() {
	window.open('DisplayPage?name=WalmartAddressChange&id='+$('#selectedUserId').text(),'_blank');
}