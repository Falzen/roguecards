
var settings = JSON.parse(localStorage.settings);
var tableSettings = {
	cardSolts: 12
};
var cards = [
	{
		id: 'heal1',
		type: 'item',
		name: 'heal',
		img_name: 'heal1.png'
	}
];

$(document).ready(function() {
	setStartingData();
	createTable();    
	$(".card").click(function () {
        $(this).toggleClass("is-flipped");
    });

});
function cardDomFactory(data) {
	var cardHtml = '';
	switch(data.type) {
		case 'item':
			cardHtml += '<li class="card-container item">';
				cardHtml += '<div class="card">';
					cardHtml += '<div class="card__face card__face--front">';
					cardHtml += '</div>';
					cardHtml += '<div class="card__face card__face--back">';
						cardHtml += '<div class="card-content">';
									cardHtml += '<img src="img/cards_illus/' + data.img_name +'" />';
									cardHtml += '<p class="name"></p>';
									cardHtml += '<div class="description"></div>';
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

	for (var i = 0; i < tableSettings.cardSolts; i++) {
		var oneCard = cardDomFactory(cards[0]);
		cardsInnerHtml += oneCard;
	}
	$('#cards').html(cardsInnerHtml);
}