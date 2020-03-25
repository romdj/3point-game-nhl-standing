/** 
 * The first 4 digits identify the season of the game (ie. 2017 for the 2017-2018 season).
 * The next 2 digits give the type of game, where: 
 * 01 = preseason
 * 02 = regular season
 * 03 = playoffs
 * 04 = all-star.
 * 
 * The final 4 digits identify the specific game number.
 * For regular season and preseason games, this ranges from 0001 to the number of games played.
 * (1271 for seasons with 31 teams (2017 and onwards) and 1230 for seasons with 30 teams).
 * 
 * For playoff games, the 2nd digit of the specific number gives the round of the playoffs, the 3rd digit specifies the matchup, and the 4th digit specifies the game (out of 7).

 */
class ScheduleSeasonParser {
    readonly preSeasonGames: Array<Object>;
    readonly regularSeasonGames: any;
    readonly playoffGames: any;
    readonly all_StarGames: any;

    private readonly preseasonRegex = /[0-9]{4}01[0-9]{4}/;
    private readonly regseasonRegex = /[0-9]{4}02[0-9]{4}/;
    private readonly playoffRegex = /[0-9]{4}03[0-9]{4}/;
    private readonly all_starRegex = /[0-9]{4}04[0-9]{4}/;

    constructor(NHLDownstreamGames: any) {
        this.preSeasonGames = NHLDownstreamGames.filter((game: any) => this.preseasonRegex.test(game.gamePk));
        this.regularSeasonGames = NHLDownstreamGames.filter((game: any) => this.regseasonRegex.test(game.gamePk));
        this.playoffGames = NHLDownstreamGames.filter((game: any) => this.playoffRegex.test(game.gamePk));
        this.all_StarGames = NHLDownstreamGames.filter((game: any) => this.all_starRegex.test(game.gamePk));
    }
}
