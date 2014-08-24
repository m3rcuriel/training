var crypto = require('crypto-js');

var S3_KEY = process.env.S3_KEY || 'AKIAIAR6QZVGGDKEGGWA';
var S3_SECRET = process.env.S3_SECRET || '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';
var policyDocument = '';

var post = function post () {

}

var put = function put () {

}

var get = function get () {

}

var policy = function policy (callback) {
  var parsedPolicy = crypto.enc.Utf16.parse(policyDocument);
  var encodedPolicy = crypto.enc.Base64.stringify(parsedPolicy);

  callback(encodedPolicy);
}

var signature = function signature (callback) {
  var hash = crypto.HmacSHA256(
    Math.round(Date.now() / 1000).toString(),
    'AWS4' + S3_KEY,
    'us-west-2',
    's3',
    'aws4_request',
    {asBytes: true});

  callback(hash);
}

module.exports.post = post;
module.exports.put = put;
module.exports.get = get;
module.exports.signature = signature;
module.exports.policy = policy;
