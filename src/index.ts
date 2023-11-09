import express from 'express';
import path from 'path'
import https from 'https';
import fs from 'fs';
import { userInfo, userInfoSafe } from './db';

const bodyParser = require('body-parser')

import dotenv from 'dotenv'
dotenv.config()

const app = express();

app.set("views", path.join(__dirname, "views"));
app.set('view engine', 'pug');

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

const externalUrl = process.env.RENDER_EXTERNAL_URL;
const port = externalUrl && process.env.PORT ? parseInt(process.env.PORT) : 4080;

// const config = { 
//   authRequired : false,
//   idpLogout : true,
//   secret: process.env.SECRET,
//   baseURL: externalUrl || `https://localhost:${port}`,
//   clientID: process.env.CLIENT_ID,
//   issuerBaseURL: 'https://dev-zlgp6k7zj86tzane.us.auth0.com',
//   clientSecret: process.env.CLIENT_SECRET,
//   authorizationParams: {
//     response_type: 'code' ,
//    },
// };

if (externalUrl) {
  const hostname = '0.0.0.0'; //ne 127.0.0.1
  app.listen(port, hostname, () => {
  console.log(`Server locally running at http://${hostname}:${port}/ and from
  outside on ${externalUrl}`);
  });
  }
  else {
    https.createServer({
    key: fs.readFileSync('server.key'),
    cert: fs.readFileSync('server.cert')
    }, app)
    .listen(port, function () {
    console.log(`Server running at https://localhost:${port}/`);
  });
}

app.get('/',  function (req, res) {
  res.render('index');
});



app.post('/sqlinjection', (req, res) => {
  var user = req.body.user;
  var password = req.body.password;
  var check = req.body.check;
  var userData: string[];

  if (!check) {
    userInfo(user, password).then((val) => {
      userData = val;
      res.render('index', {user, password, check, userData});
    });
  }
  else {
    userInfoSafe(user, password).then((val) => {
      userData = val;
      res.render('index', {user, password, check, userData});
    });
  }
});