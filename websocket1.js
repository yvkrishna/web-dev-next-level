var express=require('express');
var socket=require('socket.io');
var app=express();
var server = app.listen(4000,function(){console.log('server started')})
app.use(express.static(__dirname));

var io=socket(server)

io.on('connection',function(socket){
	console.log('made socket connection',socket.id);
})
