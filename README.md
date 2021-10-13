

Solution:
Three resources each accesses mongoDB collection.
assumptions:
1) assume there will be schema validation for apis
2) no handling of authorization authentication at this point it will be added
3) assume there will be better error handling, ands logs, including managing the mongo connection disconnection
4) assume Slow background job that deletes stale fields from documents 

1) users - store users with their roles
document example: 
{
     "_id" : “ilanaI”
    "name" : "Ilana Israel",
    "password" : "12345",
    "role" : "Admin"
}
api's:
PUT/POST http://localhost:3000/users/ilanaI
GET http://localhost:3000/users/ilanaI

example
curl --location --request PUT 'http://localhost:3000/users/ilanaI' \
--header 'Content-Type: application/json' \
--data-raw '{
    "name" : "Ilana Israel",
    "password" : "12345",
    "role" : "Admin"
}'

2) roles - store roles

-	Each role has a document, the id of the document is the role.
-	Default permissions for default roles inserted at startup if don't exist.
-	Valid permissions syntax: '-' no accesses 'R' read 'W' write
-	Each role has a document with the permissions defined for each field
for example:
{
    "_id" : "Worker",
    "Assignee" : "W",
    "Description" : "W",
    "ParentId" : "-",
    "Priority" : "-",
    "Resolution" : "-",
    "SLA" : "-",
    "Summary" : "W"
}
When adding a field its inserted to all roles with defult values '-'
only then the permissions can be changed.
when deleting a field its deleted from all roles documents.

apis:
POST http://localhost:3000/roles/:id create new role
PUT http://localhost:3000/roles/:id update a role
GET http://localhost:3000/roles/:id get a role
GET http://localhost:3000/roles/ get all roles - can be used for admin page with all role’s permissions

curl --location --request POST 'http://localhost:3000/roles/SuperAdmin' \
--header 'Content-Type: application/json' \
--data-raw '{
    "Assignee": "W",
    "Description": "W",
    "ParentId": "W",
    "Priority": "W",
    "Resolution": "W",
    "SLA": "W",
    "Summary": "W"
}'

3) tickets - stores tickets
- all tickets are stored with their specific fields
- One document with a default ticket that contains the supported fields and their defaults.
  when adding a field its added to default document
- when removing a field its removed from default document, and assume there is a slow background job to remove the filed from all documents
- on getting a document we merge the default values into the missing values of the ticket. 
  and remove deleted fields (in case the delete job didn't reach this ticket)
- the get ticket api also receives the user Id of the user, and then takes the role of this user and adds the users roles to the ticket , assuming that ui will create page accordingly.
  
  api's:
  GET http://localhost:3000/tickets/123?userId=ilanaI 
  Gets ticket data with the permissions of ticket id 123 userId ilanaI
  DELETE http://localhost:3000/tickets/field/<field Name>
  PUT http://localhost:3000/tickets/field Body: field and its default value in the body
  PUT http://localhost:3000/tickets/123 update a ticket. 
  POST http://localhost:3000/tickets/123 create ticket.
  Regarding update/create ticket. currently no schema and role validation (need to also pass userId for role validation) on update assume it can be added simply and dynamically.
  
example:
default:
{
    "_id" : "defaultTicket",
    "Assignee" : "",
    "Description" : "",
    "ParentId" : "",
    "Priority" : "",
    "Resolution" : "",
    "SLA" : "",
    "Summary" : ""
}
ticket ID 123:
{
    "_id" : "123",
    "Assignee" : "Feigy Haim",
    "Description" : "add backround job",
} 

get results for specific user :
{
"ticket": {
    "_id" : "123",
    "Assignee" : "Feigy Haim",
    "Description" : "add backround job",
    "ParentId" : "",
    "Priority" : "",
    "Resolution" : "",
    "SLA" : "",
    "Summary" : ""
 },
"permissions": {
    "Assignee": "W",
    "Description": "W",
    "ParentId": "W",
    "Priority": "W",
    "Resolution": "W",
    "SLA": "-",
    "Summary": "R"
 }
}
