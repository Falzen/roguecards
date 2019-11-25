
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
console.log('settings : ', settings)
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
	},
	{
		id: 'sword1',
		type: 'equipment',
		name: 'sword',
		img_name: 'sword1.png'
	}/*,
	{
		type: 'nothing'
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





$(document).ready(function() {
	setStartingData();
	createTable();
	createHand();
	$(".card").click(function () {
        $(this).toggleClass("is-flipped");
    });

});

function makeCardsToGenerate() {
	var cardsToGenerate = [];
	//TODO ajuster les quantités de chaque type

	var items = cardsByTypeMap.get('items');
	var enemies = cardsByTypeMap.get('enemies');
	debugger;
	for(var i=0; i<2; i++) {
		var temp = items[getRandomInt(0, items.length-1)];
		cardsToGenerate.push(temp);
	}
	for(var i=0; i<2; i++) {
		var temp = enemies[getRandomInt(0, enemies.length-1)];
		cardsToGenerate.push(temp);
	}
	return cardsToGenerate;
}




function cardDomFactory(data) {
	var cardHtml = '';
	cardsIdCpt++;
	switch(data.type) {
		case 'item':
			cardHtml += '<li id="' + cardsIdCpt + '" class="card-container item">';
				cardHtml += '<div class="card">';
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

		case 'equipment':
			cardHtml += '<li id="' + cardsIdCpt + '" class="card-container equipment">';
				cardHtml += '<div class="card">';
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
			cardHtml += '<li id="' + cardsIdCpt + '" class="card-container enemy">';
				cardHtml += '<div class="card">';
					cardHtml += '<div class="card__face card__face--front">';
					cardHtml += '</div>';
					cardHtml += '<div class="card__face card__face--back">';
						cardHtml += '<div class="card-content">';
							cardHtml += '<img src="img/cards_illus/' + data.img_name +'" />';
							cardHtml += '<p class="stats"><span class="attack">' + data.attack + '</span><span class="health">' + data.health + '</span></p>';
							cardHtml += '<p class="name">' + data.name + '</p>';
							cardHtml += '<div class="description">equipment equipment</div>';
						cardHtml += '</div>';
					cardHtml += '</div>';
				cardHtml += '</div>';
			cardHtml += '</li>';
		break;

		case 'nothing':
			cardHtml += '<li id="' + cardsIdCpt + '" class="card-container nothing">';
				cardHtml += '<div class="card">';
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

	for (var i = 0; i < settings.nbCardsInHand; i++) {
		var oneCard = cardDomFactory(cardsType_items[getRandomInt(0,cardsType_items.length-1)]);
		cardsInnerHtml += oneCard;
	}
	$('#hand_CardsContainer').html(cardsInnerHtml);
}

function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}

function pickUpCard() {

}