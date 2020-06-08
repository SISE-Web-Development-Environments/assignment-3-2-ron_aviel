CREATE TABLE [dbo].[personalRecipes](
	[recipe_id] [UNIQUEIDENTIFIER] Primary key NOT NULL default NEWID(),
	[photo] [varchar](300) ,
	[recipe_name] [varchar](300) ,
	[ingredients] [varchar](8000) ,
	[instructions] [varchar](8000),
	[user_id] [varchar](100)
)

