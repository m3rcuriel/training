var cryptojs = require('crypto-js');
var crypto = require('crypto');
var isNode = require('../lib/is-node.js');

var S3_KEY = process.env.S3_KEY || 'AKIAIAR6QZVGGDKEGGWA';
var S3_SECRET = process.env.S3_SECRET || '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';
var policyDocument = '{"Statement":[{"Effect":"Allow","Action":["s3:GetBucketLocation","s3:ListAllMyBuckets"],"Resource":"arn:aws:s3:::*"},{"Effect":"Allow","Action":["s3:ListBucket"],"Resource":["arn:aws:s3:::3501-training-2014-us-west-2"]},{"Effect":"Allow","Action":["s3:PutObject","s3:GetObject","s3:DeleteObject"],"Resource":["arn:aws:s3:::3501-training-2014-us-west-2/*"]}]}';

var post = function post () {

}

var put = function put () {

}

var get = function get () {

}

var policy = function policy (callback) {
  var parsedPolicy = cryptojs.enc.Utf16.parse(policyDocument);
  var encodedPolicy = cryptojs.enc.Base64.stringify(parsedPolicy);

  callback(encodedPolicy);
}

var getSignatureKey = function getSignatureKey(key, dateStamp, regionName, serviceName) {
  var date = cryptojs.HmacSHA256(dateStamp.toString(), 'AWS4' + key, {asBytes: true});
  var region = cryptojs.HmacSHA256(regionName, date, {asBytes: true});
  var service = cryptojs.HmacSHA256(serviceName, region, {asBytes: true});
  var signing = cryptojs.HmacSHA256('aws4_request', service, {asBytes: true});

  return signing;
}

var signature = function signature (callback) {
  // var parsedPolicy = cryptojs.enc.Utf8.parse(policyDocument);
  // var b64Policy = cryptojs.enc.Base64.stringify(parsedPolicy);

  // var hmac = cryptojs.algo.HMAC.create(cryptojs.algo.SHA1, S3_SECRET);
  // hmac.update(b64Policy);
  // var hash = hmac.finalize();
  // var base64 = hash.toString(cryptojs.enc.Base64);

  // callback(base64);

  // var signatureKey = getSignatureKey('wJalrXUtnFEMI/K7MDENG+bPxRfiCYEXAMPLEKEY', '20110909', 'us-east-1', 'iam');
  // var calculatedSignature = cryptojs.HmacSHA256(, signatureKey)

  // callback(calculatedSignature.toString());
  var AWS;
  if (isNode()) {
    AWS = require('aws-sdk');
    AWS.config.update({
      accessKeyId: S3_KEY,
      secretAccessKey: S3_SECRET,
      region: 'us-west-2',
      apiVersion: '2014-08-25'
    });
  } else return;

  var s3 = new AWS.S3({computeChecksums: true});
  var params = {Bucket: '3501-training-2014-us-west-2', Key: 'tcho.jpg'};
  var url = s3.getSignedUrl('putObject', params);
  console.log('the url is: ' + url);
}

module.exports.post = post;
module.exports.put = put;
module.exports.get = get;
module.exports.signature = signature;
module.exports.policy = policy;
