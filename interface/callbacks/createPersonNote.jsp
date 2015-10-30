<jsp:useBean id="UserContext" scope="session" class="com.kd.kineticSurvey.beans.UserContext"/>
<%@include file="../../../../core/framework/models/ArsBase.jspf" %>
<%@include file="../../framework/models/helper_servicecenter.jspf" %>

<%
    //Retrieve the survey logger that allows us to write to the kslog.
    org.apache.log4j.Logger logger = com.kd.kineticSurvey.impl.SurveyLogger.getLogger();

	/* Defined here because this jsp will be called separately. That is, not part of the Catalog jsp. */
    //HelperContext  context = UserContext.getArContext();
	String serviceAccountName="mrh admin";
	String serviceAccountPassword="mrhpass1";
	String serverName="demo.kineticdata.com";
	int tcpPort=3000;
	int rpcPort=0;
	HelperContext context = new HelperContext(serviceAccountName,serviceAccountPassword, serverName, tcpPort, rpcPort);
	
	//Not using impesonated user in this case; using a service account to create the record
	//serviceAccountContext.setImpersonatedUser(UserContext.getArContext().getUserName());
%>


<%
	String personid = request.getParameter("requesterid");
	String note = request.getParameter("note");
	if (note!=null && personid!=null){
		   
			try {
				// Find an existing record.  If exists, update; else create new
				String entryId = null;
				String qualification="'Index Field1'=\"KD ServiceCenter\" AND 'Index Field2'=\"Person Note\" AND 'Index Field3'=\""+personid+"\" AND 'Status'=\"Active\"";
				String[] sortFields = {"3"};
				Helper[] entries = Helper.findPersonNoteAll(context, qualification, sortFields,999,0,1);
				
				
				//Find last entry
				if (entries != null && entries.length > 0) {
					entryId = entries[entries.length-1].getRequestID();
				}
				
				if (entryId==null){				
					// Create KS_SRV_Helper Record
					Helper.createHelperPersonNote(context, personid, note);
				} else {
					// Update KS_SRV_Helper Record
					Helper.updateHelperPersonNote(context, entryId, note);
				}
				%>SUCCESSFUL<%
				
			} catch (Exception e){

				%>FAILED to create KS_SRV_Helper record: (<%=e.getCause()%>)<%
			}
		}
%>