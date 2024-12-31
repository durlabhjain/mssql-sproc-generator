CREATE PROCEDURE [dbo].[update<%= tableName %>]
<% columns.forEach((col, index) => { %>
    @<%= col.name %> <%= col.type %><%= (index < columns.length - 1) ? ',' : '' %>
<% }) %>
AS
BEGIN
    UPDATE [dbo].[<%= tableName %>]
    SET
    <% columns.forEach((col, index) => { %><%= col.name %> = @<%= col.name %><%= (index < columns.length - 1) ? ',' : '' %><% }) %>
    WHERE Id = @Id;
END;