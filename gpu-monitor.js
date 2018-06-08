var nodemailer = require('nodemailer');
var request = require('request');

var gpuMiner = 'http://787de1.ethosdistro.com/?json=yes';
var targetHash = 170;
var maxTemp = 75;
var refreshRate = 120000;

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'email@gmail.com',
    pass: 'appPasswordHERE'
  }
});

var hashOptions = {
  from: 'joevegan@gmail.com',
  to: 'joevegan@gmail.com',
  subject: 'GPU hash issue',
  text: 'check miners!'
};

var tempOptions= {
  from: 'joevegan@gmail.com',
  to: 'joevegan@gmail.com',
  subject: 'GPU temp issue',
  text: 'check miners!'
};


var task_is_running = false;
setInterval(function(){
    if(!task_is_running){
        task_is_running = true;


        request(gpuMiner , function (error, response, body) {
            if (!error && response.statusCode == 200) {
		// console.log(res);
	        res = JSON.parse(body);
		console.log('hash: ' + res.total_hash + ' | temp: ' + res.avg_temp + ' | time: ' + Date.now());
		if (res.total_hash < targetHash ) {
			hashOptions.text = 'hash: ' + res.total_hash;
			transporter.sendMail(hashOptions, function(error, info){
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
			tempOptions.text = 'temp: ' + res.avg_temp;
			transporter.sendMail(tempOptions, function(error, info){
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


/* // sample mail send
transporter.sendMail(hashOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});
*/


/* // sample get from api
request(gpuMiner , function (error, response, body) {
    if (!error && response.statusCode == 200) {
	res = JSON.parse(body);
	console.log('hash: ' + res.total_hash);
	console.log('temp: ' + res.avg_temp);
	// console.log(res);
	task_is_running = false;
     }
})
*/
