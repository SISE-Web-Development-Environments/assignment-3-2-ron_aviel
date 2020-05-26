CREATE TABLE [dbo].[lastseen](
[seen_id] [integer] Primary key NOT NULL default NEWID(),
[user_id] [integer] FOREIGN KEY REFERENCES users(user_id) NOT NULL,
[recipe_id1] [integer],
[recipe_id2] [integer],
[recipe_id3] [integer]
)