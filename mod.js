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
					$('#ti1form-area_code').val(data.country_calling_code);
				});
			},
			login:function(email,password){
				$.ajax({
					"xhrFields": { withCredentials: true },
					"url": "https://api.platinumstrade.com/account/logon",
					"method": "POST",
					"data": {	"email":email,
								"password":password
							}
				}).done(function (response,status,xhr) {
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
				});
			},
			registration:function(i){//1 top , 0 main
				$.ajax({
					url: 'https://api.platinumstrade.com/Registration/Full',
					type: 'GET',
					xhrFields: { withCredentials: true },
					data:{	
						FirstName:$('#ti'+i+'form-first_name').val(),
						LastName: $('#ti'+i+'form-last_name').val(),
						Email: 	  $('#ti'+i+'form-email').val(),
						Password: $('#ti'+i+'form-password').val(),
						PhoneCountry: getInfo.country_calling_code.replace('+',''),
						PhoneOperator:$('#ti'+i+'form-phone').val().substring(0,3),
						PhoneNumber:  $('#ti'+i+'form-phone').val().substring(3,$('#ti'+i+'form-phone').val().length),
						Country:getInfo.country,
						Terms:    true
					},
				})
				.done(function(response) {
					app.do.login($('#ti'+i+'form-email').val(),$('#ti'+i+'form-password').val());
					console.log(response);
				})
				.fail(function(response) {
					console.log(JSON.parse(response.responseText).message);
					errors=JSON.parse(response.responseText).message;
					alert(errors.replace(/\. /g,'\n'));
				});
			},
			main:function(){
				var action='members/?br=no&amp;ot=0f68b744b1ce8941cb68d151a8c34d35&amp;lang=en&amp;offer_id=0&amp;aff_id=0&';
				$('.scroll-form-button').on('click',function(event) {
					event.preventDefault();
					$('#scrollForm').attr('action',action+'&full_name='+$('#name3').val()+'&email='+$('#emailpu3').val() );
						if(!(/^[+a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i.test($('#emailpu3').val()))){
				        alert('Please enter a valid email');
				        $('#emailpu3').focus();
				        return false;
				      }
					$('#scrollForm').submit();
				});
				$('.reg-btn-footer').on('click',function(event) {
					event.preventDefault();
					$('.footer-form').attr('action',action+'&full_name='+$('.footer-name').val()+'&email='+$('.footer-email').val() );
						if(!(/^[+a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i.test($('.footer-email').val()))){
				        alert('Please enter a valid email');
				        $('.footer-form').focus();
				        return false;
				      }
					$('.footer-form').submit();
				});
				$('.main-submit_btn').on('click',function(event) {
					event.preventDefault();
					$('.main_from').attr('action',action+'&full_name='+$('.main-name').val()+'&email='+$('.main-email').val() );
					if(!(/^[+a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i.test($('.main-email').val()))){
			        	alert('Please enter a valid email');
			        	$('.main-email').focus();
			        	return false;
			      	}
					$('.main_from').submit();
				});

				$('.e_submit').on('click',function(event) {
					event.preventDefault();
					$('.e_form').attr('action',action+'&email='+$('.e_email').val() );
					if(!(/^[+a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i.test($('.e_email').val()))){
				        alert('Please enter a valid email');
				        $('.e_email').focus();
				        return false; 
				      }
					$('.e_form').submit();
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
							app.do.login($('#login').val(),$('#password').val());
						});
					break;
					case "members":
						app.do.getInfo();
						var url= new URL(window.location.href);
						if(url.searchParams.get('email')){
							$('#ti0form-email').val(url.searchParams.get('email'));
							$('#ti1form-email').val(url.searchParams.get('email'));
						}
						if(url.searchParams.get('full_name')){
							$('#ti0form-first_name').val(url.searchParams.get('full_name').split(" ")[0]);
							$('#ti0form-last_name').val(url.searchParams.get('full_name').split(" ")[1]);
							$('#ti1form-first_name').val(url.searchParams.get('full_name').split(" ")[0]);
							$('#ti1form-last_name').val(url.searchParams.get('full_name').split(" ")[1]);
						}
						$('.reg-btn-0').on('click',function(event) {
							event.preventDefault();
							app.do.registration(0);
						});
						$('.reg-btn-1').on('click',function(event) {
							event.preventDefault();
							app.do.registration(1);
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
					case app.var.domain:
						app.do.main();
					break;
				}
			},
			goto:function(to){
				var paths = location.pathname.split('/');
				paths[ paths.length-2 ] = to;
				location.pathname = paths.join('/');
			}
		}
	}
$(document).ready(function(){
	app.do.run();
});