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
	if (personid!=null){
		   
			try {
				// Find all records
				String entryId = null;
				String qualification="'Index Field1'=\"KD ServiceCenter\" AND 'Index Field2'=\"Person Note\" AND 'Index Field3'=\""+personid+"\" AND 'Status'=\"Active\"";
				Helper[] entries = Helper.findPersonNoteAll(context, qualification);
				
				// Update status of all records
				if (entries != null && entries.length > 0) {
					for(int i=0;i<entries.length;i++) {
						entryId = entries[i].getRequestID();
						try {
							Helper.updateStatus(context,entryId,"Delete");
						} catch (Exception e){
							%>FAILED to update status of KS_SRV_Helper record <%=entryId%>: (<%=e.getCause()%>)<%
						}
					}
				}
				
				%>SUCCESSFUL<%
				
			} catch (Exception e){

				%>FAILED to update any KS_SRV_Helper records for user <%=personid%>: (<%=e.getCause()%>)<%
			}
		}
%>
