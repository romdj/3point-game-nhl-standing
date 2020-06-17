import 'mocha';
import { expect } from 'chai';
import { fetchNHLSchedule } from './fetch';

describe.only('Fetch/main', () => {
    it('should get full schedule for something', () => {
        console.log(fetchNHLSchedule());
    });
});