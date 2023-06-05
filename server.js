var express = require('express');
var path = require('path');
// eslint-disable-next-line @typescript-eslint/no-var-requires
var fs = require('fs');
// eslint-disable-next-line @typescript-eslint/no-var-requires
var https = require('https');
// Read SSL certificate files
var privateKey = fs.readFileSync('private-key.pem', 'utf8');
var certificate = fs.readFileSync('certificate.pem', 'utf8');
var credentials = { key: privateKey, cert: certificate };
var appUno = express();
appUno.use(express.static(path.join(__dirname, 'dist')));
appUno.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});
var server = https.createServer(credentials, appUno);
server.listen(8200, '0.0.0.0', function () {
    console.log("Server running on https://localhost:" + 8200);
});
var appRadioteh = express();
appRadioteh.use(express.static(path.join(__dirname, 'dist')));
appRadioteh.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});
var server2 = https.createServer(credentials, appRadioteh);
server2.listen(8300, '0.0.0.0', function () {
    console.log("Server running on https://localhost:" + 8300);
});
