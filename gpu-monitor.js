var nodemailer = require('nodemailer');
var request = require('request');

var gpuMiner = 'http://787de1.ethosdistro.com/?json=yes';
var targetHash = 170;
var maxTemp = 75;
var refreshRate = 120000;
let userEmail = 'joevegan@gmail.com';
let appPassword = 'hqopxnrjqosvofpe';
let emailService = 'gmail';

var transporter = nodemailer.createTransport({
  service: emailService,
  auth: {
    user: userEmail,
    pass: appPassword
  }
});

var emailOptions = {
  from: userEmail,
  to: userEmail,
  subject: 'GPU Rig Issue',
  text: ''
};

var task_is_running = false;
setInterval(function(){
    if(!task_is_running){
        task_is_running = true;

        request(gpuMiner , function (error, response, body) {

            if (!error && response.statusCode == 200) {
                res = JSON.parse(body);
                console.log('hash: ' + res.total_hash + ' | temp: ' + res.avg_temp + ' | time: ' + Date.now());

                if (res.total_hash < targetHash ) {
                    emailOptions.text = 'hash: ' + res.total_hash;
                    transporter.sendMail(emailOptions, function(error, info){
          				if (error) {
            					console.log(error);
          				} else {
           					console.log('Email sent: ' + info.response);
          				}
                    });
                    console.log('gpu failure');
                    return;
                }
        		if (res.avg_temp > maxTemp ) {
        			emailOptions.text = 'temp: ' + res.avg_temp;
        			transporter.sendMail(emailOptions, function(error, info){
          				if (error) {
            					console.log(error);
          				} else {
           					console.log('Email sent: ' + info.response);
          				}
        			});
        			console.log('check temps!');
        			return;

        		}
                task_is_running = false;
            }
        })
    }
}, refreshRate);
