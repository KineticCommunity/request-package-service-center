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
    Category currentCategory = catalog.getCategoryByName(request.getParameter("category"));
    // Get map of description templates
    Map<String, String> templateDescriptions = new java.util.HashMap<String, String>();
    Map<String, String> categoryDescriptions = new java.util.HashMap<String, String>();
    if (currentCategory != null) {
        templateDescriptions = DescriptionHelper.getTemplateDescriptionMap(context, catalog);
    }
%>
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <title>
            <%= bundle.getProperty("companyName")%>
            |
            <% if(currentCategory != null) {%>
                <%= currentCategory.getName()%>
            <% }%>
        </title>
        <%-- Include the common content. --%>

        <!-- Page Stylesheets -->
        <link rel="stylesheet" href="<%= bundle.packagePath()%>resources/css/category.css" type="text/css" />
        <!-- Page Javascript -->
        <script type="text/javascript" src="<%=bundle.packagePath()%>resources/js/category.js"></script>
    </head>
    <body>
        <%@include file="../../common/interface/fragments/header.jspf"%>
        <header class="container">
            <div class="shifted">
                <h2>
                    <% if(currentCategory != null) {%>
                        <%= currentCategory.getName()%>
                    <% }%>
                </h2>
                <hr class="soften">
            </div>
        </header>
        <section class="container">
            <% if(currentCategory != null) {%>
                <ul class="templates unstyled shifted">
                    <% for (Template template : currentCategory.getTemplates()) {%>
                        <li class="border-bottom clearfix">
                            <div class="image-wrap">
                                <% if (template.getTemplateAttributeValues("ServiceItemImage").length == 1) { %>
                                <img width="48px" src="<%= bundle.bundlePath()+"../../surveys/"+customerRequest.getTemplateId()+"/"+template.getTemplateAttributeValues("ServiceItemImage")[0] %>" />
                                <% }%>
                            </div>
                            <div class="content-wrap">
                                <h3>
                                    <%= template.getName()%>
                                </h3>
                                <nav>
                                    <% if (templateDescriptions.get(template.getId()) != null ) { %>
                                        <a class="" href="<%= bundle.applicationPath()%>DisplayPage?srv=<%= templateDescriptions.get(template.getId()) %>&category=<%= URLEncoder.encode(currentCategory.getFullName(), "ISO-8859-1")%>">
                                            <i class="icon-info-sign"></i>More Information
                                        </a>
                                        &nbsp;&nbsp;
                                    <% }%>
                                    <a class="" href="<%= template.getAnonymousUrl() %>&category=<%= URLEncoder.encode(currentCategory.getFullName(), "ISO-8859-1")%>">
                                        <i class="icon-share-alt"></i>Create Request
                                    </a>
                                </nav>
                                <div class="description">
                                    <%= template.getDescription()%>                                              
                                </div>
                            </div>
                        </li>
                    <%}%>
                </ul>
            <% }%>
        </section>
        <%@include file="../../common/interface/fragments/footer.jspf"%>
    </body>
</html>