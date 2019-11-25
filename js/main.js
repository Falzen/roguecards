var settings = {
	hero: {},
	cardsIdCpt: 0,
	nbCardsInHand: 3
};


$(document).ready(function() {
	$('.char').click(function(ev) {
		settings.hero.name = ev.currentTarget.id;
		localStorage.settings = JSON.stringify(settings);
		window.location.href = 'page.html';

	});
});