const R = require('ramda');
const http = require('http');
const https = require('https');

let client;
// Read data from URL
module.exports = url => {
    return new Promise((resolve, reject) => {
        client = R.startsWith('https', url.protocol) ? https : http;
        client.get(url, resp => {
            let content = '';
            resp.on('data', chuck => content += chuck);
            resp.on('end', () => resolve(content));
        }).on('error', e => reject(e));
    }).catch(e => {
        console.log('e', e);
    });
};
