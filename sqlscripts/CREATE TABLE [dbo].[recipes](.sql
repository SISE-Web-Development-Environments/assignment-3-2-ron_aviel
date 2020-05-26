CREATE TABLE [dbo].[recipes](
	[recipe_id] [UNIQUEIDENTIFIER] Primary key NOT NULL default NEWID(),
	[user_id] [UNIQUEIDENTIFIER] FOREIGN KEY REFERENCES users(user_id) NOT NULL,
	[photo] [varchar](300) ,
	[recipe_name] [varchar](300) ,
	[cooking_time] [integer],
	[vegan] [integer],
	[glutten_free] [integer],
	[popularity] [integer],
	[meals_number] [integer]
)

