CREATE TABLE [dbo].[users](
	[user_id] [UNIQUEIDENTIFIER] Primary key default NEWID(),
	[username] [varchar](30) NOT NULL UNIQUE,
	[firstname] [varchar](30) ,
	[lastname] [varchar](30) ,
	[country] [varchar](30) ,
	[password] [varchar](300) NOT NULL,
	[email] [varchar](80) ,
	[photoLink] [varchar](1000) ,
	[favorites][varchar](8000),
	[lastseen][varchar](8000),
	
	
	[last_search][varchar](8000),

)

