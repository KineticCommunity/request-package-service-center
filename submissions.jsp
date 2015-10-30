<%-- Set the page content type, ensuring that UTF-8 is used. --%>
<%@page contentType="text/html; charset=UTF-8"%>

<%-- Include the package initialization file. --%>
<%@include file="framework/includes/packageInitialization.jspf"%>

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
            <%= bundle.getProperty("companyName")%>&nbsp;My Requests
        </title>
        <%-- Include the common content. --%>

        <!-- Page Stylesheets -->
        <link rel="stylesheet" href="<%= bundle.packagePath()%>resources/css/submissions.css" type="text/css" />
        <!-- Page Javascript -->
        <script type="text/javascript" src="<%=bundle.packagePath()%>resources/js/jquery.dataTables.js"></script>
        <script type="text/javascript" src="<%=bundle.packagePath()%>resources/js/ArsUrl.js"></script>
        <script type="text/javascript" src="<%=bundle.packagePath()%>resources/js/submissions.js"></script>
    </head>
    <body>
        <%@include file="../../common/interface/fragments/header.jspf"%>
        <div class="container containerBorderBottom">
            <%-- BREADCRUMBS VIEW --%>
            <ul id="catalogBreadCrumbs">
                <li class="breadCrumb">
                    <a href="<%= bundle.getProperty("catalogUrl")%>">
                        Catalog
                    </a>
                </li>
                <li class="breadCrumb arrow"> 
                    >
                </li>
            </ul>
            <%-- LOADER --%>
            <div id="loader">
                <img alt="Please Wait." src="<%=bundle.bundlePath()%>common/resources/images/spinner.gif" />
                <br />
                Loading Results
            </div>
            <%-- SUBMISSIONS VIEW --%>
            <div id="submissionsTable" class="hidden">
                <table class="tableContainer hidden" id="tableContainerRequestsOpen"></table>
                <table class="tableContainer hidden" id="tableContainerRequestsClosed"></table>
                <table class="tableContainer hidden" id="tableContainerRequestsParked"></table>
                <table class="tableContainer hidden" id="tableContainerApprovalsPending"></table>
                <table class="tableContainer hidden" id="tableContainerApprovalsCompleted"></table>
            </div>
        </div>
        <%@include file="../../common/interface/fragments/footer.jspf"%>
    </body>
</html>
