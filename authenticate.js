var mongojs = require("mongojs");
var db = mongojs("mongodb://vedha:krishna123@cluster0-shard-00-00-kbuhh.mongodb.net:27017/Hutlabs?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin",["members"]);
var express=require("express");
var app = express();
var bodyParser=require('body-parser');
app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("templates"));
app.get("/login",function(req,res)
{
	res.sendFile(__dirname+"/templates/login.html");
});
app.get("/",function(req,res)
{
	res.sendFile(__dirname+"/templates/webpage.html");
});
app.get("/register",function(req,res)
{
	res.sendFile(__dirname+"/templates/register.html");
});
app.post("/login-done/",function(req,res,next)
{

	var object={
		email:req.body.username,
		password:req.body.password
	} 

	db.members.find(object,function(err,data)
	{
		if(err)
		{
			console.log(err);
		}
		else
		{
			if(data.length>0)
			{ 
				db.practicals.update({ email:data[0].email},{$set:{status:1}});
				res.sendFile(__dirname+"/templates/mylab.html");
			}
			else
			{
				res.send("entered details are wrong")
			}
		}
	});

});


app.post("/register-done/",function(req,res)
{
	if(req.query.password_1==req.query.password_2)
	{		
		var m=req.body.number;

			var obj={
				fname:req.body.firstname,
				lname:req.body.lastname,
				email:req.body.username,
				password:req.body.password_1,
				mobile:m
			}

			db.members.insert(obj,function(err,data)
			{	
				if(err)
				{
					console.log(err)
				}
				else
				{
					res.sendFile(__dirname+"/templates/mylab.html")
				}
			});

		
	}
	else
	{
		res.send("passwords do not match");
	}

	
});

app.listen(4000,function()
{
	console.log("SERVER STARTED SUCCESSFULLY................")
})
