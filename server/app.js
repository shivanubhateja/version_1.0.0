var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var express = require('express');
var path = require('path');
var promise = require('promise');
var nodemailer = require('nodemailer');

var app = express();   
app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/../'));
mongoose.connect('mongodb://localhost:27017/version_1');


//mongoose schemas
var loginSchema =mongoose.Schema({
	emailid : { type: String, unique:true},
	first_name : String,
	password : String,
	phone_no : Number,
	activationStatus : {type:String, default:"inActive"}
});
var submitRequstSchema = mongoose.Schema({
			date : {type:Date,default:Date.now},
			deviceType :String,
			serviceType :String,
			issueDesc:String,
			address : {
				initialAddress:String,
				city:String,
				state:String,
				zipCode:Number
			},
			tel:{
				primary:Number,
				},
			email:String,
			status:String
});
var pastRequestsSchema = mongoose.Schema({
			date : Date,	
			deviceType :String,
			serviceType :String,
			issueDesc:String,
			address : {
				initialAddress:String,
				city:String,
				state:String,
				zipCode:Number
			},
			tel:{
				primary:Number,
			},
			email:String,
			status :String
});
var adminSchema = mongoose.Schema({
	username: {type: String, unique: true},
	password: String, 
	changePermission: Boolean
});
var earlyBirdSchema = mongoose.Schema({
	emailid:{type:String , unique: true}
});
//mongoose models
var loginsModel = mongoose.model('logins',loginSchema);
var submitRequestModel = mongoose.model('submitRequests',submitRequstSchema);
var completedRequestsModel = mongoose.model('completedRequests',pastRequestsSchema);
var adminLoginModel = mongoose.model('adminLogins', adminSchema);
var earlyBirdModel = mongoose.model('earlyBirds', earlyBirdSchema);
// mail setup
var transporter = nodemailer.createTransport('smtps://copetoke31%40gmail.com:maderchod@smtp.gmail.com');

