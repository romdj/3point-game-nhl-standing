import { region, accessKeyId, secretAccessKey, tableName } from './config.js';
import { Game, Match } from '../../../compute/domain/game.js';
const dummyGame = require('../../../../.test/unit/data/dummy-game.json');
import { TeamInformation } from '../../../compute/domain/teamInformation.js';

import { DynamoDBClient, PutItemCommand, PutItemCommandInput, BatchWriteItemCommand, BatchWriteItemCommandInput } from "@aws-sdk/client-dynamodb";
const client = new DynamoDBClient({
    region: region,
    credentials: {
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey,
    }
});

export async function storeMatch(gameRecord: Match) {
    console.log('storing data into dynamodb');
    console.log('data to store: ', JSON.stringify(gameRecord));
    const input: PutItemCommandInput = {
        TableName: tableName,
        Item: {
            _id: { "S": gameRecord._id },
            gamePk: { "S": gameRecord._id },
            winnerId: { "S": gameRecord.winnerId },
            loserId: { "S": gameRecord.loserId },
            pointsW: { "N": gameRecord.pointsW.toString() },
            pointsL: { "N": gameRecord.pointsL.toString() },
            winType: { "S": gameRecord.winType },
        },
    }
    const command = new PutItemCommand(input);
    return await client.send(command);
}

// export async function storeMultipleMatches(gameRecord: Array<Match>) {
//     console.log('storing data into dynamodb');
//     console.log('data to store: ', JSON.stringify(gameRecord));
//     const input: BatchWriteItemCommandInput = {
//         RequestItems: {
//             PutRequest: {

            
//         }
//         }
/* 
//         TableName: tableName,
        Item: {
            _id: { "S": gameRecord._id },
            gamePk: { "S": gameRecord._id },
            winnerId: { "S": gameRecord.winnerId },
            loserId: { "S": gameRecord.loserId },
            pointsW: { "N": gameRecord.pointsW.toString() },
            pointsL: { "N": gameRecord.pointsL.toString() },
            winType: { "S": gameRecord.winType },
        }, */
//     }
//     const command = new BatchWriteItemCommand(input);
//     return await client.send(command);
// }


export async function storeTeam(teamInformation: TeamInformation) {
    const input: PutItemCommandInput = {
        TableName: tableName,
        Item: {
            id: { "S": teamInformation.id },
            fullName: { "S": teamInformation.fullName || '' },
            name: { "S": teamInformation.name || '' },
            acronym: { "S": teamInformation.acronym || '' },
            division: { "S": teamInformation.division || '' },
            conference: { "S": teamInformation.conference || '' },
            record: {
                "M": {
                    regulationWins: { "N": teamInformation.record.regulationWin.toString() },
                    regulationLosses: { "N": teamInformation.record.regulationLoss.toString() },
                    overtimeWins: { "N": teamInformation.record.overtimeWin.toString() },
                    overtimeLosses: { "N": teamInformation.record.overtimeLoss.toString() },
                    shootoutWins: { "N": teamInformation.record.shootoutWin.toString() },
                    shootoutLosses: { "N": teamInformation.record.shootoutLoss.toString() },
                    points: { "N": teamInformation.record.points.toString() },
                }
            },
        },
    }
    const command = new PutItemCommand(input);
    return await client.send(command);
}


const registeredGame = new Game(dummyGame);    
console.log(registeredGame);
storeMatch(registeredGame).then(response => console.log(JSON.stringify(response, null, 2)));

