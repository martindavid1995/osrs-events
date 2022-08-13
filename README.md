[Live Project](https://osrs-events.web.app/)
#### DELIVERABLE
A hosted web-application (osrs-events) that allows for the following functionality:

##### MAIN SYSTEM
- User authentication
- Ability for users to create groups
- Admin privelages for group creators
- Ability for users to apply to join groups, and for group admins to approve invitations
- Ability for a group admin to invite/challenge another group to an event type (Bingo), as well as accept pending challenges
- Once challenge is accepted, whatever game is being played goes into "pregame" phase

##### BINGO
###### PREGAME
- System for each group admin in charge of the game to create and agree upon bingo board setup
###### BOARD SETUP
	- Each tile in the board represents a tradeable item in game
	- Database containing a limited set of items (to be expanded to every item in game in future versions) for game creators to choose from and position into tile locations
	- (Preferred but optional for V1) Ideally, an item-icon will sit in the game square to represent what is needed to satisfy that tile instead of just text
	- Once board is agreed upon, admins agree to start the game, game goes into running phase
###### RUNNING
	- A game dashboard page presents information on the current gamestate to each team, viewable for every player
	- Players who are enrolled in the game may click on a tile to claim they have completed it - this brings up a window to support evidence (an attached image)
	- The evidence is sent to the game administrator, who can approve or deny the evidence
	- Once a claim is approved, game tile is set to marked
	- First team to five in a row wins

