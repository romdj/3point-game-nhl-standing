import { RESTDataSource, AugmentedRequest } from '@apollo/datasource-rest';

class NHLAPI extends RESTDataSource {
  override baseURL = 'https://api-web.nhle.com/v1/';

  async getScheduleFrom(dateFrom) {
    return this.get(`schedule/${dateFrom}`);
  }

  async getScheduleDay(dateDay) {
    const scheduleCollection = await this.getScheduleFrom(dateDay);
    return scheduleCollection.map(item => {
        return item.gameweek.filter(gameCollection => gameCollection.date === dateDay).games
  });
  }
  // async getMostViewedMovies(limit = 10) {
  //   const data = await this.get('movies', {
  //     params: {
  //       per_page: limit.toString(), // all params entries should be strings
  //       order_by: 'most_viewed',
  //     },
  //   });
  //   return data.results;
  // }
}

(() => async () => {
    const nhlApi = new NHLAPI();
    const dateFrom = await nhlApi.getScheduleFrom('2023-11-26');
    const gamesOn = await nhlApi.getScheduleDay("2023-11-26");
})
