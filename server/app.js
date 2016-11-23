var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var express = require('express');
var path = require('path');
var promise = require('promise');
var nodemailer = require('nodemailer');
var fs = require('fs');

var app = express();   
app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/../'));
mongoose.connect(process.env.DB || 'mongodb://localhost:27017/version_1');
var hostName = (process.env.redirectionUrl || 'localhost:8080');
function readModuleFile(path, callback) {
    try {
        var filename = require.resolve(path);
        fs.readFile(filename,'utf8',  callback);
    } catch (e) {
        callback(e);
    }
}
var siteCounterSchema = mongoose.Schema({
	counter:{type: Number, default:0}
})
//mongoose schemas
var loginSchema =mongoose.Schema({
	emailid : { type: String, unique:true},
	first_name : String,
	password : String,
	phone_no : Number,
	referalCode: String,
	referalBalance: {type: Number, default: 75},
	activationStatus : {type:String, default:"inActive"},
	address: {type:String, default:"Not Saved"}
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
			_id: String,
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
var enquirySchema = mongoose.Schema({
	emailId : String,
	query : String,
	phoneNo : Number
});
var pincodesWeServeSchema = mongoose.Schema({
	pincode: {type: Number, unique: true},
	availability: Boolean,
	counter: Number  // used to count no of user requests to a non service area
});
var pincodesRequestedSchema = mongoose.Schema({
	pincode: {type: Number, unique: true},
	noOfTimes: Number
})
var referralSystemShema = mongoose.Schema({
	referredTo: String,
	referredBy: String,
	madeAccount: Boolean
});
var feedbackSchema = mongoose.Schema({
	orderid:String,
	emailId:String,
	service: String,
	delivery_time: String,
	custome_care: String, 
	overall: String,
	website:String,
	recommend:String,
	suggestion: {type: String, default: "No Comments"}
});
// var ipsAccessingSchema = mongoose.Schema({
// 	ip: {type: String, unique: true},
// 	time: {
// 		type: Date, 
// 		default: Date.now()
// 	}
// })
//mongoose models
var siteCounterModel = mongoose.model('siteCounters', siteCounterSchema);
var loginsModel = mongoose.model('logins',loginSchema);
var submitRequestModel = mongoose.model('submitRequests',submitRequstSchema);
var completedRequestsModel = mongoose.model('completedRequests',pastRequestsSchema);
var adminLoginModel = mongoose.model('adminLogins', adminSchema);
var earlyBirdModel = mongoose.model('earlyBirds', earlyBirdSchema);
var enquiryModel = mongoose.model('enquiries', enquirySchema);
var pincodesWeServeModel = mongoose.model('service_pincodes', pincodesWeServeSchema);
var pincodesRequestedModel = mongoose.model('pincodes_requested', pincodesRequestedSchema);
var referralSystemModel = mongoose.model('referrals', referralSystemShema);
var feedbackModel = mongoose.model('feedbacks', feedbackSchema);
// var ipsAccessingModel = mongoose.model('ips', ipsAccessingSchema);
// mail setup
var transporter = nodemailer.createTransport('smtps://clordacorp@gmail.com:shhuji123@smtp.gmail.com');

//index page
app.get('/',function(request, response){ 
// var ipReceived = request.headers['x-forwarded-for'] || 
//      request.connection.remoteAddress || 
//      request.socket.remoteAddress ||
//      request.connection.socket.remoteAddress;

//     var ipToStore = new ipsAccessingModel({ip: ipReceived});
//     ipToStore.save();
	siteCounterModel.find({}, function(err, data){
		if(!err){
			siteCounterModel.update({counter: data[0].counter}, {counter: data[0].counter + 1}, function(err, success){
				if(err)
					console.log(err)
			})
		}
	})
	response.sendFile(path.join(__dirname+"/../html/index.html"));
}); 
//admin page
app.get("/admin",function(request, response){
	response.sendFile(path.join(__dirname+'/../html/adminPanel.html'));
});
//resetPasswordPage
app.get("/resetPassword", function(request, response){
	// console.log(request.query.token)
	response.sendFile(path.join(__dirname+'/../html/resetPassword.html'));
});
//add poin codes
app.get('/addpincodes', function(request, response){
	response.sendFile(path.join(__dirname+'/../html/addpincodes.html'))
})
//http requests
app.get('/sendDiscountCoupon', function(request, response){
	var emailid = request.query.email;
	var emailDb = new earlyBirdModel({emailid: emailid});
	emailDb.save(function(err, saved){
			if(err){
				response.send({infoEmail:"Sorry we are unable to process emails right now.", status:"failed" })
			}
			else{
			readModuleFile('./../html/email/discountEmail.html', function (err, emailContent) {
			emailContent = emailContent.replace("PROMOCODE", saved._id);
			var mailOptions = {
  	   	 		from: '"CLORDA" <support@clorda.com>', // sender address
  	   	 		to: emailid, // list of receivers
   		 		subject: '100/- off on reviving your laptop/desktop/printer ✔', // Subject line
   		 		text: 'Congratulations', // plaintext body
   		 		html: emailContent
						};	
			transporter.sendMail(mailOptions, function(error, info){
    			if(error)
        			response.send({infoEmail:"Sorry we are unable to process emails right now.", status:"failed" });	 
   				else{
   					response.send({infoEmail:"Check your email for more information about Clorda", status:"success"});
   					}
    			});
			});
	}
	});
})
app.get('/changeBalance', function(request, response){
	email = request.query.email;
	amount = request.query.amount;
		loginsModel.update({emailid:email}, {referalBalance: amount}, function(err, done){
		if(err)
			response.send("error");
		else
			response.send("done")
		
		})
})
app.get('/getBalance', function(request, response){
	emailId = request.query.email;
	loginsModel.find({emailid:emailId},function(err, data){
		if(err || data.length === 0)
			response.send({balance: "eror"});
		else
			response.send({balance: data[0].referalBalance})
	})
})
app.get('/referral',function(request, response){
	var emailidTo = request.query.emailidTo;
	var emailidFrom = request.query.emailidFrom;
	//get referral code 
	loginsModel.find({emailid: emailidFrom},function(err, referredByData){
		//save referral data to db
			

	referralSystemModel.find({referredTo : emailidTo, referredBy: referredByData[0].referalCode}, function(err, referralList){
		if(referralList.length <= 0){
			console.log(referralList.length)
			var dataToAdd = new referralSystemModel({referredTo : emailidTo, referredBy: referredByData[0].referalCode, madeAccount:false});
			dataToAdd.save(function(err, data){
				if(err){
					response.send({response: "error"});
				}
				else{
					//send email to emailidTo
					var referralLink = '';
					loginsModel.find({emailid: emailidFrom},function(err, data){
						if(err){
							response.send({response:"error"});
						}
						else{
							readModuleFile('./../html/email/referral.html', function (err, emailContent) {
							link = "http://"+hostName+"/#/invitation?referralFrom="+data[0].referalCode;
						    emailContent = emailContent.replace("yahanDalnaHaiLink", link);
						    emailContent = emailContent.replace(/yahanDalnaHaiName/g, referredByData[0].first_name);
						    emailContent = emailContent.replace("yahanDalnaHaiReferCode", referredByData[0].referalCode);
						    var mailOptions = {
					  	   	 		from: data[0].first_name+' <referral@clorda.com>', // sender address
					  	   	 		to: emailidTo, // list of receivers
					   		 		subject: 'Invitation From '+data[0].first_name+' to join Clorda.com ✔', // Subject line
					   		 		text: ' Email', // plaintext body
					   		 		html: emailContent // html body
											};	
									transporter.sendMail(mailOptions, function(error, info){
						    			if(error)
						        			response.send({response:"failedToSendMail"});	 
						   				else
						   					response.send({response:"emailSent"});
						    			});

								})

						}
					})
				}
			})

		}
		else{
				var referralLink = '';
					loginsModel.find({emailid: emailidFrom},function(err, data){
						if(err){
							response.send({response:"error"});
						}
						else{
							readModuleFile('./../html/email/referral.html', function (err, emailContent) {
							link = "http://"+hostName+"/#/invitation?referralFrom="+data[0].referalCode;
						    emailContent = emailContent.replace("yahanDalnaHaiLink", link);
						    emailContent = emailContent.replace(/yahanDalnaHaiName/g, referredByData[0].first_name);
						    emailContent = emailContent.replace("yahanDalnaHaiReferCode", referredByData[0].referalCode);
						    var mailOptions = {
					  	   	 		from: data[0].first_name+' <referral@clorda.com>', // sender address
					  	   	 		to: emailidTo, // list of receivers
					   		 		subject: 'Invitation From '+data[0].first_name+' to join Clorda.com ✔', // Subject line
					   		 		text: ' Email', // plaintext body
					   		 		html: emailContent // html body
											};	
									transporter.sendMail(mailOptions, function(error, info){
						    			if(error)
						        			response.send({response:"failedToSendMail"});	 
						   				else
						   					response.send({response:"emailSent"});
						    			});
								})
						}
					})
		}
	})
	})
})
app.get('/addCode',function(request, response){
	var pinToAdd = request.query.pin;

	var pinaddvar = new pincodesWeServeModel({pincode: pinToAdd, availability:true, counter:0});
	pinaddvar.save(function(err, data){
		if(err)
			response.send({response:"error"});
		else{
			response.send({response:"added"});
		}
	})
});
app.get('/delCode',function(request, response){
	var pinToAdd = request.query.pin;

	pincodesWeServeModel.remove({pincode: pinToAdd},function(err, done){
		if(err)
			response.send({response:"error"});
		else{
			response.send({response:"removed"});
		}
	})
});
app.get('/getallcodes', function(request, response){
	pincodesWeServeModel.find({},function(err, codes){
		if(err){
			response.send({response: "error"});
		}
		else{
			response.send({response:codes});
		}
	})
})
app.get('/checkAvailability',function(request, response){
	var pin = request.query.location;
	pincodesWeServeModel.find({pincode: pin},function(err, data){
		if(err){
			response.send({response: "Error"});
		}
		else {
			if(data.length > 0 && data[0].availability === true){
				pincodesWeServeModel.update({pincode: pin}, {counter: data[0].counter+1}, function(err, updated){
					response.send({response: data[0].availability});
				})
			}
			//else if we do not server on that location then store that pincode to database
			else{
				if(data.length === 0){
					var newPincode = new pincodesWeServeModel({pincode: pin,availability:false,counter: 1})
					newPincode.save(function(err, added){});
					response.send({response: "SoonWeWillCoverThisArea"})
				}
				else{
					pincodesWeServeModel.update({pincode: pin}, {counter: data[0].counter+1},function(err, added){
						response.send({response: "SoonWeWillCoverThisArea"})
					})
				}
			}
		}
	})
})
app.post('/loginRequest',function(request, response){ 
	var username = request.body.userEmail;
	var password = request.body.password;
	mongoose.model('logins').find({emailid : username},function(err,user){
	

		if(user.length > 0){
				var userDetails = {};
		userDetails.email = user[0].emailid;
		userDetails.name = user[0].first_name;
		userDetails.phone_no = user[0].phone_no;
		userDetails.referalCode = user[0].referalCode;
		userDetails.address = user[0].address;
		if(password == user[0].password && user[0].activationStatus == "active"){
			response.send({loginSuccess: true, message : "success", userDetails:userDetails});
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
    var referalCod = firstName.substring(0, 4).toUpperCase() + Date.now();
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
						phone_no : contactNo,
						referalCode : referalCod
   					});
   	signUpDetails.save(function(err, logins){
   		if(err){
   			}
   		else{   
				readModuleFile('./../html/email/confirm_mail.html', function (err, emailContent) {
				   var link="http://"+hostName+"/accountActivation?token="+logins._id;
					emailContent = emailContent.replace("yahanDalnaHaiLink", link);
				    emailContent = emailContent.replace(/yahanDalnaHaiName/g, firstName);
				   			var mailOptions = {
				  	   	 		from: '"Clorda " <support@clorda.com>', // sender address
				  	   	 		to: username, // list of receivers
				   		 		subject: 'Greetings from Clorda ✔', // Subject line
				   		 		text: 'Activation Email', // plaintext body
				   		 		html: emailContent // html body
										};	
								transporter.sendMail(mailOptions, function(error, info){
					    			if(error){
					        			response.send({response:"failedToSendMailRegisterLater"});	 
					    			}
					   				else{
					   					response.send({response:"waitingForActivation"});
					   					}
							});
					});
		}
   	});
	}
	})
}); 
app.post('/signUpRequestRefer', function(request, response){
	var username = request.body.userEmail;
	var password = request.body.password;
    var firstName = request.body.firstName;
    var contactNo = request.body.contactNo;
    var referredBy = request.body.referralCode;
    var referalCod = firstName.substring(0, 4).toUpperCase() + Date.now();

    //save details in logins collection
    var details = new loginsModel({
    	emailid : username,
		first_name : firstName,
		password : password,
		phone_no : contactNo,
		referalCode : referalCod
    });
    details.save(function(err, detailsSaved){
    	if(err){
    		response.send({response:"alreadyExists"});
    	}
    	else{
    		//sending activation link
		readModuleFile('./../html/email/confirm_mail.html', function (err, emailContent) {

	    		var link="http://"+hostName+"/accountActivation?token="+detailsSaved._id+"&referredBy="+referredBy;
			emailContent = emailContent.replace("yahanDalnaHaiLink", link);
			emailContent = emailContent.replace(/yahanDalnaHaiName/g, firstName);
   			var mailOptions = {
		  	   	 		from: '"Clorda " <support@clorda.com>', // sender address
		  	   	 		to: username, // list of receivers
		   		 		subject: 'Hello ✔', // Subject line
		   		 		text: 'Activation Email', // plaintext body
		   		 		html:  emailContent // html body
						};	
			transporter.sendMail(mailOptions, function(error, info){
    			if(error){
        			response.send({response:"failedToSendMailRegisterLater"});	 
    			}
   				else{
   					//now details are saved and activation email is sent change refer collection
   					referralSystemModel.update({referredTo: username, referredBy: referredBy}, {madeAccount: true}, function(err, changed){
   						if(err){
   							response.send({response: "error"});
   						}
   						else{
   						
						   					response.send({response:"waitingForActivation"});
   								
   						}
   					})
   					}
    			});

		})

    	}
    })
})
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
        	
        		var mailOptions = {
	  	   	 		from: '"Clorda" <support@clorda.com>', // sender address
	  	   	 		to: deviceDetails['email'], // list of receivers
	   		 		subject: 'Request Submitted successfully ✔', // Subject line
	   		 		text: '', // plaintext body
	   		 		html: "<p>Hi, we have received Your service request, Soon our team will get in touch with you.</p>" // html body
						};	
				transporter.sendMail(mailOptions, function(error, info){
	    			// if(error){
	       //  			// response.send({signUpResponse:"failedToSendMailRegisterLater"});	 
	    			// }
	   				// else{
	   				// 	// response.send({signUpResponse:"emailSent"});
	   				// 	}
    			});
        	response.send({response:"requestSubmitted"})
        } 
        // return console.error("Error while saving data to MongoDB: " + err); // <- this gets executed when there's an error
    });
})
app.get('/getServiceRequests',function(request,response){
	var res = {
		active:[],
		completed:[]
	}; 
	var query= {}
	if(request.query.userEmail !== undefined){
		query = {email : request.query.userEmail};
	}
	var getDetails = function(){
		return new promise(function(resolve,reject){
		mongoose.model('submitRequests').find(query,function(err,activeRequests){
		res.active = activeRequests;
			mongoose.model('completedRequests').find(query,function(err,pastRequests){
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
	var referredBy = '';
	if(request.query.referredBy){
		referredBy = request.query.referredBy;
	}
	mongoose.model("logins").update({_id:id},{activationStatus:"active"},function(err,updatedRecord){
		if(err){
			response.send({activationResponse:"UnableToActivate"})
		}
		else{
					loginsModel.find({referalCode: referredBy}, function(err, referredByData){
   								if(err){
   									response.send({response:"error"});
   								}
   								else{
   									if(referredBy !== '' && updatedRecord.nModified > 0){
   									loginsModel.update({referalCode: referredBy}, {referalBalance : referredByData[0].referalBalance + 50}, function(err, updated){
   										if(err){
   											response.send({response:"error"});
   										}
   										else{
											response.redirect("/#/activation");
   										}
   									});
   								}
   								else{
   									response.redirect("/#/activation");
   								}
   								}
   							})
		}
	});
});
app.post('/resettingPassword', function(request, response){
	var passwd = request.body.password;
	var id = request.body.token;
	loginsModel.update({_id: id},{password: passwd}, function(err, passwordChanged){
		if(err){
		loginsModel.update({emailid: id},{password: passwd}, function(err2, passwordChanged2){
			if(err2){
				response.send("error");
			}
			else{
				response.send("success")
			}
			})		
		}
		else{
			response.send("success");
		}
	});

})
app.get('/sendPasswordRecoveryEmail',function(request,response){
	var emailid = request.query.user;
	mongoose.model('logins').find({emailid:emailid},function(err,user){
		if(user.length < 1 || err){
	    			response.send({signUpResponse:"failedToSendMailRegisterLater"});	 
   	
		}
	else{
		readModuleFile('./../html/email/resetpassword.html', function (err, emailContent) {
				var link="http://"+hostName+"/resetPassword?token="+user[0]._id;
				emailContent = emailContent.replace("yahanDalnaHaiLink", link);
			    emailContent = emailContent.replace(/yahanDalnaHaiName/g, user[0].first_name);
   				
		var mailOptions = {
  	   	 		from: '"Clorda" <support@clorda.com>', // sender address
  	   	 		to: emailid, // list of receivers
   		 		subject: 'Reset Password ✔', // Subject line
   		 		text: '', // plaintext body
   		 		html: emailContent // html body
						};	
			transporter.sendMail(mailOptions, function(error, info){
    			if(error)
        			response.send({signUpResponse:"failedToSendMailRegisterLater"});	 
   				else{
   					response.send({signUpResponse:"waitingForActivation"});
   					}
    			});


		})
}

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
			readModuleFile('./../html/email/confirm_mail.html', function (err, emailContent) {
				var link="http://"+hostName+"/accountActivation?token="+user[0]._id;
				emailContent = emailContent.replace("yahanDalnaHaiLink", link);
			    emailContent = emailContent.replace(/yahanDalnaHaiName/g, user[0].first_name);
   				var mailOptions = {
	  	   	 		from: '"Clorda" <support@clorda.com>', // sender address
	  	   	 		to: emailid, // list of receivers
	   		 		subject: 'Activation link from Clorda ✔', // Subject line
	   		 		text: 'Activation Email', // plaintext body
	   		 		html: emailContent // html body
						};	
				transporter.sendMail(mailOptions, function(error, info){
	    			if(error){
	        			response.send({signUpResponse:"failedToSendMailRegisterLater"});	 
	    			}
	   				else{
	   					response.send({signUpResponse:"emailSent"});
	   					}
    			});
		
				})
		
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
   		 		html: '<h2>Hi, thanks for showing your interest.</h2><p>We will notify you with an early bird present as soon as we are up.</p>' // html body
						};	
			transporter.sendMail(mailOptions, function(error, info){
    			if(error)
        			response.send({infoEmail:"Sorry we are unable to process emails right now.", status:"failed" });	 
   				else{
   					response.send({infoEmail:"Check your email for more information about Clorda", status:"success"});
   					}
    			});
	});
});
app.post("/submitEnquiry",function(request, response){
	var entry = {};
	entry.emailId = request.body.emailId;
	entry.query = request.body.query;
	entry.phoneNo = request.body.phoneNo;
	var entryToBeStored = new enquiryModel(entry);
	entryToBeStored.save(function(err, savedData){
		if(err)
		{
			console.log(err)
		}
		response.send("success")
	})
})
app.get("/updateStatus",function(request, response){
	var user = request.query.user;
	var status = request.query.status;
	if(status === "Completed"){
		//remove request from pending collection and add in completed requests
		mongoose.model('submitRequests').find({_id : user},function(err, data){
			//we got the record now adding it to completed request collections

			var copy = {
				_id: data[0]._id,
				date : data[0].date,	
				deviceType :data[0].deviceType,
				serviceType :data[0].serviceType,
				issueDesc:data[0].issueDesc,
				address : {
					initialAddress:data[0].address.initialAddress,
					city:data[0].address.city,
					state:data[0].address.state,
					zipCode:data[0].address.zipCode
				},
				tel:{
					primary:data[0].tel.primary,
				},
				email:data[0].email,
				status :"Completed"
			}
			var dataToBeSaved = new completedRequestsModel(copy);
			dataToBeSaved.save(function(err, data){
				if(err){
					console.log(err);
				}
				else
				{
					//remove recored from pending requests
					mongoose.model('submitRequests').find({_id : user}).remove(function(err, removed){
						if(err){
							response.send("error in removing from pending requests");
						}
						else{
							response.send("done Bro")
						}
					});
				}
			})
		})
	}
	else{
		submitRequestModel.update({_id:user},{status:status},function(err, updatedRecord){
			if(err){
				response.send("error in updating pending request")
			}
			else{
				response.send("updated")
			}
		})
	}
});
app.get("/addFeedback", function(request, response){

	var feedback = {};
	feedback.service = request.query.service;
	feedback.delivery_time = request.query.delivery_time;
	feedback.custome_care = request.query.custome_care;
	feedback.overall = request.query.overall;
	feedback.website = request.query.website;
	feedback.recommend = request.query.recommend;
	feedback.suggestion = request.query.suggestions;
	feedback.orderid = request.query.orderid;
	feedback.emailId = request.query.email;
	
	var feedbackToSave = new feedbackModel(feedback);
	feedbackToSave.save(function(err, saves){
		response.send("success")
	})
})
app.get("/getReferDetails", function(request, response){
	var code = request.query.refferedBy;
	var signUps = 0;
	referralSystemModel.find({referredBy:code}, function(err, data){
		
		data.forEach(function(element){
			if(element.madeAccount == true)
				signUps++;
		})
		loginsModel.find({referalCode: code},function(err, loginData){
			if(err){
				response.send("error");
			}
			else{
				response.send({refferedNo:data.length, signUps : signUps, referalBalance : loginData[0].referalBalance})
			}
		})
	})
});
app.get('/editUserDetails', function(request, response){
	var name = request.query.name;
	var phone = request.query.phone;
	var address = request.query.address;
	var code = request.query.code;
	loginsModel.update({referalCode: code}, {first_name:name, phone_no:phone, address:address}, function(err, data){
		if(err){
			response.send("error");
		}
		else{
			response.send("success");
		}
	})
});
app.listen(process.env.PORT || '8080',function(req, res){
	console.log("server started successfully");
});
