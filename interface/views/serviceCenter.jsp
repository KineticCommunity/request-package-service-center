<%-- Include the package initialization file. --%>
<%@include file="../../framework/includes/packageInitialization.jspf"%>
<%@include file="../../../../core/interface/fragments/applicationHeadContent.jspf"%>

<%-- Retrieve the Catalog --%>
<%
    // Retrieve the main catalog object
    Catalog catalog = Catalog.findByName(context, customerRequest.getCatalogName());
    // Preload the catalog child objects (such as Categories, Templates, etc) so
    // that they are available.  Preloading all of the related objects at once
    // is more efficient than loading them individually.
    catalog.preload(context);
    %>

<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <title>
            <%= bundle.getProperty("companyName") + " " + bundle.getProperty("catalogName")%>
        </title>
        <%-- Include the application head content. --%>
        <script type="text/javascript">
            KD.utils.ClientManager.templateId = '<%= customerRequest.getTemplateId()%>';
        </script>
        <%-- Include the common content. --%>

        <!-- Page Stylesheets -->
        <link rel="stylesheet" href="<%= bundle.bundlePath()%>packages/serviceCenter/assets/css/serviceCenter.css" type="text/css" />
        <!-- Page Javascript -->
		<script type="text/javascript" src="<%= bundle.bundlePath()%>packages/serviceCenter/assets/js/jquery-typing.min.js"></script>
        <script type="text/javascript" src="<%= bundle.bundlePath()%>packages/serviceCenter/assets/js/catalog.js"></script>
    </head>
    <body>
		<section class="container">
            <section id="search">
                <div style="float: left;">
                    <section class="who">
                        <form id="user-search" class="pretty-search" method="post" action="/">
                            <input type="hidden" name="srv" value="<%= customerRequest.getTemplateId()%>" />
                            <p>
                                <label for="search">
                                    Who
                                </label>
                                <input type="search" name="q" value="" />
                                <!-- span deals with button floating incorrectly next to input in ie 7 fail -->
                                <span>
                                    <input type="submit" value="Go" />
                                </span>
                            </p> 
                        </form>
                    </section>
                    <section class="what">
                        <form id="what-search" class="pretty-search" method="get" action="<%= bundle.bundlePath()%>packages/serviceCenter/interface/callbacks/catalogSearch.html.jsp">
                            <input type="hidden" name="catalogName" value="<%= bundle.getProperty("catalogName") %>" />
                            <p>
                                <label for="search">
                                    What
                                </label>
                                <input type="search" name="q" value="" />
                                <!-- span deals with button floating incorrectly next to input in ie 7 fail -->
                                <span>
                                    <input type="submit" value="Go" />
                                </span>
                            </p>
                        </form>
                        <div id="notifyResults" class="clearfix"></div>
                    </section>
                </div>
            </section>
            <section class="details">
                <div id="details" class="user-account-wrap collapse">
                    <div class="accountPanel userDetails">
                        <h2 id="accountProfile">Account Profile</h2>
                        <div class="panelContent userlocationtop">
                            <p>Customer Location</p>
                            <div id="contact"></div>
                            <p>&nbsp;</p>
                            
                            <input type="button" value="Select this User" class="templateButton" />
                        </div>
                    </div>
                    <div class="accountPanel">
						<h3><i class="fa fa-check"></i> Demographics</h3>
						<div class="panelContent">
							<ul class="unstyled">
								<li><span class="demographic-label">NUID: </span><span id="demographics-nuid" class="demographics-data"></span></li>
								<li><span class="demographic-label">Job Title: </span><span id="demographics-jobtitle" class="demographics-data"></span></li>
								<li><span class="demographic-label">Contact Type: </span><span id="demographics-contacttype" class="demographics-data"></span></li>
							</ul>
						</div>
					</div>
					<div class="accountPanel">
						<h3><i class="fa fa-lock"></i> Authentication Information</h3>
						<div class="panelContent">
							<ul class="unstyled">
								<li><span class="authentication-label">Registered: </span><span id="authentication-registered" class="authentication-data"></span></li>
								<li><span class="authentication-label">Authentication Level: </span><span id="authentication-level" class="authentication-data"></span></li>
								<li><span class="authentication-label">KPIM Status: </span><span id="authentication-kpimstatus" class="authentication-data"></span></li>
							</ul>
						</div>
					</div>
					<div class="accountPanel">
						<h3><i class="fa fa-map-marker rounded"></i> Location</h3>
						<div class="panelContent">
							<ul class="unstyled">
								<li><div class="location-label">Region: </div><div id="location-region" class="location-data"></div></li>
								<li><div class="location-label">Site Group: </div><div id="location-sitegroup" class="location-data"></div></li>
								<li><div class="location-label">Site: </div><div id="location-site" class="location-data"></div></li>
								<li><div class="location-label">Address: </div><div id="location-address" class="location-data"></div></li>
								<li><div class="location-label">Phone Number: </div><div id="location-phone" class="location-data"></div></li>
							</ul>
							<span class="templateButton" onclick="openAddressUpdateForm($('#selectedUserId').text())">Update</span>
						</div>
					</div>
					<div class="accountPanel">
                        <h3><i class="fa fa-inbox rounded"></i> Past Activity</h3>
						<div id="loader_pastactivity">
							<img alt="Please Wait." src="<%=bundle.bundlePath()%>common/assets/images/spinner.gif" />
							&nbsp; Loading Results
						</div>
						<div class="pastactivity-response-message collapse">
						</div>
                        <div id="pastactivity" class="panelContent collapse">
                            <ul class="unstyled">
                            </ul>
                        </div>
                    </div>
					<div class="accountPanel">
                        <h3><i class="fa fa-search rounded"></i> Specified Ticket</h3>
                        <div class="panelContent">
                            <input type="text" id="specifiedTicket" class="answerValue answerText" size="20" maxlength="15" style="background-color:rgb(224,224,224);">
                        </div>
                    </div>
                    <div class="accountPanel">
                        <h3><i class="fa fa-comments rounded"></i> Additional Comments</h3>
                        <div class="panelContent">
							<textarea id="callerdatatext" class="callerdatatext" name="Caller Data" rows="5" cols="52" label="Caller Data"></textarea>
							<div id="callerdatatext-status" class="callerdatastatus">Saved</div>
							<div id="callerdatatext-clear" class="callerdataclear" onclick="clearPersonNoteButton($('#selectedUserId').text())">Clear</div>
                        </div>
                    </div>
                </div>
            </section>
            <section class="results">
                <%-- LOADER --%>
                <div id="loader" class="collapse">
                    <img alt="Please Wait." src="<%=bundle.bundlePath()%>common/assets/images/spinner.gif" />
                    <br />
                    Loading Results
                </div>
                <!-- User Results -->
                <div class="response-message collapse">
                </div>
                <div class="result-wrap collapse">
                    <table id="user-results" summary="User Search Results">
                        <thead>
                            <tr>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>Email</th>
                                <th>City</th>
                                <th>State</th>
								<th>Phone</th>
                            </tr>
                            <tbody></tbody>
                        </thead>
                    </table>
                </div>
                <div class="user-address-wrap collapse">
                    <div class="user-address">
                    </div>
                    <div class="templateButton">
                        Select this User
                    </div>
                </div>
                <!-- Template Results -->
                <div id="template-search-results">
                </div>
            </section>
        </section>
    </body>
</html>
