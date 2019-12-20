/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
					--- Lexicon ---

	- make...:
		is to create a JS object, or a String that represents the DOM	of something.

	- create...:
		is to (possibly make and) actually insert new DOM into the page.

 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

$('body').on('click', '.cheat', function (ev) {
	cheat(ev.currentTarget.id);
});
function cheat(name) {
	switch(name) {
		case 'wallhack' :
			$('#cards .card__face--front .name').toggleClass('wallhack');
		break;
		case 'fullheal' :
			settings.hero.hp = settings.hero.hpmax;
			setHeroHp();
		break;
		default:
		break;
	}
}

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

		Ready --ready

 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
 	var settings = JSON.parse(localStorage.settings);
	if(!settings) { // settings de secours
		settings = createSettingsByHeroName('Seeryn');
	}
	var is_enemy_visible = false;
	var is_card_equipped = false;
	var card_equipped_id = null;
	var activeEnemies = [];
	var logs = $('#logs');
	var tableSettings = {

	};
	var cardsIdCpt = parseInt(settings.cardsIdCpt);
	var $hand = $("#hand_CardsContainer");
	$(document).ready(function() {
		setStartingData();
		createTable();
		createHand();
		cardsClickListener();
cheat('wallhack');

	});



/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

		Click listeners --listeners

 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
function cardsClickListener() {
	$('body').on('click', '.card', function () {

		if($(this).parent().hasClass('nothing')) {
			return;
		}
		// if no weapon equipped
		if($(this).parent().hasClass('is-fighting')) {
			return;
		}

		// switch with equipped card
		// if(card_equipped_id) {
		// 	swapCardsByDomId(card_equipped_id, $(this).parent()[0].id);
		// }

		// discover
        if(!$(this).hasClass("is-flipped")) {
        	discoverCard($(this), true);
        }

    	// exit
    	else if(
    		$(this).hasClass("is-flipped")
    		&& $(this).parent().hasClass("exit")
		) {
    		exitFloor();
    	}

		// is FROM hand
    	else if(
    		$(this).hasClass('is-flipped')
    		&& $(this).hasClass('hand')
		) {
			// WEAPON
			if($(this).parent().hasClass('weapon')) {
				if(is_enemy_visible) {
					prepareAttack($(this));
				}
				/*else{
					selectCard($(this));
				}*/
			}
			// ITEM
			if($(this).parent().hasClass('item')) {
				useItem($(this));
			}
    	}

        //take into hand
        else if(
        	$(this).hasClass("board") // on the board
        	&& !$(this).parent().hasClass("exit") // is NOT the exit card
        	&& !$(this).parent().hasClass("enemy") // is NOT an enemy card
        	&& $(this).hasClass("is-flipped") // is visible
        	&& $hand[0].childNodes.length < 5 // enough room in hand
		){
			takeIntoHand($(this));
    	}
    });
}
function discoverCard(clickedCard, isClicked) {
	cardTurningSimpleAnimation(clickedCard); // transition: all 0.4s ease
	// enemy
	if(clickedCard.parent().hasClass("enemy")) {
		is_enemy_visible = true;
		highlightWeaponsInHand();
		activeEnemies.push({
			'id': clickedCard.parent().attr('id'),
			'name': clickedCard.find('.name')[0].textContent,
			'just_discovered': true
		});
		clickedCard.parent().addClass('is-fighting');

		// get possible adjacent ids
		var thisId = parseInt(clickedCard.parent()[0].id.split('_')[1]);
		var adjacentCardsId = {
			up: thisId-4 > 0 ? 'cardid_'+(thisId-4) : null,
			right: thisId+1 <= settings.nb_rooms_per_floor ? 'cardid_'+(thisId+1) : null,
			down: thisId+4 <= settings.nb_rooms_per_floor ? 'cardid_'+(thisId+4) : null,
			left: thisId-1 > 0 ? 'cardid_'+(thisId-1) : null
		}
		console.log('adjacentCardsId : ', adjacentCardsId);

		// TODO attention aux retours à la ligne quand on vérifie !
		// check for enemies and show them too
		if(isClicked) {
			if(
				adjacentCardsId.up
				&& !$('#'+adjacentCardsId.up).hasClass('nothing')
				&& $('#'+adjacentCardsId.up).hasClass('enemy')
			) {
				var clickableCard = $('#'+adjacentCardsId.up).find('.card');
				discoverCard(clickableCard, false);
			}
			if(
				adjacentCardsId.right
				&& !$('#'+adjacentCardsId.right).hasClass('nothing')
				&& $('#'+adjacentCardsId.right).hasClass('enemy')
			) {
				var clickableCard = $('#'+adjacentCardsId.right).find('.card');
				discoverCard(clickableCard, false);
			}
			if(
				adjacentCardsId.down
				&& !$('#'+adjacentCardsId.down).hasClass('nothing')
				&& $('#'+adjacentCardsId.down).hasClass('enemy')
			) {
				var clickableCard = $('#'+adjacentCardsId.down).find('.card');
				discoverCard(clickableCard, false);
			}
			if(
				adjacentCardsId.left
				&& !$('#'+adjacentCardsId.left).hasClass('nothing')
				&& $('#'+adjacentCardsId.left).hasClass('enemy')
			) {
				var clickableCard = $('#'+adjacentCardsId.left).find('.card');
				discoverCard(clickableCard, false);
			}
		}
		// shouldn't do attacks checks if enemy was discovered "by accident"
		if(isClicked == true) {
			endOfTurn();
		}
	}
	else {
		if(isClicked == true) {
			endOfTurn();
		}
	}
}
function exitFloor() {
	settings.floor_level++;
	setFloor();
	activeEnemies = [];
	createTable();
	endOfTurn();
}
function takeIntoHand(card) {
	var clickedId = card.parent().attr('id');
	card.removeClass('board').addClass('hand');
	card.parent().clone().appendTo($hand);
	card.parent().replaceWith('<li id="old_'+clickedId+'" class="card-container nothing"><div class="card nothing board"><div class="card__face card__face--front"></div><div class="card__face card__face--back"><div class="card-content"></div></div></div></li>');
	if(
		$('#'+clickedId).hasClass('weapon')
		&& is_enemy_visible) {
			highlightWeaponsInHand();
	}
	endOfTurn();
}
function highlightWeaponsInHand() {
	$('#hand_CardsContainer .weapon').addClass('is-equipable');
}
function unhighlightWeaponsInHand() {
	$('.is-equipable').removeClass('is-equipable');
}

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

		// Items function

 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
