module.exports.create = function(app, player) {
  app.get('/', function(req, res) {
    var messageId = 0;

    // never timeout
    req.socket.setTimeout(Infinity);

    // don't drop the connection
    req.socket.setKeepAlive(Infinity);

    req.on('close', function() {
      console.log('Request closed unexpectedly');
      closeRequest();
    })

    req.on('end', function() {
      console.log('Request ended normally');
      closeRequest();
    });

    req.on('error', function(err) {
      console.log('Request returned an error: '+err);
      closeRequest();
    });

    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    });

    res.write('\n');

    player.addListener('update', writeToResponse);

    function writeToResponse(data) {
      var eventName = 'msg',
          msg = 'id: ' + (messageId++) + '\n' +
                'event: '+ eventName + '\n' +
                'data: ' + JSON.stringify(data) + '\n\n';

      res.write(msg);
    }

    function closeRequest() {
      res.end();
      console.log('Request closed');
    }
  });

  return app;
};
