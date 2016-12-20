$(document).ready(function(){
	$('.svg-placeholder').html(SVG_SPRITE);
	
	$.ajaxSetup({ cache: true });
		$.getScript('//connect.facebook.net/ru_RU/sdk.js', function(){
			FB.init({
				appId: '1176530762424849',
				version: 'v2.5'
			});     
		//$('#loginbutton,#feedbutton').removeAttr('disabled');
		//FB.getLoginStatus(updateStatusCallback);
	});
	
	$('.form__checkbox').on('change', function(){
		$(this).parent('label').toggleClass('active');
	});
	
	var role;
	
	$('.js-role').on('click', function(){
		$('.js-role').not($(this)).removeClass('active');
		$(this).addClass('active');
		role = $(this).attr('data-role');
		$('.page').removeClass('role-100 role-011 role-010 role-001').toggleClass('role-'+role);
		$('.form__item').each(function(){
			if($(this).attr('data-role') & role){
				$(this).addClass('visible');
			} else {
				$(this).removeClass('visible');
			}
		});
		$('html, body').animate({scrollTop: $('#form')[0].offsetTop - 50}, 'slow');
		$('#form').removeClass('invis');
	});
	
	var cardsReq = $.getJSON("card-content.json", function(data){
		var cardDefault = "turtle";
		var card = data[cardDefault];
		fillCard(card);
	});
	
	cardsReq.success(function(data){
		if(location.hash){
			getCard(data[(location.hash).slice(1)]);
		}
	});
	
	$('.js-get-card').on('click', function(e){
		e.preventDefault();
		var formID = role & 100 ? '100' : '011';
		var roleForm = document.forms['form-'+formID];
		var checkedValues = [];
		for(var i = 0; i < roleForm.elements.length; i++) {
			if(roleForm.elements[i].checked){
				checkedValues.push(roleForm.elements[i].value);
			}
		}
		cardVariant = getCardVariant(role,checkedValues);
	
		cardsReq.success(function(data){
			getCard(data[cardVariant]);
		});
	});
	
});

function fillCard(card){
	clearCard();
	if(card.img){
		$('#card-img').append('<img src="'+card.img+'" alt="New Year Picture"/>');
	}
	if(card.addr){
		$('#card-content').append('<div class="card__addr">'+card.addr+'</div>');
	}
	if(card.title){
		$('#card-content').append('<div class="card__title">'+card.title+'</div>');
	}
	if(card.text){
		$('#card-content').append('<div class="card__text">'+card.text+'</div>');
	}
	$('.img-placeholder').html('<img src="'+card.fullImg+'" alt="New Year Picture"/>');
	$('meta[property="og:description"]').attr('content', card.hashTags);
	$('meta[property="og:image:url"]').attr('content', location.host+location.pathname+card.fullImg);
};
function clearCard(){
	$('#card-img').html('');
	$('#card-content').html('');
};
function getCard(activeCard){
	fillCard(activeCard);
	$('html, body').animate({scrollTop: $('.envelope')[0].offsetTop - 50}, 'slow');
	$('#card').removeClass('invis');
	location.hash = activeCard.urlHash;
	updateShareButtons(activeCard.hashTags, activeCard.fullImg);
};

