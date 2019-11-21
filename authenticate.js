var mongojs = require("mongojs");
var db = mongojs("mongodb://vedha:krishna123@cluster0-shard-00-00-kbuhh.mongodb.net:27017/Hutlabs?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin",["members"]);
var express=require("express");
var app = express();
var bodyParser=require('body-parser');
const { check, validationResult } = require('express-validator');
var bcrypt = require('bcryptjs');
var salt = bcrypt.genSaltSync(10);
var session = require('express-session');
var passport = require('passport');

app.use(express.static("templates"));

app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'keyboard cat',
  saveUninitialized: true,
  resave: false,
}))
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.json());

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
app.get("/my-lab",function(req,res)
{
	console.log(req.user.id);
	console.log(req.isAuthenticated());
	res.sendFile(__dirname+"/templates/mylab.html");
});


app.post("/login-done/",[
	check('username').isEmail(),
	check('password').isLength({ min: 8 })
	],function(req,res,next)
{
	 const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.send(errors.array());
  }

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


app.post("/register-done",[
	check('username').isEmail(),
	check('password_1').isLength({ min: 8 }),
	check('password_2').isLength({ min: 8 }),
	],function(req,res)
{
		 const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.send(errors.array());
  }

	if(req.query.password_1==req.query.password_2)
	{		
		bcrypt.genSalt(10, function(err, salt) {
   			bcrypt.hash(req.body.password_1, salt, function(err, hash) {
					var obj={
						fname:req.body.firstname,
						lname:req.body.lastname,
						email:req.body.username,
						password:hash,
						mobile:req.body.number
					}
					db.members.insert(obj,function(err,data)
					{	
						if(err)
						{
							console.log(err)
						}
					});
					db.members.find(obj,function(err,data,fields){
						if(err)
						{
							console.log(err);
						}
						else
						{
							if(data.length>0)
							{ 
								console.log(data[0]._id);
								req.login(data[0]._id,function(err){
									res.redirect('/my-lab');
								})
							}
						}
					});
				});
			});
	}
	else
	{
		res.send("passwords do not match");
	}
});
passport.serializeUser(function(id, done) {
  done(null,id);
});

passport.deserializeUser(function(id, done) {
    done(null, id);
});

app.listen(4000,function()
{
	console.log("SERVER STARTED SUCCESSFULLY................")
})
