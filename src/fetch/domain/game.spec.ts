import 'mocha';
import { expect } from 'chai';

import { Game } from './game';

describe('Game', () => {
    it('Creating Valid Regulation Game', () => {
        const dummyGameData = require("../../../.test/unit/data/dummy-game.json");
        const game: Game = new Game(dummyGameData);
        expect(game._id).to.equal('2019020001');
        expect(game.winnerId).to.equal('10');
        expect(game.loserId).to.equal('9');
        expect(game.winType).to.equal('REGULATION');
        expect(game.getPoint('10')).to.equal(3);
        expect(game.getPoint('9')).to.equal(0);
    });

    it('Creating Valid Overtime Game', () => {
        const dummyGameData = require("../../../.test/unit/data/dummy-ot-game.json");
        const game = new Game(dummyGameData);
        expect(game.winnerId).to.equal('15');
        expect(game.loserId).to.equal('19');
        expect(game.winType).to.equal('OVERTIME');
        expect(game.getPoint('15')).to.equal(2);
        expect(game.getPoint('19')).to.equal(1);
    });

    it('Creating Valid Shootout Game', () => {
        const dummyGameData = require("../../../.test/unit/data/dummy-so-game.json");
        const game = new Game(dummyGameData);
        expect(game.winType).to.equal('SHOOTOUT');
        expect(game.winnerId).to.equal('12');
        expect(game.loserId).to.equal('8');
        expect(game.getPoint('12')).to.equal(2);
        expect(game.getPoint('8')).to.equal(1);
    });
});
