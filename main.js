const express = require('express');  
const app = express();
var template = require('./lib/template.js');
var bodyparser = require('body-parser');
var compression = require('compression');
var routejs = require('./route.js');

app.use(bodyparser.urlencoded({extended:true}));
app.use(compression());
app.use(express.static('./lib/img'));

app.use('/',routejs);



app.listen(3000,()=>console.log('포트3000'));