function getCardVariant(role,arrValues){
	arrValues = arrValues.map(function(item){
		return parseInt(item, 10);
	});
	var variantID;
	if (role & '010') {
		if(arrValues.length >= 4){
			variantID = "partner-congrat";
		} else {
			variantID = "partner-opport";
		}
	} else if (role & '001') {
		if(arrValues.length >= 4){
			variantID = "colleague-congrat";
		} else {
			variantID = "colleague-opport";
		}
	} else {
		var sum = arrValues.reduce(add,0);
		var arr4 = arrValues.filter(function(number){
			return number%10;
		});
		if (arrValues.filter(fromTo(401,404,406)).length == 5) {
			variantID = "sibur";
		} else if (!!~arrValues.indexOf(407)) {
			variantID = "gpn";
		} else if (arrValues.filter(fromTo(700, 1300)).length == 7) {
			variantID = "detective";
		} else if ((arrValues.length <= 5) && (arrValues.filter(compare([600,700,900,1300,1400])).length >=3) && 
			!(arrValues.filter(compare([100,200,300,400,500,800,1000,1100,1200,1500,1600])).length > 0)) {
			variantID = "client-drinks";
		} else if ((arrValues.length == 0) || 
			(arrValues.filter(fromTo(1000,1400,800)).length >= 1 && 
			arrValues.filter(fromTo(1000,1400,800)).length <= 3)) {
			variantID = "iceage";
		} else if (
			(arrValues.filter(fromTo(600, 1400)).length >= 3) &&
			!(arrValues.filter(fromTo(100, 500)).length >= 3) &&
			!(arrValues.filter(fromTo(1500, 1600)).length >= 3)){
			variantID = "weisenheimer";
		} else if (
			(!!~arrValues.indexOf(900) && arrValues.length == 1) ||
			(!!~arrValues.indexOf(900) && !!~arrValues.indexOf(1300)) && arrValues.length == 2) {
			variantID = "labmediaman";
		} else if (arrValues.length == 1 && !!~arrValues.indexOf(1300)) {
			variantID = "client-stopdrinks";
		} else if ((
			(arrValues.filter(fromTo(100, 300, 500)).length >= 2 && arrValues.filter(fromTo(100, 300, 500)).length <= 3) || 
			(arrValues.filter(fromTo(600, 1600)).length > 0)) && 
			(!arrValues.filter(fromTo(401,409)).length)) {
			variantID = "client-congrat-el";
		} else if (((arr4.length >= 2 && arr4.length <= 4) 
			|| (arrValues.filter(fromTo(500, 1600)).length > 0)) &&
			(!arrValues.filter(fromTo(100,300,500)).length)) {
			variantID = "client-congrat-hr";
		} else if ((
				((arrValues.filter(fromTo(100, 300, 500)).length >= 1) && (arr4.length >= 1 && arr4.length <= 2)) || 
				(arrValues.filter(compare([600,1000,1100,1400])).length == 4)
			) && !(arrValues.filter(compare([700,800,900,1200,1300,1500,1600])).length > 0)) {
			variantID = "client-congrat";
		} else if ((
			(arrValues.filter(compare([100,200])).length >=1) &&
			(arrValues.filter(compare([401,408,409,500,800,900])).length == 6) || 
			(arrValues.filter(fromTo(1000,1500)).length == 6)) &&
			(!arrValues.filter(compare([300,402,403,404,405,406,407,600,700])).length)){
			variantID = "sinergia";
		} else if (arrValues.length >= 11 && arr4.length >= 2) {
			variantID = "yraking";
		} else {
			variantID = "turtle";
		}
	}
	return variantID;
};

function add(a,b){
	return a + b;
};
function fromTo(from, to, plus){
	return function(number) {
		if(plus){
			return ((number >= from && number <= to) || (number == plus));
		} else {
			console.log();
			return (number >= from && number <= to);
		}
	}
};
function compare(arr){
	return function(number) {
		return !!~arr.indexOf(number);
	};
};

function updateShareButtons(hashTags, img){
	var title = $('meta[property="og:title"]').attr('content');
	var url = location.href;
	var fullImgPath = location.host+location.pathname+img;
	console.log(url, fullImgPath);
	updateVKButton(url, title, hashTags, fullImgPath);
	updateFBButton(url, title, hashTags, fullImgPath);
};
function updateVKButton(url, title, desc, img){
	$('#vk-share-button').html(VK.Share.button({
		'url': url,
		'title': title,
		'description': desc,
		'image': img,
		//'noparse': true
	},{
		'type': 'custom',
		'text': '<svg class="icon"><use xlink:href="#vk"/></svg>'
	}));
};
function updateFBButton(url, title, desc, img){
	var appID = 1176530762424849;
	$('#fb-share-button > a').attr('href', 'https://www.facebook.com/sharer/sharer.php?u='+url+'&src=sdkpreparse');
	/*FB.ui({
		method: 'share',
		href: url,
		display: 'popup',
		href: url,
		hashtag: desc,
		mobile_iframe: true
	}, function(response){});*/
};