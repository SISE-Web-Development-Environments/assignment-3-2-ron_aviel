CREATE TABLE [dbo].[recipes_in_making](
[recipe_in_making_id] [UNIQUEIDENTIFIER] Primary key NOT NULL default NEWID(),
[user_id] [UNIQUEIDENTIFIER] FOREIGN KEY REFERENCES users(user_id) NOT NULL,
[recipe_id] [UNIQUEIDENTIFIER] FOREIGN KEY REFERENCES recipes(recipe_id) NOT NULL,
[progression][integer],
[index_in_meal][integer]
)