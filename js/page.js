/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
/*
					--- Lexicon ---

	- make...:
		is to create a JS object, or a String that represents the DOM	of something.

	- create...:
		is to (possibly make and) actually insert new DOM into the page.
*/
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

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
console.log('settings : ', settings);
var is_enemy_visible = false;
var activeEnemies = [];
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
		img_name: 'heal1.png',
		description: 'heals for 10 hp'
	},
	/*{
		id: 'scroll1',
		type: 'item',
		name: 'scroll',
		img_name: 'scroll1.png'
	}*/
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
		health: 5,
		img_name: 'sword1.png'
	},
	{
		id: 'axe1',
		type: 'weapon',
		name: 'axe',
		attack: 5,
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
	$('body').on('click', '.card', function () {

		if($(this).parent().hasClass('nothing')) {
			return;
		}
		if($(this).parent().hasClass('is-fighting')) {
			return;
		}

		// discover
        if(!$(this).hasClass("is-flipped")) {
        	$(this).addClass("is-flipped");
        	// enemy
        	if($(this).parent().hasClass("enemy")) {
        		is_enemy_visible = true;
        		activeEnemies.push({
        			'id': $(this).parent().attr('id'),
        			'name': $(this).find('.name')[0].textContent
        		});
        		$(this).parent().addClass('is-fighting');
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
    		alert('floor_level : ' + floor_level);
    		// adjusts floor level DOM
    		$('#lvl .txt')[0].textContent = floor_level;
    		endOfTurn();
        	return;
    	}

		// is FROM hand
    	else if(
    		$(this).hasClass('is-flipped')
    		&& $(this).hasClass('hand')
		) {
			// WEAPON
			if($(this).parent().hasClass('weapon')) {
				prepareAttack($(this));
			}
			// ITEM
			if($(this).parent().hasClass('item')) {
				useItem($(this));
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
        	//TODO $(this).removeClass('board').addClass('hand');
        	$(this).removeClass('board').addClass('hand');
        	$(this).parent().clone().appendTo($hand);
	    	$(this).parent().replaceWith('<li id="old_'+clickedId+'" class="card-container nothing"><div class="card nothing board"><div class="card__face card__face--front"></div><div class="card__face card__face--back"><div class="card-content"></div></div></div></li>');
	    	endOfTurn();
	    	return;
    	}


    });
}



/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

		// Items function

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
function useItem(item) {
	var itemName = item.find('.name')[0].textContent;
	switch(itemName) {
		case 'heal' :

		break;
	}

}

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

		// Attack function

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

function prepareAttack(whatWith) {
	// if weapon already equipped
	if(whatWith.parent().hasClass('weapon-in-hand')) {
		// unequips weapon
		whatWith.parent().removeClass('weapon-in-hand');
		// unhighlights enemies and removes click listener for attacking them
		for (var i = 0; i < activeEnemies.length; i++) {
			$('#'+activeEnemies[i].id)
				.removeClass('is_potential_target')
				.off('click');
		}
		return;
	}

	// unequips all weapons
	$('.weapon-in-hand').removeClass('weapon-in-hand');
	// equips selected weapon
	whatWith.parent().addClass('weapon-in-hand');
	// highlights enemies and adds click listener for attacking them
	for (var i = 0; i < activeEnemies.length; i++) {
		$('#'+activeEnemies[i].id)
			.addClass('is_potential_target')
			.off('click')
			.on('click', function(ev) {
			doAttack($(this), whatWith);
		});
	}
}


function doAttack(whom, whatWith) {
	var durability = whatWith.find('.health')[0].textContent;
	// animation
	var weaponId = whatWith.parent().attr('id');
    $('#' + weaponId).css({
    	zIndex: '1000'
    }).animate({
		top: '-100px'
    }, 120,
    function() {
        $('#' + weaponId).animate({
			top: '0',
		}, 200)
    });
	// deal damages and adjusts weapon after animation completes
	setTimeout(function() {
		if(durability != 0) {
			//TODO adventure's events log system ! <3 <3 <3
			doDamage(whom, whatWith.find('.attack')[0].textContent);

			// adjust weapon's durability
			durability = parseInt(durability) - 1;
			whatWith.find('.health')[0].textContent = durability;
		}
		if(durability == 0) {
			// destroys weapon DOM
			whatWith.parent().remove();
		}
		else {
			// unequips weapon
			whatWith.parent().removeClass('weapon-in-hand');
		}
		endAttack();
	}, 300);
}

function doDamage(victime, damageAmout) {
	var victimeHealth = parseInt(victime.find('.health')[0].textContent);
	var remainingHealth = victimeHealth - parseInt(damageAmout);
	if(remainingHealth < 0) {
		remainingHealth = 0; // prevents overkill
	}
	// adjusts enemy's health DOM
	victime.find('.health')[0].textContent = remainingHealth;
	if(remainingHealth == 0) {
		var victimeId = victime.attr('id');
		// replaces enemy DOM with "nothing" card
		victime.replaceWith('<li id="dead_'+victimeId+'" class="card-container nothing"><div class="card nothing board"><div class="card__face card__face--front"></div><div class="card__face card__face--back"><div class="card-content"></div></div></div></li>');
		// removes dead enemy from active enemies list
		for (var i = 0; i < activeEnemies.length; i++) {
			if(activeEnemies[i].id == victimeId) {
				activeEnemies.splice(i, 1);
			}
		}
	}
}

function endAttack() {
	// unhighlights enemies
	for (var i = 0; i < activeEnemies.length; i++) {
		$('#'+activeEnemies[i].id)
			.removeClass('is_potential_target')
			.off('click');
	}
}

function doEnemyAttackByEnemyId(enemyId) {
	// animation
    $('#'+enemyId).css({
    	zIndex: '1000'
    }).animate({
		top: '100px'
    }, 120,
    function() {
        $('#'+enemyId).animate({
			top: '0',
		}, 200)
    });

    // damages
    var damageFromEnemy = parseInt($('#'+enemyId).find('.attack')[0].textContent);
    settings.hero.hp = parseInt(settings.hero.hp) - damageFromEnemy;
    setHeroHp();

    if(settings.hero.hp <= 0) {
    	alert('You\'re dead.');
    	alert('Mwahahaha.');
    }
}


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

		// checks

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

function endOfTurn(what) {
	if(is_enemy_visible) {
		var readyEnemies = [];
		readyEnemies = readyEnemies.concat(activeEnemies);

		if(what == 'just_discovered_new_enemy') {
			readyEnemies.length = readyEnemies.length-1;
		}

		if(readyEnemies.length != 0) {
			doEnemiesdAttacks(readyEnemies, 0);
		}
	}
}

function doEnemiesdAttacks(enemies, cpt) {
	doEnemyAttackByEnemyId(enemies[cpt].id);
	if(enemies.length > cpt+1) {
		setTimeout(function() {
			doEnemiesdAttacks(enemies, ++cpt)
		}, 200);
	}
}

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

		// Cards factories

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

function makeCardsToGenerate() {
	var cardsToGenerate = [];

	var items = cardsByTypeMap.get('items');
	var enemies = cardsByTypeMap.get('enemies');
	var weapons = cardsByTypeMap.get('weapons');

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
		if(rand <= 60) {
			theCard = enemies[getRandomInt(0, enemies.length-1)]
		}
		if(rand > 60 && rand <= 99) {
			theCard = weapons[getRandomInt(0, weapons.length-1)]
		}
		else {
			//theCard  = items[getRandomInt(0, items.length-1)]
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
			cardHtml += '<li id="cardid_' + cardsIdCpt + '" class="card-container item"';
			if(data.description) {
				cardHtml += 'title="' + data.description + '"';
			}
			cardHtml += '>';
			
				cardHtml += '<div class="card ' + where;
				if(where == 'hand') {
					cardHtml += ' is-flipped';
				}
				cardHtml += '">';
					cardHtml += '<div class="card__face card__face--front">';
						cardHtml += '<p class="name">' + data.name + '</p>';
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
			cardHtml += '<li id="cardid_' + cardsIdCpt + '" class="card-container weapon"';
			if(data.description) {
				cardHtml += 'title="' + data.description + '"';
			}
			cardHtml += '>';
			
				cardHtml += '<div class="card ' + where;
				if(where == 'hand') {
					cardHtml += ' is-flipped';
				}
				cardHtml += '">';
					cardHtml += '<div class="card__face card__face--front">';
							cardHtml += '<p class="name">' + data.name + '</p>';
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
			cardHtml += '<li id="cardid_' + cardsIdCpt + '" class="card-container equipment"';
			if(data.description) {
				cardHtml += 'title="' + data.description + '"';
			}
			cardHtml += '>';
			
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
			cardHtml += '<li id="cardid_' + cardsIdCpt + '" class="card-container enemy"';
			if(data.description) {
				cardHtml += 'title="' + data.description + '"';
			}
			cardHtml += '>';
			
				cardHtml += '<div class="card ' + where + '">'; // always board
					cardHtml += '<div class="card__face card__face--front">';
							cardHtml += '<p class="name">' + data.name + '</p>';
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
			cardHtml += '<li id="cardid_' + cardsIdCpt + '" class="card-container exit"';
			if(data.description) {
				cardHtml += 'title="' + data.description + '"';
			}
			cardHtml += '>';
			
				cardHtml += '<div class="card ' + where + '">'; // always board
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
			cardHtml += '<li id="cardid_' + cardsIdCpt + '" class="card-container nothing"';
			if(data.description) {
				cardHtml += 'title="' + data.description + '"';
			}
			cardHtml += '>';
			
				cardHtml += '<div class="card ' + where;
				// visible if in hand
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

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

		// Start function

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

function setStartingData() {
	$('#name').text(settings.hero.name);
	setHeroHp();
	setHeroDef();
	$('#lvl .txt').text(1);
}
function setHeroHp() {
	var percentage = (100*settings.hero.hp) / settings.hero.hpmax;
	$('#hp').text(settings.hero.hp)
	.css({
	    'background': 'linear-gradient(120deg, red 0%, red '+percentage+'%, tomato '+percentage+'%, tomato 100%)'
	});

}
function setHeroDef() {
	$('#def').text(settings.hero.def);
	if(settings.hero.def == 0) {
		$('#def').hide();
	}
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


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

		// Utils

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */


function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}

function pickUpCard() {

}


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
/*
					--- Documentation ---

newTurnChecks() //TODO
	Peut-être rien, beaucoup est déjà vérifié dans endOfTurn(what).


cardsClickListener()


prepareAttack(whatWith)


doAttack(whom, whatWith)


doDamage(victime, damageAmout)


endAttack()


endOfTurn(what)


makeCardsToGenerate()


cardDomFactory(data, where)


setStartingData()


createTable()


createHand()


getRandomInt(min, max)


pickUpCard()


*/
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
