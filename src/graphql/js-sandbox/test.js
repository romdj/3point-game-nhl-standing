const { RESTDataSource } = require('@apollo/datasource-rest');

class NHLAPI extends RESTDataSource {
 baseURL = "https://api-web.nhle.com/v1";

  async getScheduleFrom(dateFrom) {
    const response = await this.get(`${this.baseURL}/schedule/${dateFrom}`);
    return response.gameWeek;
  }

  async getScheduleDay(dateDay) {
    const gameDaysCollection = await this.getScheduleFrom(dateDay);
    return gameDaysCollection
      .filter(gameDay => gameDay.date === dateDay)
      .map(gameDay=> gameDay.games)
  }
}

(async () => {
  const nhlApi = new NHLAPI();
  const dateFrom = await nhlApi.getScheduleFrom("2023-11-26");
  const gamesOn = await nhlApi.getScheduleDay("2023-11-26");
  console.log(`dateFrom: ${JSON.stringify(dateFrom)}`);
  console.log(`gamesOn: ${JSON.stringify(gamesOn)}`);
})();
