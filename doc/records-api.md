# NHL Records API Documentation
---

This is a compiled list of the endpoints on the NHL Records API, it by no means is 
exhaustive so please feel free to contribute with a PR if you find something I missed 
or otherwise mis-typed.  All of this is discovered by working through https://records.nhl.com/static/js/client.bundle.js and finding where the script pulls 
information from.

All queries are prefixed with `https://records.nhl.com/site/api` and are GET
requests unless otherwise noted, so far I have not seen any thing other than GET requests.

**Filtering**

This is slightly different than the normal NHL API, see the following example:

`https://records.nhl.com/site/api/draft?cayenneExp=draftYear=2017%20and%20draftedByTeamId=15`

The %20 value translates to a space, this needs to be taken into account as removing the spaces
will break the query, so anything after cayenneExp can have spaces when separating two
or more conditions.

Often you can filter by information returned in an unfiltered query so using 
the draft example you can append `roundNumber=4` onto the cayenneExp to only look at 4th 
round selections.

---

### Attendance

`/attendance` Returns all
season attendance records separated into playoffAttendance and
 regularAttendance

### Draft

`/draft` Returns ALOT of
draft data, looks to be every pick ever

**Filtering**

`?cayenneExp=draftYear=2017` This filters by a single year, much more manageable.

`draftedByTeamId=ID` drilldown to a specific teams drafting

### Records

`/record-detail` Looks to be all
records along with the restUrl to fetch the data

`/site/api/all-time-record-vs-franchise?cayenneExp=teamFranchiseId=ID` Returns franchise
records against every other team in the league.

`/site/api/playoff-franchise-vs-franchise?cayenneExp=teamFranchiseId=ID` Just like the prior
endpoint but for playoff specific records.

**Modifiers**

`?cayenneExp=gameTypeId=2` filters by gameTypeId (2 = regularSeason, 3 = playoffs)

### Franchise

`/franchise` Returns id, firstSeasonId
and lastSeasonId and name of every team in the history of the nhl

`/franchise-team-totals` Total stats
for every franchise (ex roadTies, roadWins, etc)

`/site/api/franchise-season-records?cayenneExp=franchiseId=ID` Drill-down into season records for a specific franchise

`/franchise-season-results?cayenneExp=franchiseId=24&sort=seasonId&dir=DESC` Returns every season result for a specified team, sorted by seasonId in descending order

`/franchise-goalie-records?cayenneExp=franchiseId=ID` Goalie records for the specified franchise

`/franchise-skater-records?cayenneExp=franchiseId=ID` Skater records, same interaction as goalie endpoint

`/site/api/franchise-detail?cayenneExp=mostRecentTeamId=ID` Returns captainHistory, coachingHistory, generalManagerHistory and a summary of retired numbers

`/site/api/franchise?include=teams.id&include=teams.active&include=teams.triCode&include=teams.placeName&include=teams.commonName&include=teams.fullName&include=teams.logos&include=teams.conference.name&include=teams.division.name&include=teams.franchiseTeam.firstSeason.id&include=teams.franchiseTeam.lastSeason.id&include=teams.franchiseTeam.teamCommonName` Returns every logo for every team and franchise.

### Player

`/player/byTeam/teamId` Returns all players for the specified teamId

### Playoffs

`/playoff-series?cayenneExp=seriesTitle="Stanley Cup Final" and seasonId=20172018` Returns gamedata for each game during the specified playoff round

posible values for seriesTitle include: Stanley Cup Final, Conference Finals, Conference Semifinals, Conference Quarterfinals

### Trophy

`/trophy` Summary of all trophies awarded within the NHL including a description and image link.

### Milestones

These endpoints show the players who meet the rather self-explanatory criteria

`/milestone-1000-point-career`

`/milestone-500-goal-career`

`/milestone-100-point-season`

`/milestone-50-goal-season`

`/milestone-5-goal-game`

### Officials

`/officials` By default returns all officials including those who are no longer active

**Modifiers**

`cayenneExp=active=true` This only shows active officials


