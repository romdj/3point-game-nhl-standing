import axios from 'axios';
import { get } from 'https';

function fetchAxios(url) {
    axios.get(url).then(data => console.log(data));
}

async function fetch2(hostname) {
    let fullBody;
    await get(hostname, (res) => {
        console.log('statusCode:', res.statusCode);
        console.log('headers:', res.headers);

        res.on('data', (d) => {
            fullBody += d;
            //   process.stdout.write(d);
        })
            .on('end', function () {
                var body;
                try {
                    body = JSON.parse(fullBody)
                } catch (err) {
                    return cb(err);
                };
                return body;
            })
            .on('error', (e) => {
                console.error(e);
            });
    });
    // return fullBody
}

function fetch(cb, hostname) {
    var options = {
        hostname,
        path: '',
        port: 443,
        method: 'GET'
    }

    get(options, response => {
        var buffer = '';
        response.on('data', function (d) {
            buffer += d;
        }).on('end', function () {
            var body;
            try {
                body = JSON.parse(buffer)
            } catch (err) {
                return cb(err);
            }
            cb(null, body);
        }).setEncoding('utf8');
    });
}

const intervalStartDate = '2022-09-01';
// const season = getCurrentSeason();
const intervalEndDate = new Date().toISOString().split('T')[0];
// const intervalEndDate = '2020-03-01';
const nhlAPIURL = "https://statsapi.web.nhl.com/api/v1/";
const from = `?startDate=${intervalStartDate}`;
const to = `&endDate=${intervalEndDate}`;
const nhlCompleteScheduleURL = `${nhlAPIURL}schedule${from}${to}&expand=schedule.linescore`;
// const nhlCompleteScheduleURL = `${nhlAPIURL}schedule${from}${to}&expand=schedule.linescore&season=${season}`;
// const nhlStandingsURL = `${nhlAPIURL}standings?season=${season}`;

// console.log(nhlCompleteScheduleURL);

// fetch((err, data) => console.log(data), nhlCompleteScheduleURL);
// fetch2(nhlCompleteScheduleURL);
fetchAxios(nhlCompleteScheduleURL);
/* 
(async () => {
    // const d = await fetch2(nhlCompleteScheduleURL);
    console.log('inside loop');
    console.log(await fetchAxios(nhlCompleteScheduleURL));
    // console.log(d);
    // console.log(JSON.stringify(d, null, 2));
})
 */