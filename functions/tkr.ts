import { IncomingMessage } from 'http';
import https from 'https';
import type { APIGatewayEvent, Context } from 'aws-lambda';
import util from 'util';

const dtimg = (async () => {
    const res = await util.promisify<{
        body: Buffer,
        headers: IncomingMessage['headers'],
        statusCode: IncomingMessage['statusCode'],
    }>((cb) => {
        https.request('https://via.placeholder.com/1', {
            method: 'GET',
        }, res => {
            const buffers: Buffer[] = []

            res.on('data', chunk => buffers.push(chunk));

            res.on('end', () => {
                cb(null, {
                    statusCode: res.statusCode,
                    headers: res.headers,
                    body: Buffer.concat(buffers),
                });
            });
        });
    })();

    return res;
})();

exports.handler = async (event: APIGatewayEvent, context: Context) => {
    const img = await dtimg;

    console.log(event, context)
    return {
        statusCode: 200,
        headers: img.headers,
        body: img.body,
    };
}
