CREATE TABLE [dbo].[meals](
    [meal_id] [UNIQUEIDENTIFIER] NOT NULL default NEWID(),
    [user_id] [varchar](100),
    [meal_array] [varchar](8000)
)