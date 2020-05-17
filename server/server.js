const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const expstatic = express.static(__dirname + "/public");
const methodOverride = require('method-override');
const xss = require("xss")
const admin = require('firebase-admin')
const configRoutes = require("./routes");
const exphbs = require("express-handlebars");
const session = require('express-session')
app.use(methodOverride('_method'))
var http = require('http').Server(app);
const io = require('socket.io')(http);
var allowCrossDomain = function (req, res, next) {
  res.header('Access-Control-Allow-Origin', "*");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH');
  res.header('Access-Control-Allow-Headers', 'Content-Type, authtoken');
  next();
}



app.use("/public", expstatic);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(allowCrossDomain)


app.use(function (req, res, next) {
  if (req.body) {
    const keys = Object.keys(req.body);
    for (let i = 0; i < keys.length; ++i) {
      req.body[keys[i]] = xss(req.body[keys[i]]);
    }
  }
  next();
});

app.use(methodOverride('X-HTTP-Method-Override'))
app.use(session({
  name: 'AuthCookie',
  secret: 'some secret string!',
  resave: false,
  saveUninitialized: true
}))



app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");


// var serviceAccount = require("./quoraoverflow-firebase-adminsdk-98d62-e218222843.json");

// var defaultApp = admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount)
// });
// console.log(defaultApp.name);  // '[DEFAULT]'
// // app.use("/", checkAuth)  


// function checkAuth(req, res, next) {
//   if (req.headers.authtoken) {
//     admin.auth().verifyIdToken(req.headers.authtoken)
//       .then(() => {
//         next()
//       }).catch(() => {
//         res.status(403).send('Unauthorized')
//       });
//   } else {
//     res.status(403).send('Unauthorized')
//   }
// }


configRoutes(app);

const port = process.env.PORT || 8080;
http.listen(port, () => {
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:" + port);
});




