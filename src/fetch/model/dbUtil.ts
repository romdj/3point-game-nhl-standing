import * as AWS from 'aws-sdk';

const elasticache = new AWS.ElastiCache();

export async function uploadElasticache(data: any) {
    await elasticache.addTagsToResource(params, function (err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else console.log(data);           // successful response
    });
}