<%-- Set the page content type, ensuring that UTF-8 is used. --%>
<%@page contentType="text/html; charset=UTF-8"%>

<%-- Include the package initialization file. --%>
<%@include file="framework/includes/packageInitialization.jspf"%>

<%-- 
    Include the CatalogSearch fragment that defines the CatalogSearch class that
    will be used to retrieve and filter the catalog data.
--%>
<%@include file="framework/helpers/CatalogSearch.jspf"%>

<%-- Retrieve the Catalog --%>
<%
    // Retrieve the main catalog object
    Catalog catalog = Catalog.findByName(context, customerRequest.getCatalogName());
    // Preload the catalog child objects (such as Categories, Templates, etc) so
    // that they are available.  Preloading all of the related objects at once
    // is more efficient than loading them individually.
    catalog.preload(context);

    // Get map of description templates
    Map<String, String> templateDescriptions = DescriptionHelper.getTemplateDescriptionMap(context, catalog);

    // Define variables
    String[] querySegments;
    String responseMessage = null;
    List<Template> templates = new ArrayList();
    Template[] matchingTemplates = templates.toArray(new Template[templates.size()]);
    Pattern combinedPattern = Pattern.compile("");
    // Retrieve the searchableAttribute property
    String searchableAttributeString = bundle.getProperty("searchableAttributes");
    // Initialize the searchable attributes array
    String[] searchableAttributes = new String[0];
    if(request.getParameter("q") != null) {
        // Build the array of querySegments (query string separated by a space)
        querySegments = request.getParameter("q").split(" ");
        // Display an error message if there are 0 querySegments or > 10 querySegments
        if (querySegments.length == 0 || querySegments[0].length() == 0) {
            responseMessage = "Please enter a search term.";
        } else if (querySegments.length > 10) {
            responseMessage = "Search is limited to 10 search terms.";
        } else {
            // Default the searchableAttribute property to "Keyword" if it wasn't specified
            if (searchableAttributeString == null) {searchableAttributeString = "Keyword";}
            // If the searchableAttributeString is not empty
            if (!searchableAttributeString.equals("")) {
                searchableAttributes = searchableAttributeString.split("\\s*,\\s*");
            }
            CatalogSearch catalogSearch = new CatalogSearch(context, catalog.getName(), querySegments);
            //Category[] matchingCategories = catalogSearch.getMatchingCategories();
            matchingTemplates = catalogSearch.getMatchingTemplates(searchableAttributes);
            combinedPattern = catalogSearch.getCombinedPattern();
            if (matchingTemplates.length == 0) {
                responseMessage = "No results were found.";
            }
        }
    } else {
        responseMessage = "Please Start Your Search";
    }
%>

<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <title>
            <%= bundle.getProperty("companyName") + " Search" %>
        </title>
        <%-- Include the common content. --%>

        <!-- Page Stylesheets -->
        <link rel="stylesheet" href="<%= bundle.packagePath()%>resources/css/search.css" type="text/css" />
    </head>
    <body>
        <%@include file="../../common/interface/fragments/header.jspf"%>
        <% if(responseMessage != null) {%>
            <header class="container">
                <div class="shifted">
                    <h2>
                        <%= responseMessage %>
                    </h2>
                    <hr class="soften">
                </div>
            </header>
        <% } else {%>
            <header class="container">
                <div class="shifted">
                    <h2>
                        Results found for '<%= request.getParameter("q")%>'.
                    </h2>
                    <hr class="soften">
                </div>
            </header>
            <section class="container">
                    <ul class="templates unstyled shifted">
                        <% for (int i = 0; i < matchingTemplates.length; i++) {%>
                            <% if (matchingTemplates[i].getTemplateAttributeValues("DefaultCategory").length > 0) { %>
                                <li class="border-bottom clearfix">
                                    <div class="image-wrap">
                                        <% if (matchingTemplates[i].getTemplateAttributeValues("ServiceItemImage").length == 1) { %>
                                        <img width="48px" src="<%= bundle.bundlePath()+"../../surveys/KS68f7c1743911b26387d61f4382256628f/"+matchingTemplates[i].getTemplateAttributeValues("ServiceItemImage")[0] %>" />
                                        <% }%>
                                    </div>
                                    <div class="content-wrap">
                                        <h3>
                                            <%= matchingTemplates[i].getName()%>
                                        </h3>
                                        <nav>
                                            <% if (templateDescriptions.get(matchingTemplates[i].getId()) != null ) { %>
                                                <a href="<%= bundle.applicationPath()%>DisplayPage?srv=<%= templateDescriptions.get(matchingTemplates[i].getId()) %>">
                                                    <i class="icon-info-sign"></i>More Information
                                                </a>
                                                &nbsp;&nbsp;
                                            <% }%>
                                            <a href="<%= matchingTemplates[i].getAnonymousUrl()%>">
                                                <i class="icon-share-alt"></i>Create Request
                                            </a>
                                        </nav>
                                        <div class="description">
                                            <%= CatalogSearch.replaceAll(combinedPattern, matchingTemplates[i].getDescription())%>
                                        </div>
                                        <div class="attributes">
                                            <% for (String attributeName : searchableAttributes) {%>
                                            <div class="attribute">
                                                <div class="attributeName"><%= attributeName %></div>
                                                <div class="attributeValues">
                                                    <% for (String attributeValue : matchingTemplates[i].getTemplateAttributeValues(attributeName)) {%>
                                                    <div class="attributeValue borderRight"><%= CatalogSearch.replaceAll(combinedPattern, attributeValue)%></div>
                                                    <% }%>
                                                    <div class="clearfix"></div>
                                                </div>
                                            </div>
                                            <% }%>
                                        </div>
                                    </div>
                                </li>
                            <% }%>
                        <% }%>
                    </ul>
                <% }%>
        </section>
        <%@include file="../../common/interface/fragments/footer.jspf"%>
    </body>
</html>