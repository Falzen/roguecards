
var settings = JSON.parse(localStorage.settings);

// settings de secours
if(!settings) {
	settings = {
		hero: {},
		cardsIdCpt: 0,
		nbCardsInHand: 3
	};
	settings.hero.name = 'NoOne';
}

var is_enemy_visible = false;
var visibleEnemies = [];
var floor_level = 1;

console.log('settings : ', settings);



var tableSettings = {
	cardSolts: 12
};



var cardsIdCpt = parseInt(settings.cardsIdCpt);

var cardsByTypeMap = new Map();
var cardsType_items = [
	{
		id: 'heal1',
		type: 'item',
		name: 'heal',
		img_name: 'heal1.png'
	},
	{
		id: 'scroll1',
		type: 'item',
		name: 'scroll',
		img_name: 'scroll1.png'
	}
];
cardsByTypeMap.set('items', cardsType_items);

var cardsType_enemies = [
	{
		id: 'rabite',
		type: 'enemy',
		name: 'rabite',
		img_name: 'rabite.gif',
		attack: 1,
		health: 3
	},
	{
		id: 'dinofish',
		type: 'enemy',
		name: 'dinofish',
		img_name: 'dinofish.gif',
		attack: 2,
		health: 1
	},
	{
		id: 'beastzombie',
		type: 'enemy',
		name: 'beastzombie',
		img_name: 'beastzombie.gif',
		attack: 2,
		health: 5
	},
];
cardsByTypeMap.set('enemies', cardsType_enemies);
var enemiesByNameMap = new Map();
for (var i = 0; i < cardsType_enemies.length; i++) {
	enemiesByNameMap.set(cardsType_enemies[i].name, cardsType_enemies[i]);
}

var cardsType_weapons = [
	{
		id: 'sword1',
		type: 'weapon',
		name: 'sword',
		attack: 2,
		health: 2,
		img_name: 'sword1.png'
	}
];
cardsByTypeMap.set('weapons', cardsType_weapons);






/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

$(document).ready(function() {
	setStartingData();
	createTable();
	createHand();
	cardsClickListener();

});


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

var $hand = $("#hand_CardsContainer");

function newTurnChecks() {
	if(is_enemy_visible) {

	}
}


function cardsClickListener() {
	$(".card:not(.nothing)").click(function () {
		
		// turn over
        if(!$(this).hasClass("is-flipped")) {
        	$(this).addClass("is-flipped");
        	// enemy
        	if($(this).parent().hasClass("enemy")) {
        		is_enemy_visible = true;
        		visibleEnemies.push({
        			'id': $(this).parent().attr('id'),
        			'name': $(this).find('.name')[0].textContent
        		});
        		console.log('visibleEnemies : ', visibleEnemies);
        		endOfTurn('just_discovered_new_enemy');
        	} 
        	else {
				endOfTurn();
        	}
        	return;
        }


    	// exit
    	else if(
    		$(this).hasClass("is-flipped")
    		&& $(this).parent().hasClass("exit")
		) {
    		floor_level++;
    		createTable();
			cardsClickListener();
    		alert('floor_level : ' + floor_level);
    		endOfTurn();
        	return;
    	}


		// is FROM hand
    	else if(
    		$(this).hasClass("is-flipped")
    		&& $(this).hasClass("hand")
		) {
			// WEAPON
			if($(this).parent().hasClass("weapon")) {
				prepareAttack($(this));
				//doAttack(null, $(this));
				/*
				var durability = $(this).find('.health')[0].textContent;
				if(durability != 0) {
					alert("attack for " + $(this).find('.attack')[0].textContent);	
					durability = parseInt(durability) - 1;
					$(this).find('.health')[0].textContent = durability;
				}
				if(durability == 0) {
					$(this).parent().remove();
				}
				*/

			}
        	return;
    	}



        //take into hand
        else if(
        	$(this).hasClass("board") // on the board
        	&& !$(this).parent().hasClass("exit") // is NOT the exit card
        	&& !$(this).parent().hasClass("enemy") // is NOT an enemy card
        	&& $(this).hasClass("is-flipped") // is visible
        	&& $hand[0].childNodes.length < 5 // enough room in hand
		){
        	var clickedId = $(this).parent().attr('id');
        	//TODO $(this).removeClass('board').addClass('in_hand');
        	$(this).parent().clone().appendTo($hand);
	    	$(this).parent().replaceWith('<li id="'+clickedId+'" class="card-container nothing"><div class="card nothing board"><div class="card__face card__face--front"></div><div class="card__face card__face--back"><div class="card-content"></div></div></div></li>');
	    	endOfTurn();
	    	return;
    	}


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
    });
}

