#Usage:
The bot responds to messages starting with @mentions to it, or with the command prefix assigned to it for the server.

##Commands:
`setCommandPrefix [prefix]`  
This will set the command prefix for the server to the prefix supplied. It defaults to !, but ! is the standard prefix used so to prevent conflicts you can always @mention the bot  
For example `@RenownBot setCommandPrefix !`  
**This command requires permissions on the server initially reserved for the server owner. Anyone who has been authorised or is a member of an authorised role can also perform it.**

`authUsers [@user1] [@user2]`  
This will grant the users @mentioned permissions to configure the bot on this server  
For example: `!authUsers @Bjorn`  
**This command requires permissions on the server initially reserved for the server owner. Anyone who has been authorised or is a member of an authorised role can also perform it.**

`authRoles [roleName1] [roleName2]...`  
This will grant the roles listed permissions to configure the bot on the server  
For example: `!authRoles StoryTeller Coordinator`  
**This command requires permissions on the server initially reserved for the server owner. Anyone who has been authorised or is a member of an authorised role can also perform it.**

`readRemoteFile [file location]`  
This will set the location of the CSV file to read for the Renown details. The renown details need to be in a CSV format where the first row is the titles (and accordingly is ignored) and the columns of membership number, Cunning, Glory, Honor, Purity, Wisdom. The format is not forgiving.  
For example: `!readRemoteFile https://pastebin.com/raw/f56nkrpr`  
**This command requires permissions on the server initially reserved for the server owner. Anyone who has been authorised or is a member of an authorised role can also perform it.**

`readLocalFile`  
This file is a special case. If you drag a csv file onto discord and send with the file the message !readLocalFile, the bot will read the renown from the file instead.  
**This command requires permissions on the server initially reserved for the server owner. Anyone who has been authorised or is a member of an authorised role can also perform it.**

Note: Renown is not removed from the bot when a new file is read. To remove a renown entry, the deleteRenown command is required

`deleteRenown [membership number]`  
Deletes the renown for that membership number  
**This command requires permissions on the server initially reserved for the server owner. Anyone who has been authorised or is a member of an authorised role can also perform it.**


`register [membership number]`  
This will tell the bot what the mebership number is for the user who invokes it.

`renownCeck [@user1] [@user2]`  
This will perform a check and if the user has registered their membership number with the bot and if their membership numer has a record in the file at the setFileLocation CSV file, the bot will respond with the listed users' renowns.