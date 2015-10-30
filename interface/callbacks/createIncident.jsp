<jsp:useBean id="UserContext" scope="session" class="com.kd.kineticSurvey.beans.UserContext"/>
<%@include file="../../../../core/framework/models/ArsBase.jspf" %>
<%@include file="../../framework/models/incident.jspf" %>
<%@include file="../../framework/models/srm.jspf" %>

<%
    //Retrieve the survey logger that allows us to write to the kslog.
    org.apache.log4j.Logger logger = com.kd.kineticSurvey.impl.SurveyLogger.getLogger();

	/* Defined here because this jsp will be called separately. That is, not part of the Catalog jsp. */
    //HelperContext  context = UserContext.getArContext();
	String serviceAccountName="Demo";
	String serviceAccountPassword="";
	String serverName="demobmc8.kineticdata.com";
	int tcpPort=3000;
	int rpcPort=0;
	HelperContext serviceAccountContext = new HelperContext(serviceAccountName,serviceAccountPassword, serverName, tcpPort, rpcPort);
	
	//Not using impesonated user in this case; using a service account to create the record
	//serviceAccountContext.setImpersonatedUser(UserContext.getArContext().getUserName());
%>

<%
	String description = request.getParameter("desc");
	String requestedFor = request.getParameter("requestedforid");
	if (requestedFor!=null) {
		if (description==null){
		   description="Description not provided";
		}
		String iicEntryID = null;
		String incidentNumber = null;
		String srid = null;
		   
		try {
			// Create IncidentInterface_Create Record
			//iicEntryID = Incident.createIncident(serviceAccountContext, serviceType, description, requestedForLogin, submitterLogin, assignedCompany, assignedOrganization, assignedGroup);
			iicEntryID = Incident.createIncident(serviceAccountContext, "User Service Restoration", description, requestedFor, UserContext.getArContext().getUserName(), null, null, null);
			//logger.warn("Create Incident");
			
			%>SUCCESSFUL IIC Submission: <%=iicEntryID%><br><%
			
			try {
				String iicQualification="'Request ID'=\""+iicEntryID+"\"";
				//Incident iicEntry = Incident.findIIC(serviceAccountContext, iicQualification);
				Incident iicEntry = Incident.find(serviceAccountContext, iicQualification);
				//logger.warn("Retrieved Incident");
				incidentNumber = iicEntry.getIncidentNumber();
				
				%>SUCCESSFUL IIC Retrieve: <%=incidentNumber%><br><%
				
				try{
					String srmQualification="'AppRequestID'=\""+incidentNumber+"\"";
					//SRM srmTicket = SRM.findSRM(serviceAccountContext, srmQualification);
					SRM srmTicket = SRM.find(serviceAccountContext, srmQualification);
					srid = srmTicket.getSRMID();
				
					%>SUCCESSFUL SRM:RequestInterface_Create Retrieve: <%=srid%><br>Incident: <%=incidentNumber%><br>SRID: <%=srid%><%
				
				}
				catch (Exception e) {
				%>
					FAILED to retrieve HPD:Help Desk record for incident number: <%=incidentNumber%><br>(<%=e.getCause()%>)
				<%
				}
			} catch (Exception e){
			logger.error("Exception in createIncident.jsp", e);
			%>
				FAILED to retrieve HPD:IncidentInterface_Create record for entryID: <%=iicEntryID%><br>(<%=e.getCause()%>)
			<%
			}
		} catch (Exception e){
			logger.error("Exception in createIncident.jsp", e);
%>
			FAILED to create HPD:IncidentInterface_Create record: (<%=e.getCause()%>)
<%
		}
	} else {
%>
		FAILED: No requested for user id provided.
<%
	}
%>
