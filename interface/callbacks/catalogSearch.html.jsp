<%-- Set the page content type, ensuring that UTF-8 is used. --%>
<%@page contentType="text/html; charset=UTF-8"%>

<%-- Include the bundle initialization file. --%>
<%@include file="../../framework/includes/packageInitialization.jspf"%>

<%-- 
    Include the CatalogSearch fragment that defines the CatalogSearch class that
    will be used to retrieve and filter the catalog data.
--%>
<%@include file="../../framework/helpers/CatalogSearch.jspf"%>

<%
    if (context == null) {
        ResponseHelper.sendUnauthorizedResponse(response);
    } else {
    /*
     * Clear the output stream to remove any newlines inserted before and after
     * the initialization comments.
     */
    out.clearBuffer();

    /*
     * The following code accepts the HTTP parameter "query", breaks it into
     * querySegments (by splitting on the space character), and replaces
     */
    String catalogName = request.getParameter("catalogName");

    // Build the array of querySegments (query string separated by a space)
    String[] querySegments = request.getParameter("q").split(" ");

    // Display an error message if there are 0 querySegments or > 10 querySegments
    if (querySegments.length == 0 || querySegments[0].length() == 0) {
        out.println("<div class=\"message alert alert-error\"><a class=\"close\" data-dismiss=\"alert\">x</a> Please enter a search term.</div>");
    } else if (querySegments.length > 10) {
        out.println("<div class=\"message alert alert-error\"><a class=\"close\" data-dismiss=\"alert\">x</a> Search is limited to 10 search terms.</div>");
    } else {
        // Retrieve the searchableAttribute property
        String searchableAttributeString = bundle.getProperty("searchableAttributes");
        // Default the searchableAttribute property to "Keyword" if it wasn't specified
        if (searchableAttributeString == null) {searchableAttributeString = "Keyword";}
        // Initialize the searchable attributes array
        String[] searchableAttributes = new String[0];
        // If the searchableAttributeString is not empty
        if (!searchableAttributeString.equals("")) {
            searchableAttributes = searchableAttributeString.split("\\s*,\\s*");
        }
        CatalogSearch catalogSearch = new CatalogSearch(context, catalogName, querySegments);
        //Category[] matchingCategories = catalogSearch.getMatchingCategories();
        Template[] matchingTemplates = catalogSearch.getMatchingTemplates(searchableAttributes);
        Pattern combinedPattern = catalogSearch.getCombinedPattern();
        if (matchingTemplates.length == 0) {
            out.println("<div class=\"message alert alert-error\"><a class=\"close\" data-dismiss=\"alert\">x</a>No results were found.</div>");
        } else {
%>
<div id="notifyResultsValue" style="display: none"><a href="">[<%= matchingTemplates.length %>&nbsp;"<%=request.getParameter("q")%>" Result(s)]</a></div>
<div id="allResults">
<% for (int i = 0; i < matchingTemplates.length; i++) {%>
<div class="template border rounded">
    <!--div class="name">
        <%= CatalogSearch.replaceAll(combinedPattern, matchingTemplates[i].getName())%>
    </div-->
    <div class="description">
        <%= matchingTemplates[i].getDescription() %>
    </div>
    <a class="templateButton" href="DisplayPage?srv=<%= matchingTemplates[i].getId()%>">Request</a>
    <div class="clearfix"></div>
</div>
<% }%>
</div>
<%
    }
}
    }
%>