CREATE PROCEDURE [dbo].[add<%= tableName %>]
<% columns.forEach((col, index) => { -%>
    @<%= col.name %> <%= col.type %>
<% }) -%>
    @NewId INT OUTPUT
AS
BEGIN
    INSERT INTO [dbo].[<%= tableName %>] (
        <% columns.forEach((col, index) => { %><%= col.name %><%= (index < columns.length - 1) ? ',' : '' %><% }) %>
    )
    VALUES (
        <% columns.forEach((col, index) => { %>@<%= col.name %><%= (index < columns.length - 1) ? ',' : '' %><% }) %>
    );

    SET @NewId = SCOPE_IDENTITY();
END;