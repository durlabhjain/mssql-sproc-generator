CREATE PROCEDURE [dbo].[delete<%= tableName %>]
@Id INT
AS
BEGIN
    DELETE FROM [dbo].[<%= tableName %>] WHERE Id = @Id;
END;