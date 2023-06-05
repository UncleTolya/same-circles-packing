const express = require('express')
const path  = require('path');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('fs');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const https = require('https');

// Read SSL certificate files
const privateKey = fs.readFileSync('private-key.pem', 'utf8');
const certificate = fs.readFileSync('certificate.pem', 'utf8');
const credentials = { key: privateKey, cert: certificate };

const appUno = express();

appUno.use(express.static(path.join(__dirname, 'dist')));
appUno.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const server = https.createServer(credentials, appUno);
server.listen(8200, '0.0.0.0', () => {
  console.log(`Server running on https://localhost:${8200}`);
});

const appRadioteh = express();

appRadioteh.use(express.static(path.join(__dirname, 'dist')));
appRadioteh.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});
const server2 = https.createServer(credentials, appRadioteh);
server2.listen(8300, '0.0.0.0', () => {
  console.log(`Server running on https://localhost:${8300}`);
});
