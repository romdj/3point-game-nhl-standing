import * as AWS from 'aws-sdk';

const elasticache = new AWS.ElastiCache({apiVersion: '2015-02-02'});

export async function uploadElasticache(toOffload: any) {
    const params = {

    };
    await elasticache.addTagsToResource(params, function (err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else console.log(data);           // successful response
    });
}