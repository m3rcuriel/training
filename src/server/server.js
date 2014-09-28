var express = require('express');
var ex = express();
var compression = require('compression');
var toobusy = require('toobusy');

var url = require('url');

var App = require('../js/app.js');

var Context = require('../js/lib/context.js');
var authenticate = require('../js/lib/authentication.js').authenticate;
var query = require('../js/lib/query.js');
var setResponse = require('../js/lib/redirect.js').setResponse;

ex.disable('etag');

ex.use(compression());
ex.use(function(req, res, next) {
    if (toobusy()) res.send(503, "I'm busy right now, sorry.");

    if (req.path.match(/^\/static/)) {
        return next();
    }
    try {
        Context.reset();
        var userId = authenticate(req, res) || '';
        query.setQuery(req.query);
        setResponse(res);

        var path = url.parse(req.url).pathname;
        var app = App({path: path});

        setImmediate(function reactRenderOnNextTick () {
            var markup = React.renderComponentToString(app);

            var html = '<!DOCTYPE html>\
                <html>\
                <head>\
                    <link href="https://fonts.googleapis.com/css?family=Open+Sans:400italic,700italic,400,700" rel="stylesheet" type="text/css" />\
                    <title>3501 Training</title>\
                    <meta charset="utf-8" />\
                    <link rel="stylesheet" href="/static/style.css" type="text/css" media="screen" charset="utf-8" />\
                    <link rel="icon" href="/static/assets/favicon.ico">\
                </head>\
                <body>\
                    <div id="app">' + markup + '</div>\
                    \
                    <script src="/static/app.js" type="text/javascript" charset="utf-8"></script>\
                    <script>(function(i,s,o,g,r,a,m){i["GoogleAnalyticsObject"]=r;i[r]=i[r]||function(){\
                        (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),\
                        m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)\
                        })(window,document,"script","//www.google-analytics.com/analytics.js","ga");\
                        ga("create","UA-54088466-1","auto");ga("send","pageview");\
                        ga(‘set’, ‘&uid’, {{' + userId.toS(); + '}});\
                    </script>\
                </body>\
                </html>';

            res.send(html);
        });
    } catch(err) {
        return next(err);
    }
});

ex.use(express.static(process.env.DIST));

var port = process.env.TRAINING_PORT || 5000 ;
var ip = '127.0.0.1';
ex.listen(port, ip);

console.log('Server up and running, listening on port ' + port + '.');
