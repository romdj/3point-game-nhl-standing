const { writeFileSync } = require('fs');
const { RESTDataSource } = require('@apollo/datasource-rest');

class NHLAPI extends RESTDataSource {
  baseURL = 'https://api-web.nhle.com/v1';

  async getScheduleFrom(dateFrom) {
    const response = await this.get(`${this.baseURL}/schedule/${dateFrom}`);
    return response.gameWeek;
  }

  async getScheduleDay(dateDay) {
    const gameDaysCollection = await this.getScheduleFrom(dateDay);
    return gameDaysCollection.filter((gameDay) => gameDay.date === dateDay).map((gameDay) => gameDay.games);
  }

  async getAllNhlStandingsReferences() {
    const response = await this.get(`${this.baseURL}/standings-season`);
    return response;
  }

  async getStandingsForDate(standingsDate) {
    console.log(`querying: ${this.baseURL}/standings/${standingsDate}`);
    const response = await this.get(`${this.baseURL}/standings/${standingsDate}`);
    return response;
  }

  async formatNhlStandings(standings) {
    // const response = await this.get(`${this.baseURL}/v1/standings/${standingsDate}`);
    // return response;
  }
}

(async () => {
  const nhlApi = new NHLAPI();
  // const dateFrom = await nhlApi.getScheduleFrom('2023-11-26');
  // const gamesOn = await nhlApi.getScheduleDay('2023-11-26');
  // console.log(`dateFrom: ${JSON.stringify(dateFrom)}`);
  // console.log(`gamesOn: ${JSON.stringify(gamesOn)}`);
  const nhlStandings = await nhlApi.getStandingsForDate('2023-12-02');
  // console.log(`standings: ${JSON.stringify(await nhlApi.getNhlStandings(), null, 2)}`);
  writeFileSync('standings.json', JSON.stringify(nhlStandings, null, 2), 'utf8');
  // console.log(`standings: ${nhlStandings.}`);
})();
