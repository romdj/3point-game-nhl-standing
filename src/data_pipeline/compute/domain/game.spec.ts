import {describe, expect, it} from '@jest/globals';
import dummyGameData from "../../../../.test/unit/data/dummy-game.json";
import dummyOtGameData from "../../../../.test/unit/data/dummy-ot-game.json";
import dummySoGameData from "../../../../.test/unit/data/dummy-so-game.json";
import { NhlGame } from '../model/NhlGame';

import { Game } from './game';

describe('Game', () => {
    it('Creating Valid Regulation Game', () => {
        const game: Game = new Game(dummyGameData);
        expect(game._id).toEqual('2019020001');
        expect(game.winnerId).toEqual('10');
        expect(game.loserId).toEqual('9');
        expect(game.winType).toEqual('REGULATION');
        expect(game.getPoint('10')).toEqual(3);
        expect(game.getPoint('9')).toEqual(0);
    });

    it('Creating Valid Overtime Game', () => {
        const game = new Game(dummyOtGameData);
        expect(game.winnerId).toEqual('15');
        expect(game.loserId).toEqual('19');
        expect(game.winType).toEqual('OVERTIME');
        expect(game.getPoint('15')).toEqual(2);
        expect(game.getPoint('19')).toEqual(1);
    });

    it('Creating Valid Shootout Game', () => {
        const game = new Game(dummySoGameData);
        expect(game.winType).toEqual('SHOOTOUT');
        expect(game.winnerId).toEqual('12');
        expect(game.loserId).toEqual('8');
        expect(game.getPoint('12')).toEqual(2);
        expect(game.getPoint('8')).toEqual(1);
    });
});