function prepareAttack(whatWith) {
	for (var i = 0; i < visibleEnemies.length; i++) {
		$('#'+visibleEnemies[i].id)
			.addClass('is_potential_target')
			.off('click')
			.on('click', function(ev) {
				debugger;
			doAttack($(this), whatWith);
		});
	}
}

function doAttack(whom, whatWith) {
	var durability = whatWith.find('.health')[0].textContent;
	if(durability != 0) {
		alert("attack for " + whatWith.find('.attack')[0].textContent);	
		doDamage(whom, whatWith.find('.attack')[0].textContent);
		durability = parseInt(durability) - 1;
		whatWith.find('.health')[0].textContent = durability;
	}
	if(durability == 0) {
		whatWith.parent().remove();
	}
			
}

function doDamage(victime, damageAmout) {
	debugger;
	var victimeHealth = parseInt(victime.find('.health')[0].textContent);
	victime.find('.health')[0].textContent = victimeHealth - parseInt(damageAmout);
}

function endOfTurn() {
	endOfTurn('nothing_special');
}
function endOfTurn(what) {
	//check si enemies visibles.
	if(is_enemy_visible) {
		// TODO do damage
		for (var i = 0; i < visibleEnemies.length; i++) {
			if(what == 'just_discovered_new_enemy' && i == visibleEnemies.length-1) {
				break;
			}
			alert('ouch from ' + visibleEnemies[i].name);
		}
	}
}

function makeCardsToGenerate() {
	var cardsToGenerate = [];

	var items = cardsByTypeMap.get('items');
	var enemies = cardsByTypeMap.get('enemies');

	theCard = {type: 'exit'};
	cardsToGenerate.push(theCard);
	theCard = {type: 'nothing'};
	cardsToGenerate.push(theCard);
	theCard = {type: 'nothing'};
	cardsToGenerate.push(theCard);
	theCard = {type: 'nothing'};
	cardsToGenerate.push(theCard);
	theCard = {type: 'nothing'};
	cardsToGenerate.push(theCard);

	for(var i=0; i<7; i++) {
		var rand = getRandomInt(1,100);
		var theCard = {};
		if(rand <= 25) {
			theCard = enemies[getRandomInt(0, enemies.length-1)]
		}
		else {
			theCard  = items[getRandomInt(0, items.length-1)]
		}

		cardsToGenerate.push(theCard);
	}
	cardsToGenerate.sort(function() { return 0.5 - Math.random() });
	return cardsToGenerate;
}




