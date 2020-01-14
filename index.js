var express=require('express');
var app=express();
var server =app.listen(4000,function(){console.log('server started')})
app.use(express.static(__dirname));
