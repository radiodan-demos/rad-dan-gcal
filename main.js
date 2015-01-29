var app          = require('express')(),
    bodyParser   = require('body-parser'),
    session      = require('express-session'),
    serveStatic  = require('serve-static'),
    radiodan     = require('radiodan-client'),
    port         = process.env.PORT || 5000,
    auth         = require('./lib/auth').create(port),
    gcal         = require('./lib/calendar').create(auth.client);

app.use(bodyParser.json());

app.use(session({
  resave: false,
  saveUninitialized: true,
  secret: 'radiodanLOL'
}));

app.use(serveStatic('./public'));

app.set('view engine', 'ejs');

app.get('/api/signin', function(req, res) {
  if(auth.isValid()) {
    res.sendCode(200);
  } else {
    res.redirect(auth.generateURL());
  }
});

app.get('/api/signout', function(req, res) {
  auth.setTokens({});

  res.redirect('back');
});

app.get('/api/user/calendar', function(req, res) {
  if(!auth.isValid()) {
    res.sendCode(400);
  }

  res.json(auth.calendar||{});
});

app.get('/api/user', function(req, res) {
  res.json({auth: auth.isValid()});
});

app.get('/api/user/calendar/:id', function(req, res) {
  if(auth.isValid()) {
    auth.calendar = req.params.id;
    res.redirect('/app/dashboard');
  } else {
    auth.sendCode(400);
  }
});

app.get('/oauth2callback', function(req, res) {
  var code = req.query.code;

  if(!code) {
    res.sendStatus(400);
    return;
  }

  auth.requestTokens(code)
    .then(function(tokens) {
      auth.setTokens(tokens);
      res.redirect(req.session.backURL || '/app/calendars');
      delete req.session.backURL;
    }, function(err) {
      console.log(err);
      res.sendStatus(400);
    });
});

app.get('/api/calendars', function(req, res) {
  gcal.calendarList().then(
    function(calendars) {
      var cals = calendars.items.map(function(c) {
        return {summary: c.summary, id: c.id};
      });

      res.json(cals);
    }, function(err) {
      res.sendStatus(400);
    });
});

app.get('/api/calendars/:id', function(req, res) {
  gcal.eventList(req.params.id).then(
    function(events) {
      res.json(events.items);
    }, function(err) {
      console.log(err);
      res.sendStatus(400);
    }
  );
});

app.get('/', function(req, res) {
  res.redirect('/app');
});

app.get('/app/?*', function(req, res) {
  res.render('app.html.ejs', {auth: auth.isValid()});
});

app.listen(port);

console.log('Listening on http://127.0.0.1:'+port);