//index page
app.get('/',function(request, response){ 
	response.sendFile(path.join(__dirname+"/../notify/index.html"));
}); 
//admin page
app.get("/admin",function(request, response){
	response.sendFile(path.join(__dirname+'/../html/adminPanel.html'))
});
//http requests
app.post('/loginRequest',function(request, response){ 
	var username = request.body.userEmail;
	var password = request.body.password;

	mongoose.model('logins').find({emailid : username},function(err,user){
		if(user.length > 0){
		if(password == user[0].password && user[0].activationStatus == "active"){
			response.send({loginSuccess: true, message : "success"});
		}
		else if(password == user[0].password && user[0].activationStatus == "inActive"){
			response.send({loginSuccess: false, message : "accountInActive"})
		}
		else
			response.send({loginSuccess : false, message : "passwordIncorrect"});
	}
	else{
		response.send({loginSuccess : false, message : "userDoesNotExist"});
	}
	})
});
app.post('/adminLoginRequest', function(request, response){
	var username = request.body.username;
	var password = request.body.password;
	mongoose.model("adminLogins").find({username:username},function(err,foundRecord){
		if(foundRecord.length > 0){
			if(password == foundRecord[0].password){
				response.send({loginSuccess: true, changePermission: foundRecord[0].changePermission, message: "Success"});
			}
			else{
				response.send({loginSuccess: false, message: "Incorrect Password"});
			}
		}
		else{
			response.send({loginSuccess: false, message: "Admin ban phle"})
		}
	})
});
app.post('/signUpRequest',function(request,response){
	var username = request.body.userEmail;
	var password = request.body.password;
    var firstName = request.body.firstName;
    var contactNo = request.body.contactNo;
	//check if email id already exists 
	mongoose.model("logins").find({emailid: username},function(err,user){
		if(user.length > 0 ){
			response.send({response:"alreadyExists"})
		}
		else{
	var signUpDetails = new loginsModel({
   						emailid : username,
						first_name : firstName,
						password : password,
						phone_no : contactNo
   					});
   	signUpDetails.save(function(err, logins){
   		if(err){
   			}
   		else{   	
   		var link="http://localhost:3000/accountActivation?token="+logins._id;
   			var mailOptions = {
  	   	 		from: '"copetoke " <support@copetoke.com>', // sender address
  	   	 		to: username, // list of receivers
   		 		subject: 'Hello ✔', // Subject line
   		 		text: 'Activation Email', // plaintext body
   		 		html: '<a href="'+ link+'">CLICK HERE</a>' // html body
						};	
			transporter.sendMail(mailOptions, function(error, info){
    			if(error){
        			response.send({signUpResponse:"failedToSendMailRegisterLater"});	 
    			}
   				else{
   					response.send({signUpResponse:"waitingForActivation"});
   					}
    			});
			}
   	});
	}
	})
});  
app.post('/submitRequest',function(request,response){
	var deviceDetails = request.body.deviceDetails;
	deviceDetails["status"]="Processing";

	var deviceDetailsToBeSaved = new submitRequestModel(deviceDetails);
	deviceDetailsToBeSaved.save(function(err, submitRequests){
        if(err)
        {
        	if(err.code == '11000'){
        		response.send({response:"duplicateRequestError"});
        	}
        	else{
        		response.send({response:"someError"});
        	}
        	
        }
        else{
        	response.send({response:"requestSubmitted"})
        } 
        // return console.error("Error while saving data to MongoDB: " + err); // <- this gets executed when there's an error
        console.error("request submittion attempt"); // <- this never gets logged, even if there's no error.
    });
})
app.get('/getServiceRequests',function(request,response){
	var res = {
		active:[],
		completed:[]
	};
	var getDetails = function(){
		return new promise(function(resolve,reject){
		mongoose.model('submitRequests').find({email : request.query.userEmail},function(err,activeRequests){
		res.active = activeRequests;
			mongoose.model('completedRequests').find({email : request.query.userEmail},function(err,pastRequests){
			res.completed = pastRequests;
			resolve(res);
			});
		});
		})
	}

	getDetails().then(function(data){
		response.send(data);
	})
});
app.get('/accountActivation',function(request,response){
	var id = request.query.token;

	mongoose.model("logins").update({_id:id},{activationStatus:"active"},function(err,updatedRecord){
		if(err){
			response.send({activationResponse:"UnableToActivate"})
		}
		else{

			response.redirect("/#/activation");
		}
	});
});
app.get('/sendPasswordRecoveryEmail',function(request,response){
	var emailid = request.query.user;
	mongoose.model('logins').find({emailid:emailid},function(err,user){
		var user_password = user[0].password;
		var mailOptions = {
  	   	 		from: '"copetoke" <support@copetoke.com>', // sender address
  	   	 		to: emailid, // list of receivers
   		 		subject: 'Password Recovery✔', // Subject line
   		 		text: 'Activation Email', // plaintext body
   		 		html: '<p>Your Password is: <b>'+ user_password+'</b></p>' // html body
						};	
			transporter.sendMail(mailOptions, function(error, info){
    			if(error)
        			response.send({signUpResponse:"failedToSendMailRegisterLater"});	 
   				else{
   					response.send({signUpResponse:"waitingForActivation"});
   					}
    			});
	})
});
app.get('/resendActivationEmail',function(request,response){
	var emailid = request.query.user;
	mongoose.model('logins').find({emailid:emailid},function(err,user){
		if(user.length <= 0)
			response.send({response:"You Are Not Registered, Please Sign Up"});
		else{
			if(user[0].activationStatus == 'active')
				response.send({response:'Account is already Active'})
			else{
				var link="http://localhost:3000/accountActivation?token="+user[0]._id;
   			var mailOptions = {
  	   	 		from: '"COPE TOKE" <brandname@brandname.com>', // sender address
  	   	 		to: emailid, // list of receivers
   		 		subject: 'Hello ✔', // Subject line
   		 		text: 'Activation Email', // plaintext body
   		 		html: '<a href="'+ link+'">CLICK HERE</a>' // html body
						};	
			transporter.sendMail(mailOptions, function(error, info){
    			if(error)
        			response.send({signUpResponse:"failedToSendMailRegisterLater"});	 
   				else{
   					response.send({signUpResponse:"emailSent"});
   					}
    			});
			}
		}
	})
})
app.post('/sendInfoMail',function(request, response){
	var emailid = request.body.emailid;
	var emailDb = new earlyBirdModel({emailid: emailid});
	emailDb.save(function(err, saved){
			var mailOptions = {
  	   	 		from: '"CLORDA" <support@clorda.com>', // sender address
  	   	 		to: emailid, // list of receivers
   		 		subject: 'Welcome To Clorda✔', // Subject line
   		 		text: 'Congratulations', // plaintext body
   		 		html: '<p>congratulations</p>' // html body
						};	
			transporter.sendMail(mailOptions, function(error, info){
    			if(error)
        			response.send({infoEmail:"Sorry we are unable to process emails right now.", status:"failed" });	 
   				else{
   					response.send({infoEmail:"Check your email for more information about Clorda", status:"success"});
   					}
    			});
	});
})
app.listen(8080,function(){ 
	console.log("server started successfully");
});
