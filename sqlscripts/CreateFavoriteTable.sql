CREATE TABLE [dbo].[favorite](
[favorite_id] [UNIQUEIDENTIFIER] Primary key NOT NULL default NEWID(),
[user_id] [UNIQUEIDENTIFIER] FOREIGN KEY REFERENCES users(user_id) NOT NULL,
[recipe_id] [UNIQUEIDENTIFIER] FOREIGN KEY REFERENCES recipes(recipe_id) NOT NULL,
)