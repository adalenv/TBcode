	app={
		var:{
			domain:"192.168.1.222",
			path:"thebitcoincode.com"
		},
		do:{
			getInfo:function(){
				$.get('https://ipapi.co/json', function(data) {
					getInfo=data;
					$('#ti0form-area_code').val(data.country_calling_code);
				});
			},
			login:function(){
				$.ajax({
					"xhrFields": { withCredentials: true },
					"url": "https://api.platinumstrade.com/account/logon",
					"method": "POST",
					"data": {	"email":$('#login').val(),
								"password":$('#password').val()
							}
				}).done(function (response,status,xhr) {
					console.log(response);
					console.log(status);
					console.log(xhr);
					if (status="success") {
						window.localStorage.setItem("mmUserName",response.firstName+' '+response.lastName);
						app.do.goto("deposit");
					}

				}).fail(function(response){
					console.log(JSON.parse(response.responseText).message);
					errors=JSON.parse(response.responseText).message;
					alert(errors.replace(/\. /g,'\n'));
					$('#password').val('');
				});
			},
			logout:function(){
				$.ajax({
					"xhrFields": { withCredentials: true },
					"url": "https://api.platinumstrade.com/account/logoff",
					"method": "POST",
				})
				.done(function(response) {
					window.localStorage.removeItem("mmUserName");
					app.do.goto("login");
				})
				.fail(function() {
					console.log("error");
				})
				.always(function() {
					console.log("complete");
				});
			},
			registration:function(){
				$.ajax({
					url: 'https://api.platinumstrade.com/Registration/Full',
					type: 'GET',
					data:{	FirstName:$('#ti0form-first_name').val(),
							LastName: $('#ti0form-last_name').val(),
							Email: 	  $('#ti0form-email').val(),
							Password: $('#ti0form-password').val(),
							PhoneCountry: getInfo.country_calling_code,
							PhoneOperator:$('#ti0form-phone').val().substring(0,3),
							PhoneNumber:  $('#ti0form-phone').val().substring(3,$('#ti0form-phone').val().length),
							Country:getInfo.country,
							Terms:    true
						},
				})
				.done(function(response) {
					console.log(response);
				})
				.fail(function(response) {
					console.log(JSON.parse(response.responseText).message);
					errors=JSON.parse(response.responseText).message;
					alert(errors.replace(/\. /g,'\n'));
				})
				.always(function() {
					console.log("complete");
				});
			},
			run:function() {
			    var route=window.location.pathname.split("/");
			    route=route[route.length-2];
			    console.log('route -> '+route);
				switch(route) {
					case "login":
						$('#sign_in-button').on('click',function(event) {
							event.preventDefault();
							app.do.login();
						});
					break;
					case "members":
						app.do.getInfo();
						$('.register-btn').on('click',function(event) {
							event.preventDefault();
							app.do.registration();
						});
					break;
					case "deposit":
						if (!localStorage.getItem("mmUserName")) {
							app.do.goto("login");
							return;
						}
						$('.user-name').text(window.localStorage.getItem("mmUserName"));
						$('#logout-btn').on('click',function(event) {
							event.preventDefault();
							app.do.logout();
						});
					break;
					case "":
					case app.var.path:
						console.log(app.var.path);
						$('.scroll-form-button').on('click',function(event) {
							event.preventDefault();
							$('#scrollForm').attr('action','members/?br=no&amp;ot=0f68b744b1ce8941cb68d151a8c34d35&amp;lang=en&amp;offer_id=0&amp;aff_id=0&full_name='+$('#name3').val()+'&email='+$('#emailpu3').val() );
								if(!(/^[+a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i.test($('#emailpu3').val()))){
						        alert('Please enter a valid email');
						        $('#emailpu3').focus();
						        return false;
						      }
						      else{
						        if(onsubmitfix){
						          yesyoucan = 0;
						          onsubmitfix = 0;
						        }
						        else return false;
						      };

							$('#scrollForm').submit();
						});
				}
			},
			goto:function(to){
				var paths = location.pathname.split('/');
				paths[ paths.length-2 ] = to;
				location.pathname = paths.join('/');
			}
		}
	}

$(document).ready(function($) {
	app.do.run();
});