function cardDomFactory(data, where) {
	where = where != undefined ? where : 'board';
	var cardHtml = '';
	cardsIdCpt++;
	switch(data.type) {
		case 'item':
			cardHtml += '<li id="cardid_' + cardsIdCpt + '" class="card-container item">';
				cardHtml += '<div class="card ' + where;
				if(where == 'hand') {
					cardHtml += ' is-flipped';
				}
				cardHtml += '">';
					cardHtml += '<div class="card__face card__face--front">';
					cardHtml += '</div>';
					cardHtml += '<div class="card__face card__face--back">';
						cardHtml += '<div class="card-content">';
							cardHtml += '<img src="img/cards_illus/' + data.img_name +'" />';
							cardHtml += '<p class="name">' + data.name + '</p>';
							cardHtml += '<div class="description"></div>';
						cardHtml += '</div>';
					cardHtml += '</div>';
				cardHtml += '</div>';
			cardHtml += '</li>';
		break;
		
		case 'weapon':
			cardHtml += '<li id="cardid_' + cardsIdCpt + '" class="card-container weapon">';
				cardHtml += '<div class="card ' + where;
				if(where == 'hand') {
					cardHtml += ' is-flipped';
				}
				cardHtml += '">';
					cardHtml += '<div class="card__face card__face--front">';
					cardHtml += '</div>';
					cardHtml += '<div class="card__face card__face--back">';
						cardHtml += '<div class="card-content">';
							cardHtml += '<img src="img/cards_illus/' + data.img_name +'" />';
							cardHtml += '<p class="stats"><span class="attack">' + data.attack + '</span><span class="health">' + data.health + '</span></p>';
							cardHtml += '<p class="name">' + data.name + '</p>';
							cardHtml += '<div class="description"></div>';
						cardHtml += '</div>';
					cardHtml += '</div>';
				cardHtml += '</div>';
			cardHtml += '</li>';
		break;

		case 'equipment':
			cardHtml += '<li id="cardid_' + cardsIdCpt + '" class="card-container equipment">';
				cardHtml += '<div class="card ' + where;
				if(where == 'hand') {
					cardHtml += ' is-flipped';
				}
				cardHtml += '">';
					cardHtml += '<div class="card__face card__face--front">';
					cardHtml += '</div>';
					cardHtml += '<div class="card__face card__face--back">';
						cardHtml += '<div class="card-content">';
							cardHtml += '<img src="img/cards_illus/' + data.img_name +'" />';
							cardHtml += '<p class="name">' + data.name + '</p>';
						cardHtml += '</div>';
					cardHtml += '</div>';
				cardHtml += '</div>';
			cardHtml += '</li>';
		break;

		case 'enemy':
			cardHtml += '<li id="cardid_' + cardsIdCpt + '" class="card-container enemy">';
				cardHtml += '<div class="card ' + where + '">';
					cardHtml += '<div class="card__face card__face--front">';
					cardHtml += '</div>';
					cardHtml += '<div class="card__face card__face--back">';
						cardHtml += '<div class="card-content">';
							cardHtml += '<img src="img/cards_illus/' + data.img_name +'" />';
							cardHtml += '<p class="stats"><span class="attack">' + data.attack + '</span><span class="health">' + data.health + '</span></p>';
							cardHtml += '<p class="name">' + data.name + '</p>';
							cardHtml += '<div class="description"></div>';
						cardHtml += '</div>';
					cardHtml += '</div>';
				cardHtml += '</div>';
			cardHtml += '</li>';
		break;

		case 'exit':
			cardHtml += '<li id="cardid_' + cardsIdCpt + '" class="card-container exit">';
				cardHtml += '<div class="card ' + where;
				if(where == 'hand') {
					cardHtml += ' is-flipped';
				}
				cardHtml += '">';
					cardHtml += '<div class="card__face card__face--front">';
					cardHtml += '</div>';
					cardHtml += '<div class="card__face card__face--back">';
						cardHtml += '<div class="card-content">';
							cardHtml += '<img src="img/cards_illus/exit.png" />';
							cardHtml += '<div class="description"></div>';
						cardHtml += '</div>';
						cardHtml += '</div>';
				cardHtml += '</div>';
			cardHtml += '</li>';
		break;

		case 'nothing':
			cardHtml += '<li id="cardid_' + cardsIdCpt + '" class="card-container nothing">';
				cardHtml += '<div class="card ' + where;
				if(where == 'hand') {
					cardHtml += ' is-flipped';
				}
				cardHtml += '">';
					cardHtml += '<div class="card__face card__face--front">';
					cardHtml += '</div>';
					cardHtml += '<div class="card__face card__face--back">';
						cardHtml += '<div class="card-content">';
						cardHtml += '</div>';
						cardHtml += '</div>';
				cardHtml += '</div>';
			cardHtml += '</li>';
		break;

		default:
		break;
	}
	return cardHtml;
}
function setStartingData() {
	$('#name').text(settings.hero.name);
}
function createTable() {
	$('#cards').html('');
	var cardsInnerHtml = '';
	var cards = makeCardsToGenerate();
	for (var i = 0; i < cards.length; i++) {
		var oneCard = cardDomFactory(cards[i]);
		cardsInnerHtml += oneCard;
	}
	$('#cards').html(cardsInnerHtml);
}

function createHand() {
	var cardsInnerHtml = '';
	var items = cardsByTypeMap.get('items');
	var weapons = cardsByTypeMap.get('weapons');
	for (var i = 0; i < settings.nbCardsInHand-1; i++) {
		var oneCard = cardDomFactory(items[getRandomInt(0,items.length-1)], 'hand');
		cardsInnerHtml += oneCard;
	}

	var temp = cardDomFactory(weapons[getRandomInt(0,weapons.length-1)], 'hand');
	cardsInnerHtml += temp;
	
	$('#hand_CardsContainer').html(cardsInnerHtml);
}

function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}

function pickUpCard() {

}