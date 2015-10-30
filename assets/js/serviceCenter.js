
function createIncident(){
    var outcome="fail";
	
	var success = function(o) {
		var myErrorMessage = '';
		if (o.responseText.indexOf('Err')>=0 || o.responseText.indexOf('FAILED')>=0) {
			
			KD.utils.Action.setQuestionValue('Incident Create Status','Failed');
			
			if (o.responseText.indexOf('Err03')>=0 || o.responseText.indexOf('Err08')>=0) {
				myErrorMessage = 'This is an old error message.';
			} else {
				myErrorMessage = 'An error has occurred attempting to submit the incident. \r\n' + o.responseText;
			}
			KD.utils.ClientManager.alertPanel(
				{
				header: 'Create incident/SRID error',
				body: myErrorMessage
				}
			);	
			
			//return outcome;
		} else {
			var incidentNumber='';
			var srid='';
			if (o.responseText.indexOf('Incident: ')>=0){
			   incidentNumber = o.responseText.substr(o.responseText.indexOf('Incident: ')+10,15);
			   KD.utils.Action.setQuestionValue('Incident Number',incidentNumber);
			}
			if (o.responseText.indexOf('SRID: ')>=0){
			   srid = o.responseText.substr(o.responseText.indexOf('SRID: ')+6,15);
			   KD.utils.Action.setQuestionValue('SRID',srid);
			}
			
			KD.utils.Action.setQuestionValue('Incident Create Status','Success');
			
			outcome="success";
			//return outcome;
		}

	};
	var failure = function(o) {
		alert('An error has occurred attempting to submit the incident.');
		//return outcome;
	};

	var connection = new KD.utils.Callback(success,failure,[]);

	// Setup a failure message that is needed by _makeSyncRequest 
	connection.failure=failure;
	var now = new Date();
	KD.utils.Action._makeSyncRequest(BUNDLE.bundlePath+'packages/serviceCenter/interface/callbacks/createIncident.jsp?requestedforid='+KD.utils.Action.getQuestionValue('Cust Number')+'&desc='+clientManager.templateName+'&noCache='+now.getTime(), connection);
	
	return outcome;
}

function displayRefNumbers(incidentNumber, srid){
	KD.utils.ClientManager.alertPanel(
	{
		header: 'Reference Numbers',
		body: 'Incident Number: ' + incidentNumber + '\r\n' + 'SRID: ' + srid
	});
}

function failFunction() {
    var proceed = confirm('Problems encountered creating the Incident and corresponding SR.  Remedy may be down.  Click OK to proceed or Cancel to retry.');

    if (proceed == true) {
        return true;
    } else {
        KD.utils.Action.setQuestionValue('Incident Create Status', '');
        alert('Press submit to retry.');
        return false;
    }
}

function getTicketDetailsMain() {
	var refNumSRMID = KD.utils.Util.getParameter('id');
	var refNumKSR = KD.utils.Util.getParameter('ksr');

	if (refNumSRMID!=null) {
		KD.utils.Action.setQuestionValue('SRM ID',refNumSRMID);
		getTicketDetailsSRM({'Request ID': refNumSRMID});
		
	} else if (refNumKSR != null) {
		KD.utils.Action.setQuestionValue('KSR Number',refNumKSR);
		getTicketDetailsKSR({'Request ID': refNumKSR});
	} else {
		alert('No reference number provided; cannot retrieve any ticket details.');
	}
}

