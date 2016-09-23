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
// mail setup
var transporter = nodemailer.createTransport('smtps://copetoke31%40gmail.com:maderchod@smtp.gmail.com');
// var mailOptions = {
//     from: '"Fred Foo 👥" <brandname@brandname.com>', // sender address
//     to: 'shivanubhateja31@gmail.com', // list of receivers
//     subject: 'Hello ✔', // Subject line
//     text: 'Hello world 🐴', // plaintext body
//     html: '<b>Hello world 🐴</b>' // html body
// };
// transporter.sendMail(mailOptions, function(error, info){
//     if(error){
//         return console.log(error);
//     }
//     console.log('Message sent: ' + info.response);
// });
var loginsModel = mongoose.model('logins',loginSchema);
var submitRequestModel = mongoose.model('submitRequests',submitRequstSchema);
var completedRequestsModel = mongoose.model('completedRequests',pastRequestsSchema);


// HTML
app.get('/',function(request, response){ 
	response.sendFile(path.join(__dirname+"/../html/index.html"));
}); 
app.get('/panelmenu',function(request, response){ 
	response.sendFile(path.join(__dirname+"/../html/panel.html"));
});
app.get('/requestRegister',function(request, response){ 
	response.sendFile(path.join(__dirname+"/../html/requestRegister.html"));
}); 
app.get('/serviceRequests',function(request, response){ 
	response.sendFile(path.join(__dirname+"/../html/serviceRequests.html"));
}); 
app.get('/activation',function(request, response){ 
	response.sendFile(path.join(__dirname+"/../html/accountActivation.html"));
}); 
app.get('/bookingDone',function(request, response){ 
	response.sendFile(path.join(__dirname+"/../html/bookingDone.html"));
}); 
app.get('/homePage',function(request, response){ 
	response.sendFile(path.join(__dirname+"/../html/homePage.html"));
}); 
app.get('/laptopIssues',function(request, response){ 
	response.sendFile(path.join(__dirname+"/../html/laptopIssues.html"));
}); 
app.get('/desktopIssues',function(request, response){ 
	response.sendFile(path.join(__dirname+"/../html/desktopIssues.html"));
}); 

// // handcrafted scripts
// app.get('/frontApp',function(request, response){ 
// 	response.sendFile(path.join(__dirname+"/../js/frontApp.js"));
// }); 
// app.get('/paneljs',function(request, response){ 
// 	response.sendFile(path.join(__dirname+"/../js/controllers/panel.js"));
// }); 
// app.get('/requestRegisterjs',function(request, response){ 
// 	response.sendFile(path.join(__dirname+"/../js/controllers/requestRegister.js"));
// }); 
// app.get('/serviceRequestsjs',function(request, response){ 
// 	response.sendFile(path.join(__dirname+"/../js/controllers/serviceRequests.js"));
// }); 
// app.get('/activationjs',function(request, response){ 
// 	response.sendFile(path.join(__dirname+"/../js/controllers/accountActivation.js"));
// }); 
// app.get('/bookingDonejs',function(request, response){ 
// 	response.sendFile(path.join(__dirname+"/../js/controllers/bookingDone.js"));
// }); 
// app.get('/homePagejs',function(request, response){ 
// 	response.sendFile(path.join(__dirname+"/../js/controllers/homePage.js"));
// }); 
// images
// app.get("/laptopRepair",function(request,response){
// 	response.sendFile(path.join(__dirname+"/../images/laptopRepair.png"));
// });  
// app.get("/floppy",function(request,response){
// 	response.sendFile(path.join(__dirname+"/../images/floppy.png"));
// });  
app.get("/loading",function(request,response){
	response.sendFile(path.join(__dirname+"/../images/loading.gif"));
});  
// app.get("/error",function(request,response){
// 	response.sendFile(path.join(__dirname+"/../images/error.png"));
// }); 
app.get("/iconImage3",function(request,response){
	response.sendFile(path.join(__dirname+"/../images/iconImage3.jpg"));
}); 
app.get("/logo",function(request,response){
	response.sendFile(path.join(__dirname+"/../images/logo.png"));
}); 
// app.get("/desktopImage",function(request,response){
// 	response.sendFile(path.join(__dirname+"/../images/desktop.svg"));
// }); 
// app.get("/laptopImage",function(request,response){
// 	response.sendFile(path.join(__dirname+"/../images/laptopBig.svg"));
// });
// app.get("/laptopSmall",function(request,response){
// 	response.sendFile(path.join(__dirname+"/../images/laptopSmall.svg"));
// });
// app.get("/desktopSmall",function(request,response){
// 	response.sendFile(path.join(__dirname+"/../images/desktopSmall.svg"));
// });
// app.get("/pound",function(request,response){
// 	response.sendFile(path.join(__dirname+"/../images/Pound.svg"));
// });
// app.get("/hours24",function(request,response){
// 	response.sendFile(path.join(__dirname+"/../images/Hours24.svg"));
// });
// app.get("/clock",function(request,response){
// 	response.sendFile(path.join(__dirname+"/../images/Clock.svg"));
// });
// app.get("/lock",function(request,response){
// 	response.sendFile(path.join(__dirname+"/../images/Lock.svg"));
// });	
//http requests
app.post('/loginRequest',function(request, response){ 
	var username = request.body.userEmail;
	var password = request.body.password;

	mongoose.model('logins').find({emailid : username},function(err,user){
		if(user.length >0){
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
	console.log(request.query.userEmail)
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

app.listen(8080,function(){ 
	console.log("server started successfully");
});
