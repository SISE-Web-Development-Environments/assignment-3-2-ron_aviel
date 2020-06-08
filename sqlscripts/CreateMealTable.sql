CREATE TABLE [dbo].[meals](
    [meal_id] [UNIQUEIDENTIFIER] NOT NULL default NEWID(),
    [user_id] [varchar](200),
    [meal_array] [varchar](8000)
)