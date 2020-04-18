'use strict';

// IMPORTING DATA
const dummy_game = require('./data/dummy-game.json');
const dummy_ot_game = require('./data/dummy-ot-game.json');
const dummy_so_game = require('./data/dummy-so-game.json');

const rq = jest.genMockFromModule('request-promise-native');

// This is a custom function that our tests can use during setup to specify
// what the files on the "mock" filesystem should look like when any of the
// `fs` APIs are used.
let mockFiles = Object.create(null);
function __setMockFiles() {
    mockFiles = Object.create(null);
    mockFiles.games = {
    regular: { ...dummy_game },
        ot: { ...dummy_ot_game },
        so: { ...dummy_so_game }
    };
}

// A custom version of `readdirSync` that reads from the special mocked out
// file list set via __setMockFiles
function get(url) {
    if (url.includes('https://statsapi.web.nhl.com/api/v1/teams/')) {
        const teamID = url.replace('https://statsapi.web.nhl.com/api/v1/teams/', '');
        return mockFiles.teams[teamID] || [];
    }
    return [];
}

rq.__setMockFiles = __setMockFiles;
rq.get = get;

module.exports = rq;