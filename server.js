var express = require('express');
var app = express();
var http = require('http').Server(app);

app.use(express.static(__dirname + '/public'));

var PORT = process.env.PORT || 3000;
http.listen(PORT, function(){
    console.log('Server is listening on port ' + PORT);
});
