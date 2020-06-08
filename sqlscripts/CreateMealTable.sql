CREATE TABLE [dbo].[meals](
    [meal_id] [UNIQUEIDENTIFIER] NOT NULL default NEWID(),
    [user_id] [UNIQUEIDENTIFIER] FOREIGN KEY REFERENCES users(user_id) NOT NULL,
    [meal_array] [varchar(8000)]
    
)