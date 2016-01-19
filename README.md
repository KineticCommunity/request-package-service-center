## Overview

This bundle was built to give clients the ability of subscribing their users to different services.

## Function

The purpose of this application is to expedite the rate in which clients can find, manage, and register users to various services.

the "Who" field finds users that match the submitted criteria, a search is preformed by either clicking the "Go" button, or hitting the space bar after entering a search term.

clients may then select a user from the appended table and use the "What" field to search for any applicable services.

upon clicking the request button on a service item the empty fields meant for user information should be autofilled if the forms are properly set up.

This bundle is presently set up to provide sample information during in the event a callback function returns a null value. sample information can be found at catalog.js in the "retrieveData" function. this functionality must be removed prior to shipping to a client.

## SubForm/ Service Setup

to autofill user information in a service item form, the following script must be declared as a custom load event on the form page.
in the text box marked "Code", copy and paste the following:

K('field[*field name*]').value(userData['*attribute*']);

replace *attribute* with the name of the userData attribute you wish to draw data from
replace *field name* with the name of the field where you want the information filled

## Bridge Connections

The User Bridge model must include the following attributes ['First Name', 'Last Name', 'Department', 'Email', 'City', 'State', 'Street', 'User ID', 'Zip', 'Phone Number']

This model must also have the following qualifications:
qualifications        Result Type	       Parameters

  By Search             Multiple           keyword
  By User ID            Single             User ID

The 'By Search' qualification should search through the mapped fields of several attributes to yield the greatest number of possible results.
In the ServiceCenter form, the User Bridge should be named "UserSearch"

----------------------

The Requests Bridge model must include the following attributes ['Closed Date', 'Request Number', 'Status', 'Submit Date', 'Summary']

This model must also have the following qualification information:
qualifications                    Result Type	           Parameters

Requested By or Requested For       Single                 Login ID

In the ServiceCenter form, the Requests Bridge should be named "RequestsBridge"

----------------------

The People Bridge model must include the following attributes ['Address', 'Corporate ID', 'Department',  'Organization', 'Site', 'Site Group', 'First Name', 'Last Name', 'Full Name', 'Region', 'Email', 'Login ID', 'Phone']

This model must also have the following qualifications
qualifications     Result Type	     Parameters

By Login ID          Single           Login ID

In the ServiceCenter form, the People Bridge should be named "PeopleInfoBridge"

## Customization
When you customize this bundle it is a good idea to fork it on your own git server to track your customizations and merge in any code changes we make to the default.