function useItem(item) {
	var itemId = item.parent().attr('data-itemid');
	switch(itemId) {
		case 'heal1' :
			var healAmount = 10;
			settings.hero.hp = parseInt(settings.hero.hp) + healAmount;
			settings.hero.hp = settings.hero.hp > settings.hero.hpmax ? settings.hero.hpmax : settings.hero.hp;
			setHeroHp();
			item.parent().addClass('item_is_used');
			setTimeout(function() {
				item.parent().remove();
			}, 300);
		break;
	}
}

function selectCard(card) {
	// if weapon already equipped
	if(card.parent().hasClass('card-equipped')) {
		// unequips weapon
		card.parent().removeClass('card-equipped');
		is_card_equipped = false;
		card_equipped_id = null;
		return;
	}
	$('.card-equipped').removeClass('card-equipped');

	card.parent().addClass('card-equipped');
	is_card_equipped = true;
	card_equipped_id = card.parent()[0].id;
}

function swapCardsByDomId(handCardId, roomCardId) {
}
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

		// Attack function

 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
function prepareAttack(whatWith) {
	// if weapon already equipped
	if(whatWith.parent().hasClass('weapon-equipped')) {
		// unequips weapon
		whatWith.parent().removeClass('weapon-equipped');
		// unhighlights enemies and removes click listener for attacking them
		for (var i = 0; i < activeEnemies.length; i++) {
			$('#'+activeEnemies[i].id)
				.removeClass('is_potential_target')
				.off('click');
		}
		return;
	}

	// unequips all weapons
	$('.weapon-equipped').removeClass('weapon-equipped');
	// equips selected weapon
	whatWith.parent().addClass('weapon-equipped');
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
        $('#' + weaponId).css({
        	zIndex: '1000'
        }).animate({
			top: '0px'
		}, 200);
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
			whatWith.parent().removeClass('weapon-equipped');
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
	// if killing blow
	if(remainingHealth == 0) {
		var lg = {
			'txt': 'Bang! '+victime[0].dataset.name+' is dead.'
		};
		createLog(lg);
		// XP management
		var xpGained = enemiesByNameMap.get(victime[0].dataset.name).xp;
		setHeroXp(xpGained);
		// replaces enemy DOM with "nothing" card
		var victimeId = victime.attr('id');
		victime.replaceWith('<li id="dead_'+victimeId+'" class="card-container nothing"><div class="card nothing board"><div class="card__face card__face--front"></div><div class="card__face card__face--back"><div class="card-content"></div></div></div></li>');
		// removes dead enemy from active enemies list
		for (var i = 0; i < activeEnemies.length; i++) {
			if(activeEnemies[i].id == victimeId) {
				activeEnemies.splice(i, 1);
			}
		}
		// end of threat
		if(activeEnemies.length == 0) {
			is_enemy_visible = false;
			unhighlightWeaponsInHand();
		}
	}
}
function endAttack() {
	endOfTurn();

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
    	window.location.href = 'index.html';
    }
}



