var express = require('express');
var ex = express();

var url = require('url');

var App = require('../js/app.js');

var Context = require('../js/lib/context.js');
var authenticate = require('../js/lib/authentication.js').authenticate;
var query = require('../js/lib/query.js');
var setResponse = require('../js/lib/redirect.js').setResponse;

ex.disable('etag');

ex.use(function(req, res, next) {
    if (process.env.OPENSHIFT_NODEJS_PORT
        && req.headers['x-forwarded-proto'] === 'http') {
        return res.redirect('https://' + req.headers.host + req.path);
    } else if (req.path.match(/^\/static/)) {
        return next();
    }
    try {
        Context.reset();
        authenticate(req, res);
        query.setQuery(req.query);
        setResponse(res);

        var path = url.parse(req.url).pathname;
        var app = App({path: path});

        setImmediate(function reactRenderOnNextTick () {
            var markup = React.renderComponentToString(app);

            var html = '<!DOCTYPE html>\
                <html>\
                <head>\
                    <title>3501 Training</title>\
                    <meta charset="utf-8" />\
                    <link rel="stylesheet" href="/static/style.css" type="text/css" media="screen" charset="utf-8" />\
                    <link rel="icon" href="/static/assets/favicon.ico">\
                </head>\
                <body>\
                    <div id="app">' + markup + '</div>\
                    \
                    <script src="/static/app.js" type="text/javascript" charset="utf-8"></script>\
                </body>\
                </html>';

            res.send(html);
        });
    } catch(err) {
        return next(err);
    }
});

if (process.env.OPENSHIFT_NODEJS_PORT) {
    var dist = '_dist';
}

ex.use(express.static(dist || process.env.DIST));

var port = process.env.OPENSHIFT_NODEJS_PORT || 5000 ;
var ip = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
ex.listen(port, ip);

console.log('Server up and running, listening on port ' + port + '.');

if (process.env.OPENSHIFT_NODEJS_PORT) {
    var fs = require('fs');
    var stream = fs.createWriteStream('go.txt');
    stream.once('open', function (fd) {
        stream.write('First row\n');
        stream.end();
    });
}
