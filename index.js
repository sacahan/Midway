#!/usr/bin/env node

const program = require('commander');
const url = require('url');
const fs = require('fs');
const R = require('ramda');
const cheerio = require('cheerio');
const ruleGenerator = require('./lib/ruleGenerator');
const httpClient = require('./lib/httpClient');
const format = require('string-template');
const Transform = require('stream').Transform;
const Readable = require('stream').Readable;
const moment = require('moment');

// Set command line parameter
program.version(require('./package').version)
       .option('-u, --url <u>', 'set HTML URL', url.parse, 'N/A')
       .option('-o, --output [o]', 'set output path', './output.txt')
       .option('-r, --ruleId [r]', 'apply rule id of rules.json', function (r, ids) {
           ids.push(r);
           return ids;
       }, [])
       .parse(process.argv);

// Input from STDIN
let pipeInput = () => {
    return new Promise((resolve, reject) => {
        process.stdin.setEncoding('utf8');
        process.stdin.on('data', data => resolve(data));
    });
};

// Input by terminal command
let urlInput = url => {
    console.log("Your Setting is");
    console.log(". URL    : %s", program.url.href);
    console.log(". Output : %s", program.output);
    console.log(". Rules  : %s", program.ruleId.length > 0 ? program.ruleId : "*");
    return httpClient(url);
};

let inputCoordinator = url => {
    // For IDE debug
    //return urlInput(url);

    // Launch by terminal and arguments
    if (process.stdin.isTTY && url) return urlInput(url);
    // Receive STDIN stream
    else return pipeInput();
};

// Generate selectors
let selectors = html => {
    console.log('Executing ...');
    // Get selected rules
    let rules = ruleGenerator(program.ruleId);
    // Load html as DOM
    let $ = cheerio.load(html);
    let result = rules.map(r => r($)).filter(r => r !== '').join('\n');
    return Promise.resolve(result);
};

let output = data => {
    // Format result
    let result = format('======== {0} =========\n{1}\n{2}\n\n', moment().format('LLL'), data, "=======================================");

    // Create input stream
    let inputReader = new Readable({
        read() {}
    });
    inputReader.push(result);
    inputReader.push(null);

    // Create file output stream
    let fileWriter = new Transform({
        transform(data, encoding, callback) {
            // Write to file
            fs.writeFile(program.output, data, {flag: "a+"}, err => err ? console.warn(err) : '');
            callback(null, data);
        }
    });

    // Pipe result to destinations : File & Stdout
    inputReader.pipe(fileWriter).pipe(process.stdout);

    return Promise.resolve();
};

let app = R.composeP(output, selectors, inputCoordinator);
app(program.url).catch(err => err ? console.log(err) : '');