/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

		// checks

 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
function endOfTurn(what) {
	if(is_enemy_visible) {
		var readyEnemies = [];
		readyEnemies = readyEnemies.concat(activeEnemies);

		if(readyEnemies.length != 0) {
			doEnemiesAttacks(readyEnemies, 0);
		}
	}
}
function doEnemiesAttacks(enemies, cpt) {
	debugger;
	if(!enemies[cpt].just_discovered) {
		doEnemyAttackByEnemyId(enemies[cpt].id);	
	}
	else {
		enemies[cpt].just_discovered = false;
	}
	
	if(enemies.length > cpt+1) {
		setTimeout(function() {
			doEnemiesAttacks(enemies, ++cpt)
		}, 200);
	}
}


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

		// Cards factories

 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
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
	console.log('weapons : ', weapons);
	// 1 exit and 4 nothings = for() - 5

	for(var i=0; i<settings.nb_rooms_per_floor-5; i++) {
		var rand = getRandomInt(1,100);
		var theCard = {};
		if(rand <= 80) {
			theCard = enemies[getRandomInt(0, enemies.length-1)]
		}
		if(rand > 80 && rand <= 100) {
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
			cardHtml += '<li data-itemid="' + data.id + '" id="cardid_' + cardsIdCpt + '" class="card-container item ' + data.name + '"';
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
							cardHtml += '<p class="stats">&nbsp;</p>';
							cardHtml += '<p class="name">' + data.name + '</p>';
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
						cardHtml += '</div>';
					cardHtml += '</div>';
				cardHtml += '</div>';
			cardHtml += '</li>';
		break;
		
		case 'magic':
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
			cardHtml += '<li data-name="' + data.name + '" id="cardid_' + cardsIdCpt + '" class="card-container enemy"';
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


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

		// Start function

 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
function setStartingData() {
	$('#name').text(settings.hero.name);
	$('#hpMax').text(settings.hero.hpmax);
	setHeroHp();
	setHeroDef();
	$('#lvl .txt').text(1);
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
	/*for (var i = 0; i < settings.nb_CardsInHand_start-1; i++) {
		var oneCard = cardDomFactory(items[getRandomInt(0,items.length-1)], 'hand');
		cardsInnerHtml += oneCard;
	}*/

	var oneCard = cardDomFactory(items[getRandomInt(0,items.length-1)], 'hand');
	cardsInnerHtml += oneCard;

	var oneCard = cardDomFactory(weapons[getRandomInt(0,weapons.length-1)], 'hand');
	cardsInnerHtml += oneCard;
	
	$('#hand_CardsContainer').html(cardsInnerHtml);
}




/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

		Setters --setters

 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
function setHeroHp() {
	var percentage = (100*settings.hero.hp) / settings.hero.hpmax;
	$('#hpValue').text(settings.hero.hp);
	$('#hp').css({
	    'background': 'linear-gradient(120deg, red 0%, red '+percentage+'%, tomato '+percentage+'%, tomato 100%)'
	});
}
function setHeroDef() {
	$('#def').text(settings.hero.def);
	if(settings.hero.def == 0) {
		$('#def').hide();
	}
}
function setHeroXp(xpGained) {
	var nextLevelCap = settings.xp_steps[settings.hero.level];
	settings.hero.currentXp += parseInt(xpGained);
	if(parseInt(nextLevelCap) <= parseInt(settings.hero.currentXp)) {
		settings.hero.level++;
		$('#currentCharLevel').text(settings.hero.level);
		settings.hero.currentXp -= nextLevelCap;
	}
	var percentage = (100*settings.hero.currentXp) / nextLevelCap;
	$('#currentXp').css({
	    'width': percentage + '%'
	});
	$('#currentCharLevel').text(settings.hero.level);
}
function setFloor() {
	$('#currentFloor').text(settings.floor_level);
}


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

		// Utils

 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
function cardTurningSimpleAnimation(card) {
	card.addClass('is-flipped');
}
// check "If fancy animation" in page.css
function cardTurningFancyAnimation(card) {
	card.addClass("is_turning");
	setTimeout(function() {
		card.removeClass("is_turning").addClass('is_turning_2');
	}, 150);
	setTimeout(function() {
		card.removeClass("is_turning is_turning_2").addClass('is-flipped');
	}, 400);
}
function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
/*
					--- Documentation ---

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
