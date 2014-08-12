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
    if (req.path.match(/^\/static/)) {
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

ex.use(express.static(process.env.DIST));

ex.listen(5000);

console.log('Server up and running, listening on port 5000.');
