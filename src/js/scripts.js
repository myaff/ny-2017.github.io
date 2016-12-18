$(document).ready(function(){
	$('.svg-placeholder').html(SVG_SPRITE);
	
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
	
	var req = $.getJSON("card-content.json", function(data){
		var cardDefault = 10;
		var card = data['v-'+cardDefault];
		getCard(card);
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
	
		if(req.status == 200){
			getCard(req.responseJSON['v-'+cardVariant]);
			$('html, body').animate({scrollTop: $('.envelope')[0].offsetTop - 50}, 'slow');
			$('#card').removeClass('invis');
		}
	});
	
});

function getCard(card){
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
};
function clearCard(){
	$('#card-img').html('');
	$('#card-content').html('');
};

function getCardVariant(role,arrValues){
	arrValues = arrValues.map(function(item){
		return parseInt(item, 10);
	});
	var variantID;
	if (role & '010') {
		if(arrValues.length >= 4){
			variantID = 2;
		} else {
			variantID = 1;
		}
	} else if (role & '001') {
		if(arrValues.length >= 4){
			variantID = 3;
		} else {
			variantID = 18;
		}
	} else {
		var sum = arrValues.reduce(add,0);
		var arr4 = arrValues.filter(function(number){
			return number%10;
		});
		if (arrValues.filter(fromTo(401,404,406)).length == 5) {
			variantID = 5;
		} else if (!!~arrValues.indexOf(407)) {
			variantID = 6;
		} else if (arrValues.filter(fromTo(700, 1300)).length == 7) {
			variantID = 9;
		} else if ((arrValues.length <= 5) && (arrValues.filter(compare([600,700,900,1300,1400])).length >=3) && 
			!(arrValues.filter(compare([100,200,300,400,500,800,1000,1100,1200,1500,1600])).length > 0)) {
			variantID = 15;
		} else if ((arrValues.length == 0) || 
			(arrValues.filter(fromTo(1000,1400,800)).length >= 1 && 
			arrValues.filter(fromTo(1000,1400,800)).length <= 3)) {
			variantID = 7;
		} else if (
			(arrValues.filter(fromTo(600, 1400)).length >= 3) &&
			!(arrValues.filter(fromTo(100, 500)).length >= 3) &&
			!(arrValues.filter(fromTo(1500, 1600)).length >= 3)){
			variantID = 8;
		} else if (
			(!!~arrValues.indexOf(900) && arrValues.length == 1) ||
			(!!~arrValues.indexOf(900) && !!~arrValues.indexOf(1300)) && arrValues.length == 2) {
			variantID = 11;
		} else if (arrValues.length == 1 && !!~arrValues.indexOf(1300)) {
			variantID = 16;
		} else if ((
			(arrValues.filter(fromTo(100, 300, 500)).length >= 2 && arrValues.filter(fromTo(100, 300, 500)).length <= 3) || 
			(arrValues.filter(fromTo(600, 1600)).length > 0)) && 
			(!arrValues.filter(fromTo(401,409)).length)) {
			variantID = 12;
		} else if (((arr4.length >= 2 && arr4.length <= 4) 
			|| (arrValues.filter(fromTo(500, 1600)).length > 0)) &&
			(!arrValues.filter(fromTo(100,300,500)).length)) {
			variantID = 13;
		} else if ((
				((arrValues.filter(fromTo(100, 300, 500)).length >= 1) && (arr4.length >= 1 && arr4.length <= 2)) || 
				(arrValues.filter(compare([600,1000,1100,1400])).length == 4)
			) && !(arrValues.filter(compare([700,800,900,1200,1300,1500,1600])).length > 0)) {
			variantID = 14;
		} else if ((
			(arrValues.filter(compare([100,200])).length >=1) &&
			(arrValues.filter(compare([401,408,409,500,800,900])).length == 6) || 
			(arrValues.filter(fromTo(1000,1500)).length == 6)) &&
			(!arrValues.filter(compare([300,402,403,404,405,406,407,600,700])).length)){
			variantID = 17;
		} else if (arrValues.length >= 11 && arr4.length >= 2) {
			variantID = 4;
		} else {
			variantID = 10;
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