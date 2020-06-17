import 'mocha';
import { expect } from 'chai';
import { fetchNHLSchedule, getSeasonStanding } from './fetch';

describe.only('Fetch/main', () => {
    describe('Getting schedule', () => {
        it('should get full schedule for current season (not provided)', async () => {
            const schedule = await fetchNHLSchedule();
            console.log(schedule);
        });
        it('should get full schedule for a given season', async () => {
            const schedule = await fetchNHLSchedule('20172018');
            console.log(schedule);
        });
    });
    describe('Getting API standings', () => {
        it('should get full standings for current season (not provided)', async () => {
            const standings = await getSeasonStanding()
            console.log(standings);
        });
        it('should get full standings for a given season', async () => {
            const standings = await getSeasonStanding('20172018')
            console.log(standings);
        });
    });
});