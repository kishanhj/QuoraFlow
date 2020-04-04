const express = require('express');
const bodyParser = require('body-parser')
const path = require('path');
const app = express();

app.get('/api', function (req, res) {
    return res.send('this is our brackend');
});

app.listen(process.env.PORT || 8080);