function getTicketDetailsSRM(parameters){
	connector = new KD.bridges.BridgeConnector(); 
    connector.retrieve('Incident - Remote', 'By Request ID', {
        attributes: ['Incident Number','SRID','Status','Status Reason','Summary','Detailed Description','Resolution Text','Assigned Company','Assigned Organization','Assigned Group','Assigned Individual','Last Update'],
        parameters: parameters,
        success: function(record) {
			KD.utils.Action.setQuestionValue('Incident Number',record.attributes['Incident Number'])
			var ticketDetails = "<div class='reviewTicket_dataLabel'>Incident Number:</div><div class='reviewTicket_dataValue TicketNumber'>"+record.attributes['Incident Number']+"</div>";
			ticketDetails +=    "<div class='reviewTicket_dataLabel'>SRID:</div><div class='reviewTicket_dataValue SRID'>"+record.attributes['SRID']+"</div>";
			ticketDetails +=    "<div class='reviewTicket_dataLabel'>Status:</div><div class='reviewTicket_dataValue Status'>"+record.attributes['Status']+"</div>";
			if (record.attributes['Status Reason']!=null && record.attributes['Status Reason']!=""){
				ticketDetails += "<div class='reviewTicket_dataLabel'>Status Reason:</div><div class='reviewTicket_dataValue StatusReason'>"+record.attributes['Status Reason']+"</div>";
			}
			ticketDetails +=    "<div class='reviewTicket_dataLabel'>Summary:</div><div class='reviewTicket_dataValue Summary'>"+record.attributes['Summary']+"</div>";
			ticketDetails +=    "<div class='reviewTicket_dataLabel'>Details:</div><div class='reviewTicket_dataValue Details'>"+record.attributes['Detailed Description']+"&nbsp;</div>";
			ticketDetails +=    "<div class='reviewTicket_dataLabel'>Assignment Group:</div><div class='reviewTicket_dataValue AssignedGroup'>"+record.attributes['Assigned Company'] + " | " + record.attributes['Assigned Organization'] + " | " + record.attributes['Assigned Group'] + "</div>";
			if (record.attributes['Assigned Individual']!=null && record.attributes['Assigned Individual']!=""){
				ticketDetails += "<div class='reviewTicket_dataLabel'>Assigned Individual:</div><div class='reviewTicket_dataValue AssignedIndividual'>" + record.attributes['Assigned Individual'] + "</div>";
			} else {
				ticketDetails += "<div class='reviewTicket_dataLabel'>Assigned Individual:</div><div class='reviewTicket_dataValue AssignedIndividual'>&nbsp;</div>";
			}
			if (record.attributes['Status']=="Resolved" || record.attributes['Status']=="Closed" || record.attributes['Status']=="Cancelled"){
				ticketDetails += "<div class='reviewTicket_dataLabel'>Resolution Text:</div><div class='reviewTicket_dataValue Resolution'>" + record.attributes['Resolution Text'] + "</div>";
			}
			ticketDetails +=    "<div class='reviewTicket_dataLabel'>Last Updated:</div><div class='reviewTicket_dataValue LastUpdate'>" + moment(record.attributes['Last Update']).format('lll') + "&nbsp;&nbsp;&nbsp;(" + moment(record.attributes['Last Update']).fromNow() + ")</div>";
			
			$('#incident-details-info').html(ticketDetails);
			
			if (record.attributes['Incident Number']!=null && record.attributes['Incident Number']!=""){
				//Retrieve work info entries
				getTicketWorkInfoIncident({'Incident Number': record.attributes['Incident Number']});
				
				//insert links to add Work Info entry if not closed or cancelled
				if (record.attributes['Status']!="Closed" && record.attributes['Status']!="Cancelled"){
					var worklogURL="DisplayPage?name=WalmartWorklogUpdate&id="+KD.utils.Action.getQuestionValue('Incident Number');
					var worklogLink="<a id='workinfoAddEntry' class='templateButton' href='"+worklogURL+"' target='_blank'>Add Worklog Entry</a>";
					$('#worklogAddLink').html(worklogLink);
					
					var worklogURL2="DisplayPage?name=WalmartWorklogUpdate&id="+KD.utils.Action.getQuestionValue('Incident Number')+"&action=statusrequested";
					var worklogLink2="<a id='workinfoStatusRequired' class='templateButton' href='"+worklogURL2+"' target='_blank'>Status Required</a>";
					$('#worklogAddStatusRequired').html(worklogLink2);
				}
				
				//insert link to Remedy ticket
				var ticketQuery=encodeURIComponent("'Incident ID*+'=\""+KD.utils.Action.getQuestionValue('Incident Number')+"\"");
				var ticketURL="http://demobmc8.kineticdata.com:8080/arsys/forms/itsmstack/HPD:Help Desk?qual=";
				ticketURL += ticketQuery;	
				var ticketLink='<a class="templateButton" href="'+ticketURL+'" target="_blank">Open Remedy Ticket</a>';
				$('#openRemedyTicket').html(ticketLink);
			}
		}
    });
}

//TO DO:  Finish off this for use when a request was created but Remedy was offline.
function getTicketDetailsKSR(parameters){
}

function getTicketWorkInfoIncident(parameters){
	connector = new KD.bridges.BridgeConnector(); 
    connector.search('Work Info - Incident - Remote', 'By Incident', {
        attributes: ['Date','Notes','Summary','View Access','Type'],
        parameters: parameters,
		metadata: {"order": [encodeURIComponent('<%=attribute["Date"]%>:ASC')] },
        success: function(list) {
            var workInfoDetails = "<div class='reviewTicket_WorkInfoStatus'>No work info entries found.</div>";
			if(list.records.length > 0) {
				workInfoDetails="<ul class='reviewTicket_workInfos'>";
				for (var i=0;i<list.records.length;i++) {
					//Add li items for each work info entry retrieved
					
					var stripe="odd";
					if (i % 2 == 0){
						stripe="even";
					}
					
					var visibility="Internal";
					if (list.records[i].attributes['View Access']=="Public"){
						visibility="Public";
					}
					
					var workInfoEntry = "<li class='reviewTicket_workInfo " + visibility + " " + stripe +"'>";
					workInfoEntry += "<div class='reviewTicket_workInfoDataValue Date'>"+moment(list.records[i].attributes['Date']).format('lll')+"&nbsp;</div>";
					workInfoEntry += "<div class='reviewTicket_workInfoDataValue Type'>"+list.records[i].attributes['Type']+"&nbsp;</div>";
					//workInfoEntry += "<div class='reviewTicket_workInfoDataValue Summary'>"+list.records[i].attributes['Summary']+"&nbsp;</div>";
					workInfoEntry += "<div class='reviewTicket_workInfoDataValue Description'>"+list.records[i].attributes['Notes']+"&nbsp;</div>";
					workInfoEntry += "</li>";
					
					workInfoDetails += workInfoEntry;
				}
				workInfoDetails += "</ul>";
			}
			
			
			$('#incident-workinfo-details').html(workInfoDetails);
		}
    });
}

function populatePhone() {
	var phoneNum = [];
	phoneNum[0]=KD.utils.Action.getQuestionValue('Phone-CountryCode');
	phoneNum[1]=KD.utils.Action.getQuestionValue('Phone-AreaCode');
	phoneNum[2]=KD.utils.Action.getQuestionValue('Phone-Local');
	if (KD.utils.Action.getQuestionValue('Phone-Extension')!=null && KD.utils.Action.getQuestionValue('Phone-Extension')!="") {
		phoneNum[3]='ext. ' + KD.utils.Action.getQuestionValue('Phone-Extension');
	}
	
	KD.utils.Action.setQuestionValue('Customer Phone',phoneNum.join(" "));
}
