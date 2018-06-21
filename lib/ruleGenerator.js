const R = require('ramda');
const fs = require('fs');
const path = require('path');
const defaultRules = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'rules.json'), 'utf8'));
const format = require('string-template');

const op = {
    'eq': (a, b) => a == b,
    'ne': (a, b) => a != b,
    'gt': (a, b) => a > b,
    'ge': (a, b) => a >= b,
    'lt': (a, b) => a < b,
    'le': (a, b) => a <= b
};

const query = R.curry((rule, $) => {
    let match = $(rule.selector).length;
    if (op[rule.operator](match, rule.threshold)) return format(rule.message, match);
    return '';
});

const combinedQuery = R.curry((rules, $) => {
    return rules.selectors
                .map(sr => {
                    let match = $(sr.selector).length;
                    if (op[sr.operator](match, sr.threshold)) return format(sr.message, match);
                    return '';
                })
                .filter(r => r !== '')
                .join('\n');
});

module.exports = ids => {
    // Filter rules by arguments or apply all rules
    let rules = (ids && ids.length > 0) ? defaultRules.filter(r => ids.includes(r.id)) : defaultRules;
    // Generate selectors: Single or Combined rules
    return rules.map(r => r.selectors ? combinedQuery(r) : query(r));
};